import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import Issue from '../models/Issue.js';
import Comment from '../models/Comment.js';

// @desc      Get all issues
// @route     GET /api/issues
// @access    Private
export const getIssues = asyncHandler(async (req, res, next) => {
  // For regular users, only return their own issues
  if (req.user.role === 'resident') {
    req.query.reportedBy = req.user.id;
  }
  
  // For admin users, return all issues in their community
  if (req.user.role === 'admin') {
    req.query.community = req.user.community;
  }
  
  res.status(200).json(res.advancedResults);
});

// @desc      Get issues by community
// @route     GET /api/issues/community/:communityId
// @access    Private
export const getIssuesByCommunity = asyncHandler(async (req, res, next) => {
  // Check if user belongs to the community
  if (req.user.community.toString() !== req.params.communityId && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User is not authorized to access issues for this community`, 403));
  }

  const issues = await Issue.find({ community: req.params.communityId })
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name');

  res.status(200).json({
    success: true,
    count: issues.length,
    data: issues
  });
});

// @desc      Get single issue
// @route     GET /api/issues/:id
// @access    Private
export const getIssue = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id)
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'name'
      }
    });

  if (!issue) {
    return next(new ErrorResponse(`Issue not found with id of ${req.params.id}`, 404));
  }

  // Make sure user has access to the issue
  if (
    issue.reportedBy._id.toString() !== req.user.id &&
    req.user.role !== 'admin' &&
    req.user.community.toString() !== issue.community.toString()
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this issue`, 403));
  }

  res.status(200).json({
    success: true,
    data: issue
  });
});

// @desc      Create new issue
// @route     POST /api/issues
// @access    Private
export const createIssue = asyncHandler(async (req, res, next) => {
  // Add user and community to req.body
  req.body.reportedBy = req.user.id;
  req.body.community = req.user.community;

  const issue = await Issue.create(req.body);

  // Emit socket event for new issue
  req.io.to(req.user.community.toString()).emit('newIssue', { issue });

  res.status(201).json({
    success: true,
    data: issue
  });
});

// @desc      Update issue
// @route     PUT /api/issues/:id
// @access    Private
export const updateIssue = asyncHandler(async (req, res, next) => {
  let issue = await Issue.findById(req.params.id);

  if (!issue) {
    return next(new ErrorResponse(`Issue not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is issue owner or an admin
  if (
    issue.reportedBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this issue`, 403));
  }

  // If status is being updated to 'Resolved', add resolvedAt date
  if (req.body.status === 'Resolved' && issue.status !== 'Resolved') {
    req.body.resolvedAt = Date.now();
  }

  issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Emit socket event for updated issue
  req.io.to(issue.community.toString()).emit('issueUpdated', { issue });

  res.status(200).json({
    success: true,
    data: issue
  });
});

// @desc      Delete issue
// @route     DELETE /api/issues/:id
// @access    Private
export const deleteIssue = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return next(new ErrorResponse(`Issue not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is issue owner or an admin
  if (
    issue.reportedBy.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this issue`, 403));
  }

  // Remove all comments associated with the issue
  await Comment.deleteMany({ issue: req.params.id });

  await issue.deleteOne();

  // Emit socket event for deleted issue
  req.io.to(issue.community.toString()).emit('issueDeleted', { id: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Add comment to issue
// @route     POST /api/issues/:id/comments
// @access    Private
export const addComment = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return next(new ErrorResponse(`Issue not found with id of ${req.params.id}`, 404));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== issue.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to comment on this issue`, 403));
  }

  const comment = await Comment.create({
    content: req.body.content,
    user: req.user.id,
    issue: req.params.id
  });

  // Emit socket event for new comment
  req.io.to(issue.community.toString()).emit('newComment', { comment, issueId: req.params.id });

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc      Get comments for issue
// @route     GET /api/issues/:id/comments
// @access    Private
export const getComments = asyncHandler(async (req, res, next) => {
  const issue = await Issue.findById(req.params.id);

  if (!issue) {
    return next(new ErrorResponse(`Issue not found with id of ${req.params.id}`, 404));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== issue.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to view comments on this issue`, 403));
  }

  const comments = await Comment.find({ issue: req.params.id })
    .populate('user', 'name');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});