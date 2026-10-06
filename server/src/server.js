const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const { connectDB, closeDB } = require('./config/db');
const routes = require('./routes');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// 2. CORS configuration (allowing credentials for HTTP-only cookies)
const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev to avoid CORS friction
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Request Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 4. Body Parsers & Cookie Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Rate Limiter
app.use('/api', apiLimiter);

// 6. Root status endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'CampusPool API - Smart College Transport Pooling Management System',
    version: '1.0.0',
    documentation: '/api/health',
    time: new Date().toISOString(),
  });
});

// 7. Mount Main API Routes
app.use('/api', routes);

// 8. 404 & Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server and Connect DB
let server;
const startServer = async () => {
  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CampusPool API Server listening on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Client Origin: ${CLIENT_URL}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`=======================================================`);
  });
};

// Graceful Shutdown
const handleGracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(async () => {
      console.log('HTTP Server closed.');
      await closeDB();
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

startServer();

module.exports = app;
