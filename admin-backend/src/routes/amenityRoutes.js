const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenityController');
const { firebaseAuth } = require('../middleware/firebaseAuth');

// Apply Firebase authentication middleware to all routes
router.use(firebaseAuth);

// Get all amenity bookings
router.get('/bookings', amenityController.getAllAmenityBookings);

// Update amenity booking status
router.put('/bookings/:id/status', amenityController.updateAmenityBookingStatus);

module.exports = router; 