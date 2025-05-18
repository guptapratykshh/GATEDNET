import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  amenity: {
    type: mongoose.Schema.ObjectId,
    ref: 'Amenity',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Pending'
  },
  guests: {
    type: Number,
    default: 1
  },
  purpose: {
    type: String,
    maxlength: [200, 'Purpose can not be more than 200 characters']
  },
  community: {
    type: mongoose.Schema.ObjectId,
    ref: 'Community',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent user from booking multiple amenities at the same time
BookingSchema.index({ user: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

export default mongoose.model('Booking', BookingSchema);