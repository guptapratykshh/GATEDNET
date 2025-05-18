import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Community from '../models/Community.js';

// @desc      Get all users
// @route     GET /api/users
// @access    Private/Admin
export const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get users by community
// @route     GET /api/users/community/:communityId
// @access    Private
export const getUsersByCommunity = asyncHandler(async (req, res, next) => {
  const users = await User.find({ community: req.params.communityId });

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// @desc      Get single user
// @route     GET /api/users/:id
// @access    Private/Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Check if the requesting user has access to this user's data
  if (req.user.role !== 'admin' && req.user.id !== req.params.id && req.user.community.toString() !== user.community.toString()) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this user`, 403));
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Create user
// @route     POST /api/users
// @access    Private/Admin
export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, phone, password, communityId, flatNumber, role } = req.body;

  // Validate community
  const community = await Community.findById(communityId);
  if (!community) {
    return next(new ErrorResponse(`Community not found with id of ${communityId}`, 404));
  }

  // Check if the admin belongs to the same community
  if (req.user.role === 'admin' && req.user.community.toString() !== communityId) {
    return next(new ErrorResponse(`Admin is not authorized to create users for this community`, 403));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    community: communityId,
    flatNumber,
    role: role || 'resident'
  });

  res.status(201).json({
    success: true,
    data: user
  });
});

// @desc      Update user
// @route     PUT /api/users/:id
// @access    Private/Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Check if the admin is from the same community as the user
  if (req.user.role === 'admin' && req.user.community.toString() !== user.community.toString()) {
    return next(new ErrorResponse(`Admin is not authorized to update this user`, 403));
  }

  // A regular user can only update their own profile
  if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this user`, 403));
  }

  // A regular user cannot change their role or community
  if (req.user.role !== 'admin') {
    delete req.body.role;
    delete req.body.community;
  }

  user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc      Delete user
// @route     DELETE /api/users/:id
// @access    Private/Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${req.params.id}`, 404));
  }

  // Check if the admin is from the same community as the user
  if (req.user.role === 'admin' && req.user.community.toString() !== user.community.toString()) {
    return next(new ErrorResponse(`Admin is not authorized to delete this user`, 403));
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});