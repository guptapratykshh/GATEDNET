const express = require('express');
const router = express.Router();
const { getAllAmenities, getAllAmenityBookings, updateAmenityBookingStatus, deleteAmenity } = require('../controllers/AmenityController');
const { firebaseAuth } = require('../middleware/firebaseAuth');

// Protect routes with Firebase authentication
router.use(firebaseAuth);

// Get all amenities
router.get('/amenities', getAllAmenities);

// Get all amenity bookings
router.get('/amenity-bookings', getAllAmenityBookings);

// Update amenity booking status
router.patch('/amenity-bookings/:id/status', updateAmenityBookingStatus);

// Delete an amenity
router.delete('/amenities/:id', deleteAmenity);

module.exports = router; 