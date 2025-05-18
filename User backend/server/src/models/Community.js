import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a community name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  state: {
    type: String,
    required: [true, 'Please add a state']
  },
  pincode: {
    type: String,
    required: [true, 'Please add a pincode'],
    match: [
      /^\d{6}$/,
      'Please add a valid 6-digit pincode'
    ]
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    formattedAddress: String
  },
  geofenceRadius: {
    type: Number,
    default: 500 // Default radius in meters
  },
  totalFlats: {
    type: Number,
    required: [true, 'Please add the total number of flats']
  },
  amenities: [{
    type: String,
    enum: ['Swimming Pool', 'Gym', 'Clubhouse', 'Garden', 'Tennis Court', 'Basketball Court', 'Other']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
CommunitySchema.virtual('residents', {
  ref: 'User',
  localField: '_id',
  foreignField: 'community',
  justOne: false
});

CommunitySchema.virtual('issues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'community',
  justOne: false
});

CommunitySchema.virtual('polls', {
  ref: 'Poll',
  localField: '_id',
  foreignField: 'community',
  justOne: false
});

export default mongoose.model('Community', CommunitySchema);