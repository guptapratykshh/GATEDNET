const mongoose = require('mongoose');

const amenityBookingSchema = new mongoose.Schema({
  amenity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity', // Reference to the Amenity model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member', // Reference to the Member model
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'], // Possible statuses
    default: 'pending',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AmenityBooking', amenityBookingSchema); 