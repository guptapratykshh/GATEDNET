import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import Poll from '../models/Poll.js';

// @desc      Get all polls
// @route     GET /api/polls
// @access    Private
export const getPolls = asyncHandler(async (req, res, next) => {
  // For admin and regular users, return all polls in their community
  req.query.community = req.user.community;
  
  res.status(200).json(res.advancedResults);
});

// @desc      Get polls by community
// @route     GET /api/polls/community/:communityId
// @access    Private
export const getPollsByCommunity = asyncHandler(async (req, res, next) => {
  // Check if user belongs to the community
  if (req.user.community.toString() !== req.params.communityId) {
    return next(new ErrorResponse(`User is not authorized to access polls for this community`, 403));
  }

  const polls = await Poll.find({ community: req.params.communityId })
    .populate('createdBy', 'name');

  res.status(200).json({
    success: true,
    count: polls.length,
    data: polls
  });
});

// @desc      Get single poll
// @route     GET /api/polls/:id
// @access    Private
export const getPoll = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate('voters.user', 'name');

  if (!poll) {
    return next(new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404));
  }

  // Make sure user has access to the poll
  if (req.user.community.toString() !== poll.community.toString()) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this poll`, 403));
  }

  res.status(200).json({
    success: true,
    data: poll
  });
});

// @desc      Create new poll
// @route     POST /api/polls
// @access    Private/Admin
export const createPoll = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`User is not authorized to create polls`, 403));
  }

  // Add user and community to req.body
  req.body.createdBy = req.user.id;
  req.body.community = req.user.community;

  const poll = await Poll.create(req.body);

  // Emit socket event for new poll
  req.io.to(req.user.community.toString()).emit('newPoll', { poll });

  res.status(201).json({
    success: true,
    data: poll
  });
});

// @desc      Update poll
// @route     PUT /api/polls/:id
// @access    Private/Admin
export const updatePoll = asyncHandler(async (req, res, next) => {
  let poll = await Poll.findById(req.params.id);

  if (!poll) {
    return next(new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is poll creator or an admin
  if (
    poll.createdBy.toString() !== req.user.id ||
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this poll`, 403));
  }

  // Don't allow updating results directly
  delete req.body.voters;
  delete req.body.options;

  poll = await Poll.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  // Emit socket event for updated poll
  req.io.to(poll.community.toString()).emit('pollUpdated', { poll });

  res.status(200).json({
    success: true,
    data: poll
  });
});

// @desc      Delete poll
// @route     DELETE /api/polls/:id
// @access    Private/Admin
export const deletePoll = asyncHandler(async (req, res, next) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    return next(new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is poll creator or an admin
  if (
    poll.createdBy.toString() !== req.user.id ||
    req.user.role !== 'admin'
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this poll`, 403));
  }

  await poll.deleteOne();

  // Emit socket event for deleted poll
  req.io.to(poll.community.toString()).emit('pollDeleted', { id: req.params.id });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Vote on poll
// @route     POST /api/polls/:id/vote
// @access    Private
export const votePoll = asyncHandler(async (req, res, next) => {
  const { optionIndex } = req.body;
  
  if (optionIndex === undefined) {
    return next(new ErrorResponse('Please provide an option index', 400));
  }

  let poll = await Poll.findById(req.params.id);

  if (!poll) {
    return next(new ErrorResponse(`Poll not found with id of ${req.params.id}`, 404));
  }

  // Check if poll is active
  if (!poll.isActive) {
    return next(new ErrorResponse(`This poll is no longer active`, 400));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== poll.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to vote on this poll`, 403));
  }

  // Check if option index is valid
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return next(new ErrorResponse(`Invalid option index`, 400));
  }

  // Check if user has already voted
  const alreadyVoted = poll.voters.find(
    voter => voter.user.toString() === req.user.id
  );

  if (alreadyVoted) {
    return next(new ErrorResponse(`User has already voted on this poll`, 400));
  }

  // Update poll with new vote
  poll = await Poll.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { [`options.${optionIndex}.votes`]: 1 },
      $push: { voters: { user: req.user.id, option: optionIndex } }
    },
    { new: true }
  );

  // Emit socket event for updated poll
  req.io.to(poll.community.toString()).emit('pollVoted', { poll });

  res.status(200).json({
    success: true,
    data: poll
  });
});