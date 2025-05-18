import mongoose from 'mongoose';

const PollSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  options: [{
    text: {
      type: String,
      required: true
    },
    votes: {
      type: Number,
      default: 0
    }
  }],
  voters: [{
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    option: Number,
    votedAt: {
      type: Date,
      default: Date.now
    }
  }],
  startDate: {
    type: Date,
    required: [true, 'Please add a start date'],
    default: Date.now
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  community: {
    type: mongoose.Schema.ObjectId,
    ref: 'Community',
    required: true
  },
  draftSaved: {
    type: Boolean,
    default: false
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

// Close poll automatically after end date
PollSchema.pre('save', function(next) {
  if (this.endDate < Date.now()) {
    this.isActive = false;
  }
  next();
});

export default mongoose.model('Poll', PollSchema);