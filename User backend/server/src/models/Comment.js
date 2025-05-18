import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: [500, 'Comment can not be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  issue: {
    type: mongoose.Schema.ObjectId,
    ref: 'Issue'
  },
  announcement: {
    type: mongoose.Schema.ObjectId,
    ref: 'Announcement'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Validate that the comment is related to either an issue or an announcement, but not both
CommentSchema.pre('validate', function(next) {
  if (!this.issue && !this.announcement) {
    next(new Error('Comment must be associated with either an issue or an announcement'));
  } else if (this.issue && this.announcement) {
    next(new Error('Comment cannot be associated with both an issue and an announcement'));
  } else {
    next();
  }
});

export default mongoose.model('Comment', CommentSchema);