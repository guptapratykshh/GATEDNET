const mongoose = require('mongoose');
const config = require('./src/config/config');

// Test schema
const testSchema = new mongoose.Schema({
  name: String,
  value: Number,
  timestamp: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', testSchema);

async function testDatabase() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB successfully!');

    // Create a test document
    console.log('\nCreating test document...');
    const testDoc = new Test({
      name: 'Test Document',
      value: 42
    });
    await testDoc.save();
    console.log('Test document created successfully!');

    // Retrieve the document
    console.log('\nRetrieving test document...');
    const retrievedDoc = await Test.findOne({ name: 'Test Document' });
    console.log('Retrieved document:', retrievedDoc);

    // Verify the data
    console.log('\nVerifying data...');
    if (retrievedDoc && retrievedDoc.name === 'Test Document' && retrievedDoc.value === 42) {
      console.log('Data verification successful!');
    } else {
      console.log('Data verification failed!');
    }

    // Clean up
    console.log('\nCleaning up...');
    await Test.deleteOne({ name: 'Test Document' });
    console.log('Test document deleted successfully!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed.');
  }
}

// Run the test
testDatabase(); 