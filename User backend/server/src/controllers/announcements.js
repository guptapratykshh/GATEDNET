import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import Announcement from '../models/Announcement.js';
import Comment from '../models/Comment.js';

// @desc      Get all announcements
// @route     GET /api/announcements
// @access    Private
export const getAnnouncements = asyncHandler(async (req, res, next) => {
  // For admin and regular users, return all announcements in their community
  req.query.community = req.user.community;
  
  res.status(200).json(res.advancedResults);
});

// @desc      Get announcements by community
// @route     GET /api/announcements/community/:communityId
// @access    Private
export const getAnnouncementsByCommunity = asyncHandler(async (req, res, next) => {
  // Check if user belongs to the community
  if (req.user.community.toString() !== req.params.communityId) {
    return next(new ErrorResponse(`User is not authorized to access announcements for this community`, 403));
  }

  const announcements = await Announcement.find({ community: req.params.communityId })
    .populate('createdBy', 'name');

  res.status(200).json({
    success: true,
    count: announcements.length,
    data: announcements
  });
});

// @desc      Get single announcement
// @route     GET /api/announcements/:id
// @access    Private
export const getAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('viewedBy.user', 'name');

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
  }

  // Make sure user has access to the announcement
  if (req.user.community.toString() !== announcement.community.toString()) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this announcement`, 403));
  }

  // Check if user has already viewed the announcement
  const hasViewed = announcement.viewedBy.find(
    view => view.user.toString() === req.user.id
  );

  if (!hasViewed) {
    // Add user to viewedBy array
    await Announcement.findByIdAndUpdate(
      req.params.id,
      { $push: { viewedBy: { user: req.user.id } } }
    );
  }

  res.status(200).json({
    success: true,
    data: announcement
  });
});

// @desc      Create new announcement
// @route     POST /api/announcements
// @access    Private/Admin
export const createAnnouncement = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`User is not authorized to create announcements`, 403));
  }

  // Add user and community to req.body
  req.body.createdBy = req.user.id;
  req.body.community = req.user.community;

  const announcement = await Announcement.create(req.body);

  // Emit socket event for new announcement
  req.io.to(req.user.community.toString()).emit('newAnnouncement', { announcement });

  res.status(201).json({
    success: true,
    data: announcement
  });
});

// @desc      Update announcement
// @route     PUT /api/announcements/:id
// @access    Private/Admin
export const updateAnnouncement = asyncHandler(async (req, res, next) => {
  let announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is announcement creator or an admin
  if (
    announcement.createdBy.toString() !== req.user.id ||
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this announcement`, 403));
  }

  announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Emit socket event for updated announcement
  req.io.to(announcement.community.toString()).emit('announcementUpdated', { announcement });

  res.status(200).json({
    success: true,
    data: announcement
  });
});

// @desc      Delete announcement
// @route     DELETE /api/announcements/:id
// @access    Private/Admin
export const deleteAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is announcement creator or an admin
  if (
    announcement.createdBy.toString() !== req.user.id ||
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this announcement`, 403));
  }

  // Remove all comments associated with the announcement
  await Comment.deleteMany({ announcement: req.params.id });

  await announcement.deleteOne();

  // Emit socket event for deleted announcement
  req.io.to(announcement.community.toString()).emit('announcementDeleted', { id: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Add comment to announcement
// @route     POST /api/announcements/:id/comments
// @access    Private
export const addComment = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== announcement.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to comment on this announcement`, 403));
  }

  const comment = await Comment.create({
    content: req.body.content,
    user: req.user.id,
    announcement: req.params.id
  });

  // Emit socket event for new comment
  req.io.to(announcement.community.toString()).emit('newComment', { comment, announcementId: req.params.id });

  res.status(201).json({
    success: true,
    data: comment
  });
});

// @desc      Get comments for announcement
// @route     GET /api/announcements/:id/comments
// @access    Private
export const getComments = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new ErrorResponse(`Announcement not found with id of ${req.params.id}`, 404));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== announcement.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to view comments on this announcement`, 403));
  }

  const comments = await Comment.find({ announcement: req.params.id })
    .populate('user', 'name');

  res.status(200).json({
    success: true,
    count: comments.length,
    data: comments
  });
});