import mongoose from 'mongoose';

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  type: {
    type: String,
    required: [true, 'Please add a type'],
    enum: [
      'Swimming Pool',
      'Gym',
      'Clubhouse',
      'Garden',
      'Tennis Court',
      'Basketball Court',
      'Other'
    ]
  },
  location: {
    type: String,
    required: [true, 'Please specify the location']
  },
  isBookable: {
    type: Boolean,
    default: true
  },
  capacity: {
    type: Number,
    required: [true, 'Please add capacity']
  },
  availableTimeSlots: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'All'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  }],
  photos: [String],
  rules: [String],
  ratings: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    review: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5']
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
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Calculate average rating
AmenitySchema.pre('save', function(next) {
  if (this.ratings.length > 0) {
    this.averageRating = this.ratings.reduce((acc, item) => acc + item.rating, 0) / this.ratings.length;
  }
  next();
});

// Reverse populate with bookings
AmenitySchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'amenity',
  justOne: false
});

export default mongoose.model('Amenity', AmenitySchema);