const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_pool';

    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(` MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Reconnection attempt will follow.');
    });

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('👉 TIP: Ensure your MongoDB server is running locally (e.g. net start MongoDB), or update MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
    // In dev, we can let the server stay alive to serve error diagnostics or retry
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed gracefully through app termination.');
  } catch (err) {
    console.error(`Error closing MongoDB connection: ${err.message}`);
  }
};

module.exports = { connectDB, closeDB };
