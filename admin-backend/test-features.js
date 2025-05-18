/**
 * Test script for Announcements and Reminders API
 * 
 * This file can be used to test the API endpoints for announcements and reminders
 * Run with: node test-features.js
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
const testAnnouncement = {
  title: 'Test Announcement',
  message: 'This is a test announcement for API verification.'
};

const testReminder = {
  title: 'Test Reminder',
  description: 'This is a test reminder for API verification.',
  dueDate: new Date(Date.now() + 86400000), // Tomorrow
  priority: 'High'
};

// API URLs
const ANNOUNCEMENTS_URL = 'http://localhost:5000/api/announcements';
const REMINDERS_URL = 'http://localhost:5000/api/reminders';

// Test functions for Announcements
const testAddAnnouncement = async (token) => {
  console.log('\n--- Testing Add Announcement ---');
  try {
    const response = await axios.post(`${ANNOUNCEMENTS_URL}/add`, testAnnouncement, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Announcement added:', response.data);
    return response.data.announcement._id;
  } catch (error) {
    console.error('Error adding announcement:', error.response?.data || error.message);
    return null;
  }
};

const testGetAllAnnouncements = async (token) => {
  console.log('\n--- Testing Get All Announcements ---');
  try {
    const response = await axios.get(ANNOUNCEMENTS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Announcements fetched:', response.data.announcements.length);
    return response.data.announcements;
  } catch (error) {
    console.error('Error getting announcements:', error.response?.data || error.message);
    return [];
  }
};

const testDeleteAnnouncement = async (token, id) => {
  console.log('\n--- Testing Delete Announcement ---');
  try {
    const response = await axios.delete(`${ANNOUNCEMENTS_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Announcement deleted:', response.data);
    return true;
  } catch (error) {
    console.error('Error deleting announcement:', error.response?.data || error.message);
    return false;
  }
};

// Test functions for Reminders
const testAddReminder = async (token) => {
  console.log('\n--- Testing Add Reminder ---');
  try {
    const response = await axios.post(`${REMINDERS_URL}/add`, testReminder, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Reminder added:', response.data);
    return response.data.reminder._id;
  } catch (error) {
    console.error('Error adding reminder:', error.response?.data || error.message);
    return null;
  }
};

const testGetAllReminders = async (token) => {
  console.log('\n--- Testing Get All Reminders ---');
  try {
    const response = await axios.get(REMINDERS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Reminders fetched:', response.data.reminders.length);
    return response.data.reminders;
  } catch (error) {
    console.error('Error getting reminders:', error.response?.data || error.message);
    return [];
  }
};

const testToggleReminderStatus = async (token, id) => {
  console.log('\n--- Testing Toggle Reminder Status ---');
  try {
    const response = await axios.patch(`${REMINDERS_URL}/${id}/toggle`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Reminder status toggled:', response.data);
    return true;
  } catch (error) {
    console.error('Error toggling reminder status:', error.response?.data || error.message);
    return false;
  }
};

const testDeleteReminder = async (token, id) => {
  console.log('\n--- Testing Delete Reminder ---');
  try {
    const response = await axios.delete(`${REMINDERS_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Reminder deleted:', response.data);
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error.response?.data || error.message);
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
    
    // Test Announcements
    console.log('\n=== TESTING ANNOUNCEMENTS ===');
    let announcementId = await testAddAnnouncement(customToken);
    if (announcementId) {
      await testGetAllAnnouncements(customToken);
      await testDeleteAnnouncement(customToken, announcementId);
      await testGetAllAnnouncements(customToken); // Verify deletion
    }
    
    // Test Reminders
    console.log('\n=== TESTING REMINDERS ===');
    let reminderId = await testAddReminder(customToken);
    if (reminderId) {
      await testGetAllReminders(customToken);
      await testToggleReminderStatus(customToken, reminderId);
      await testDeleteReminder(customToken, reminderId);
      await testGetAllReminders(customToken); // Verify deletion
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