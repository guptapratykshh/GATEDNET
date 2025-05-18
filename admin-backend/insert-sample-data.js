const mongoose = require('mongoose');
const config = require('./src/config/config');

// Sample data
const sampleUsers = [
  {
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1234567890",
    role: "resident",
    flatNumber: "A101",
    societyId: "123",
    isVerified: true,
    createdAt: new Date()
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    phoneNumber: "+1987654321",
    role: "admin",
    flatNumber: "B202",
    societyId: "123",
    isVerified: true,
    createdAt: new Date()
  }
];

const sampleMaintenance = [
  {
    title: "Leaking Pipe",
    description: "Water leak in bathroom",
    category: "plumbing",
    priority: "high",
    status: "pending",
    location: {
      building: "A",
      floor: "1",
      area: "Bathroom"
    },
    reportedBy: "123",
    societyId: "123",
    createdAt: new Date()
  },
  {
    title: "Broken Light",
    description: "Light not working in corridor",
    category: "electrical",
    priority: "medium",
    status: "pending",
    location: {
      building: "B",
      floor: "2",
      area: "Corridor"
    },
    reportedBy: "123",
    societyId: "123",
    createdAt: new Date()
  }
];

async function insertSampleData() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB successfully!');

    // Insert users
    console.log('\nInserting sample users...');
    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    await User.insertMany(sampleUsers);
    console.log('Sample users inserted successfully!');

    // Insert maintenance requests
    console.log('\nInserting sample maintenance requests...');
    const Maintenance = mongoose.model('Maintenance', new mongoose.Schema({}, { strict: false }));
    await Maintenance.insertMany(sampleMaintenance);
    console.log('Sample maintenance requests inserted successfully!');

    // Verify the data
    console.log('\nVerifying inserted data...');
    const userCount = await User.countDocuments();
    const maintenanceCount = await Maintenance.countDocuments();
    console.log(`Total users: ${userCount}`);
    console.log(`Total maintenance requests: ${maintenanceCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
  }
}

// Run the script
insertSampleData(); 