const mongoose = require('mongoose');
const Amenity = require('./Amenity'); // Assuming Amenity model exists
const Member = require('./Member'); // Assuming Member model exists

const amenityBookingSchema = new mongoose.Schema({
  amenity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity',
    required: true
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['booked', 'confirmed', 'cancelled', 'pending'],
    default: 'booked'
  },
  createdDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AmenityBooking', amenityBookingSchema); 