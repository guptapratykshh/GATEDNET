/**
 * Test script for Members API
 * 
 * This file can be used to test the members API endpoints
 * Run with: node test-members-api.js
 */

const axios = require('axios');
const mongoose = require('mongoose');
const admin = require('firebase-admin');

// Mock Firebase auth for testing
const mockFirebase = () => {
  try {
    // Check if already initialized
    admin.app();
  } catch (error) {
    const serviceAccount = require('./src/gatenet-a1199-firebase-adminsdk-fbsvc-6f2fbe40fd.json');
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/gatenet');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test data
const testMember = {
  name: 'Test User',
  flat: 'A-101',
  contact: '9876543210'
};

// API URL
const API_URL = 'http://localhost:5000/api/members';

// Test functions
const testAddMember = async (token) => {
  console.log('\n--- Testing Add Member ---');
  try {
    const response = await axios.post(`${API_URL}/add`, testMember, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Member added:', response.data);
    return response.data.member._id;
  } catch (error) {
    console.error('Error adding member:', error.response?.data || error.message);
    return null;
  }
};

const testGetAllMembers = async (token) => {
  console.log('\n--- Testing Get All Members ---');
  try {
    const response = await axios.get(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Members fetched:', response.data.members.length);
    return response.data.members;
  } catch (error) {
    console.error('Error getting members:', error.response?.data || error.message);
    return [];
  }
};

const testUpdateMember = async (token, id) => {
  console.log('\n--- Testing Update Member ---');
  try {
    const response = await axios.put(`${API_URL}/${id}`, {
      ...testMember,
      name: 'Updated Test User'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Member updated:', response.data);
    return true;
  } catch (error) {
    console.error('Error updating member:', error.response?.data || error.message);
    return false;
  }
};

const testDeleteMember = async (token, id) => {
  console.log('\n--- Testing Delete Member ---');
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Member deleted:', response.data);
    return true;
  } catch (error) {
    console.error('Error deleting member:', error.response?.data || error.message);
    return false;
  }
};

// Main test function
const runTests = async () => {
  try {
    // Initialize Firebase
    mockFirebase();
    
    // Create a test token for API calls
    const customToken = await admin.auth().createCustomToken('test-user-id');
    const userCredential = await admin.auth().createUser({
      email: 'test@example.com',
      password: 'password123',
      displayName: 'Test User'
    }).catch(error => {
      // If user already exists, ignore the error
      if (error.code !== 'auth/email-already-exists') {
        throw error;
      }
      return { uid: 'test-user-id' };
    });
    
    console.log('Test user created/found. Starting API tests...');
    
    // Run test sequence
    let memberId = await testAddMember(customToken);
    if (memberId) {
      await testGetAllMembers(customToken);
      await testUpdateMember(customToken, memberId);
      await testDeleteMember(customToken, memberId);
      await testGetAllMembers(customToken); // Verify deletion
    }
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

// Connect to DB and run tests
connectDB().then(runTests); 