const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const TransportProfile = require('../models/TransportProfile');
const PickupPoint = require('../models/PickupPoint');
const Pool = require('../models/Pool');
const Trip = require('../models/Trip');
const Bus = require('../models/Bus');
const Rating = require('../models/Rating');
const Notification = require('../models/Notification');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campus_pool';
    console.log(`Connecting to MongoDB for seeding at: ${mongoUri}`);

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB.');

    // Clear existing data
    console.log('Clearing old records...');
    await Promise.all([
      User.deleteMany({}),
      TransportProfile.deleteMany({}),
      PickupPoint.deleteMany({}),
      Pool.deleteMany({}),
      Trip.deleteMany({}),
      Bus.deleteMany({}),
      Rating.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    console.log('Hashing passwords...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Create Users
    console.log('Creating demo users...');
    const users = await User.create([
      {
        name: 'Rahul Sharma',
        email: 'student@college.edu',
        passwordHash,
        role: 'STUDENT',
        collegeId: '22CSE1042',
        phone: '+91 98765 43210',
        department: 'Computer Science & Engineering',
        year: '3rd Year',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Pooja Reddy',
        email: 'pooja@college.edu',
        passwordHash,
        role: 'STUDENT',
        collegeId: '23IT2015',
        phone: '+91 98765 43211',
        department: 'Information Technology',
        year: '2nd Year',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Dr. Ananya Roy',
        email: 'faculty@college.edu',
        passwordHash,
        role: 'FACULTY',
        collegeId: 'FAC084',
        phone: '+91 98765 43212',
        department: 'Electronics & Communication',
        year: 'Faculty',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Vikram Rathore',
        email: 'admin@college.edu',
        passwordHash,
        role: 'TRANSPORT_ADMIN',
        collegeId: 'ADM002',
        phone: '+91 98765 43213',
        department: 'Campus Transport Operations',
        year: 'Staff',
        isVerified: true,
        isActive: true,
      },
      {
        name: 'Prof. K. Venkatesh',
        email: 'superadmin@college.edu',
        passwordHash,
        role: 'SUPER_ADMIN',
        collegeId: 'SUP001',
        phone: '+91 98765 43214',
        department: 'Dean of Student Affairs',
        year: 'Administration',
        isVerified: true,
        isActive: true,
      },
    ]);

    const [rahul, pooja, drAnanya, vikramAdmin, superAdmin] = users;

    // 2. Create Official Pickup Points
    console.log('Creating official pickup points...');
    const pickupPoints = await PickupPoint.create([
      {
        name: 'Miyapur Metro Station (Exit Gate A)',
        address: 'Miyapur Main Road, Near Pillar 32',
        area: 'Miyapur',
        landmark: 'Near Metro Gate A & Foot over bridge',
        latitude: 17.4968,
        longitude: 78.3614,
        isActive: true,
        createdBy: vikramAdmin._id,
      },
      {
        name: 'Kukatpally JNTU Circle',
        address: 'JNTU Main Gate, Mumbai Highway',
        area: 'Kukatpally',
        landmark: 'Opposite JNTU Bus Stop',
        latitude: 17.4938,
        longitude: 78.3914,
        isActive: true,
        createdBy: vikramAdmin._id,
      },
      {
        name: 'Hitec City Cyber Towers Crossroad',
        address: 'Madhapur Main Road, Cyber Towers',
        area: 'Hitec City',
        landmark: 'Under Cyber Towers flyover',
        latitude: 17.4504,
        longitude: 78.3808,
        isActive: true,
        createdBy: vikramAdmin._id,
      },
      {
        name: 'Gachibowli Stadium Junction',
        address: 'Old Mumbai Highway, Gachibowli',
        area: 'Gachibowli',
        landmark: 'Beside Indoor Stadium Entry Gate',
        latitude: 17.4435,
        longitude: 78.3582,
        isActive: true,
        createdBy: vikramAdmin._id,
      },
      {
        name: 'Secunderabad Railway Station (Clock Tower)',
        address: 'Station Road, Secunderabad',
        area: 'Secunderabad',
        landmark: 'Near Reservation Complex',
        latitude: 17.4344,
        longitude: 78.5013,
        isActive: true,
        createdBy: vikramAdmin._id,
      },
    ]);

    // 3. Create Transport Profiles
    console.log('Creating transport profiles...');
    await TransportProfile.create([
      {
        userId: rahul._id,
        homeLocation: {
          address: 'Mayuri Nagar, Miyapur',
          area: 'Miyapur',
          city: 'Hyderabad',
          latitude: 17.4968,
          longitude: 78.3614,
        },
        destination: {
          address: 'College Engineering Campus',
          campusName: 'Main Gate',
          latitude: 17.5449,
          longitude: 78.5718,
        },
        preferredPickupPoint: pickupPoints[0]._id,
        travelTime: '08:15',
        returnTime: '17:00',
        transportType: 'CAR',
        availableSeats: 3,
        requiresRide: false,
        offersRide: true,
        preferences: {
          genderPreference: 'ANY',
          smokingAllowed: false,
          musicAllowed: true,
          acAvailable: true,
          notes: 'Daily carpool from Miyapur to Campus. Friendly vibes, on time.',
        },
      },
      {
        userId: pooja._id,
        homeLocation: {
          address: 'KPHB 4th Phase',
          area: 'Kukatpally',
          city: 'Hyderabad',
          latitude: 17.4938,
          longitude: 78.3914,
        },
        destination: {
          address: 'College Engineering Campus',
          campusName: 'Main Gate',
        },
        preferredPickupPoint: pickupPoints[1]._id,
        travelTime: '08:20',
        returnTime: '17:00',
        transportType: 'CAR',
        availableSeats: 0,
        requiresRide: true,
        offersRide: false,
      },
      {
        userId: drAnanya._id,
        homeLocation: {
          address: 'Telecom Nagar, Gachibowli',
          area: 'Gachibowli',
          city: 'Hyderabad',
          latitude: 17.4435,
          longitude: 78.3582,
        },
        destination: {
          address: 'College Engineering Campus',
          campusName: 'Faculty Block B',
        },
        preferredPickupPoint: pickupPoints[3]._id,
        travelTime: '08:00',
        returnTime: '16:30',
        transportType: 'CAR',
        availableSeats: 3,
        requiresRide: false,
        offersRide: true,
        preferences: {
          genderPreference: 'ANY',
          smokingAllowed: false,
          musicAllowed: true,
          notes: 'Faculty commute. Calm driving, prompt 8:00 AM departure.',
        },
      },
    ]);

    // 4. Create Active Pools
    console.log('Creating active transport pools...');
    const pool1 = await Pool.create({
      name: 'Miyapur Fast Campus Express',
      creator: rahul._id,
      driver: rahul._id,
      members: [
        {
          user: pooja._id,
          pickupPoint: pickupPoints[0]._id,
          seatsRequested: 1,
          status: 'CONFIRMED',
          joinedAt: new Date(),
        },
      ],
      origin: {
        address: 'Miyapur Metro Station Gate A',
        area: 'Miyapur',
        latitude: 17.4968,
        longitude: 78.3614,
      },
      destination: {
        address: 'Campus Main Gate',
        campusName: 'Main Gate',
      },
      pickupPoint: pickupPoints[0]._id,
      departureTime: '08:15',
      estimatedArrival: '08:50',
      transportType: 'CAR',
      totalSeats: 4,
      availableSeats: 3,
      estimatedCostTotal: 160,
      costPerPerson: 80,
      recurring: true,
      recurrenceDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      notes: 'Clean Honda City with AC. Leaving strictly by 8:15 AM from Metro Gate A.',
      status: 'OPEN',
    });

    const pool2 = await Pool.create({
      name: 'Gachibowli Faculty & Scholar Pool',
      creator: drAnanya._id,
      driver: drAnanya._id,
      members: [],
      origin: {
        address: 'Gachibowli Stadium Junction',
        area: 'Gachibowli',
        latitude: 17.4435,
        longitude: 78.3582,
      },
      destination: {
        address: 'Faculty Academic Block',
        campusName: 'Academic Block',
      },
      pickupPoint: pickupPoints[3]._id,
      departureTime: '08:00',
      estimatedArrival: '08:45',
      transportType: 'CAR',
      totalSeats: 3,
      availableSeats: 3,
      estimatedCostTotal: 180,
      costPerPerson: 60,
      recurring: true,
      recurrenceDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      notes: 'Peaceful commute for students and faculty. Please arrive 5 minutes early.',
      status: 'OPEN',
    });

    // 5. Create Sample Trips
    console.log('Creating sample trip records...');
    const pastTrip = await Trip.create({
      poolId: pool1._id,
      driverId: rahul._id,
      passengerIds: [pooja._id],
      origin: 'Miyapur',
      destination: 'Campus Main Gate',
      pickupPoint: pickupPoints[0]._id,
      departureTime: new Date(Date.now() - 24 * 3600 * 1000), // yesterday
      arrivalTime: new Date(Date.now() - 24 * 3600 * 1000 + 40 * 60 * 1000),
      status: 'COMPLETED',
      totalCost: 160,
      costPerPerson: 80,
      driverContribution: 0,
      emergencyStatus: false,
    });

    // 6. Create Rating for the completed trip
    console.log('Creating sample ratings...');
    await Rating.create({
      tripId: pastTrip._id,
      rater: pooja._id,
      ratee: rahul._id,
      score: 5,
      feedback: 'Very punctual and polite driver. Safe driving and clean car!',
      role: 'AS_DRIVER',
    });

    // 7. Create College Buses
    console.log('Creating official college buses...');
    await Bus.create([
      {
        busNumber: 'BUS-101',
        routeName: 'Route 12: Miyapur - JNTU - Campus',
        driverName: 'Suresh Kumar',
        driverPhone: '+91 94401 23456',
        capacity: 50,
        currentStatus: 'ON_SCHEDULE',
        morningDeparture: '07:20',
        eveningReturn: '17:15',
        route: [
          { stopName: 'Miyapur Metro', estimatedTime: '07:20', order: 1 },
          { stopName: 'JNTU Circle', estimatedTime: '07:35', order: 2 },
          { stopName: 'Kukatpally Y Junction', estimatedTime: '07:45', order: 3 },
          { stopName: 'Balanagar X Roads', estimatedTime: '08:00', order: 4 },
          { stopName: 'College Campus Gate', estimatedTime: '08:45', order: 5 },
        ],
        pickupPoints: [pickupPoints[0]._id, pickupPoints[1]._id],
        isActive: true,
      },
      {
        busNumber: 'BUS-104',
        routeName: 'Route 24: Hitec City - Gachibowli - Campus',
        driverName: 'Mohd. Rafiq',
        driverPhone: '+91 94401 23457',
        capacity: 45,
        currentStatus: 'ON_SCHEDULE',
        morningDeparture: '07:15',
        eveningReturn: '17:15',
        route: [
          { stopName: 'Hitec City Cyber Towers', estimatedTime: '07:15', order: 1 },
          { stopName: 'Gachibowli Stadium', estimatedTime: '07:30', order: 2 },
          { stopName: 'Mehdipatnam Depot', estimatedTime: '07:55', order: 3 },
          { stopName: 'College Campus Gate', estimatedTime: '08:40', order: 4 },
        ],
        pickupPoints: [pickupPoints[2]._id, pickupPoints[3]._id],
        isActive: true,
      },
      {
        busNumber: 'BUS-108',
        routeName: 'Route 07: Secunderabad - ECIL - Campus',
        driverName: 'K. Narsing Rao',
        driverPhone: '+91 94401 23458',
        capacity: 52,
        currentStatus: 'ON_SCHEDULE',
        morningDeparture: '07:10',
        eveningReturn: '17:15',
        route: [
          { stopName: 'Secunderabad Clock Tower', estimatedTime: '07:10', order: 1 },
          { stopName: 'Malkajgiri X Roads', estimatedTime: '07:25', order: 2 },
          { stopName: 'ECIL Cross Roads', estimatedTime: '07:45', order: 3 },
          { stopName: 'College Campus Gate', estimatedTime: '08:35', order: 4 },
        ],
        pickupPoints: [pickupPoints[4]._id],
        isActive: true,
      },
    ]);

    // 8. Create Welcome Notifications
    console.log('Creating sample notifications...');
    await Notification.create([
      {
        recipient: rahul._id,
        type: 'POOL_JOIN',
        title: 'New Member Joined!',
        message: 'Pooja Reddy joined your pool "Miyapur Fast Campus Express".',
        relatedId: pool1._id.toString(),
        actionUrl: `/pools/${pool1._id}`,
        read: false,
      },
      {
        recipient: rahul._id,
        type: 'SYSTEM',
        title: 'Welcome to CampusPool',
        message: 'Your college identity 22CSE1042 has been verified by the transport department.',
        read: true,
      },
      {
        recipient: pooja._id,
        type: 'TRIP_COMPLETE',
        title: 'Trip Completed',
        message: 'You reached Campus safely yesterday. Rating submitted for Rahul.',
        read: true,
      },
    ]);

    console.log('=======================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=======================================================');
    console.log('DEMO ACCOUNTS:');
    console.log('1. Student:         student@college.edu    / password123');
    console.log('2. Faculty:         faculty@college.edu    / password123');
    console.log('3. Transport Admin: admin@college.edu      / password123');
    console.log('4. Super Admin:     superadmin@college.edu / password123');
    console.log('=======================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
