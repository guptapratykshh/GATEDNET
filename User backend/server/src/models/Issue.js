import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema({
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
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Plumbing',
      'Electrical',
      'Security',
      'Cleanliness',
      'Structural',
      'Common Area',
      'Other'
    ]
  },
  priority: {
    type: String,
    required: [true, 'Please add a priority'],
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open'
  },
  location: {
    type: String,
    required: [true, 'Please specify the location of the issue']
  },
  photos: [String],
  assignedTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  reportedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  community: {
    type: mongoose.Schema.ObjectId,
    ref: 'Community',
    required: true
  },
  resolvedAt: Date,
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

// Reverse populate with virtuals
IssueSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'issue',
  justOne: false
});

export default mongoose.model('Issue', IssueSchema);