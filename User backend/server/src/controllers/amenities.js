import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import Amenity from '../models/Amenity.js';
import Booking from '../models/Booking.js';

// @desc      Get all amenities
// @route     GET /api/amenities
// @access    Private
export const getAmenities = asyncHandler(async (req, res, next) => {
  // For admin and regular users, return all amenities in their community
  req.query.community = req.user.community;
  
  res.status(200).json(res.advancedResults);
});

// @desc      Get amenities by community
// @route     GET /api/amenities/community/:communityId
// @access    Private
export const getAmenitiesByCommunity = asyncHandler(async (req, res, next) => {
  // Check if user belongs to the community
  if (req.user.community.toString() !== req.params.communityId) {
    return next(new ErrorResponse(`User is not authorized to access amenities for this community`, 403));
  }

  const amenities = await Amenity.find({ community: req.params.communityId });

  res.status(200).json({
    success: true,
    count: amenities.length,
    data: amenities
  });
});

// @desc      Get single amenity
// @route     GET /api/amenities/:id
// @access    Private
export const getAmenity = asyncHandler(async (req, res, next) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return next(new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404));
  }

  // Make sure user has access to the amenity
  if (req.user.community.toString() !== amenity.community.toString()) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this amenity`, 403));
  }

  res.status(200).json({
    success: true,
    data: amenity
  });
});

// @desc      Create new amenity
// @route     POST /api/amenities
// @access    Private/Admin
export const createAmenity = asyncHandler(async (req, res, next) => {
  // Check if user is admin
  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`User is not authorized to create amenities`, 403));
  }

  // Add community to req.body
  req.body.community = req.user.community;

  const amenity = await Amenity.create(req.body);

  res.status(201).json({
    success: true,
    data: amenity
  });
});

// @desc      Update amenity
// @route     PUT /api/amenities/:id
// @access    Private/Admin
export const updateAmenity = asyncHandler(async (req, res, next) => {
  let amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return next(new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is an admin of the same community
  if (
    req.user.role !== 'admin' ||
    req.user.community.toString() !== amenity.community.toString()
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this amenity`, 403));
  }

  amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: amenity
  });
});

// @desc      Delete amenity
// @route     DELETE /api/amenities/:id
// @access    Private/Admin
export const deleteAmenity = asyncHandler(async (req, res, next) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return next(new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is an admin of the same community
  if (
    req.user.role !== 'admin' ||
    req.user.community.toString() !== amenity.community.toString()
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this amenity`, 403));
  }

  await amenity.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc      Book an amenity
// @route     POST /api/amenities/:id/book
// @access    Private
export const bookAmenity = asyncHandler(async (req, res, next) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return next(new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404));
  }

  // Check if amenity is bookable
  if (!amenity.isBookable) {
    return next(new ErrorResponse(`This amenity is not available for booking`, 400));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== amenity.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to book this amenity`, 403));
  }

  // Check if the requested time slot is available
  const { date, startTime, endTime, guests, purpose } = req.body;

  if (!date || !startTime || !endTime) {
    return next(new ErrorResponse(`Please provide date, start time and end time`, 400));
  }

  // Check if date is in the future
  if (new Date(date) < new Date()) {
    return next(new ErrorResponse(`Booking date must be in the future`, 400));
  }

  // Check if the amenity is available at the requested time
  const existingBooking = await Booking.findOne({
    amenity: req.params.id,
    date,
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      { startTime, endTime }
    ],
    status: { $in: ['Pending', 'Confirmed'] }
  });

  if (existingBooking) {
    return next(new ErrorResponse(`This time slot is already booked`, 400));
  }

  // Create booking
  const booking = await Booking.create({
    amenity: req.params.id,
    user: req.user.id,
    date,
    startTime,
    endTime,
    guests,
    purpose,
    community: req.user.community,
    status: 'Pending'
  });

  // Emit socket event for new booking
  req.io.to(req.user.community.toString()).emit('newBooking', { booking });

  res.status(201).json({
    success: true,
    data: booking
  });
});

// @desc      Get bookings for an amenity
// @route     GET /api/amenities/:id/bookings
// @access    Private
export const getAmenityBookings = asyncHandler(async (req, res, next) => {
  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return next(new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== amenity.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to view bookings for this amenity`, 403));
  }

  const bookings = await Booking.find({ amenity: req.params.id })
    .populate('user', 'name');

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// @desc      Rate an amenity
// @route     POST /api/amenities/:id/ratings
// @access    Private
export const rateAmenity = asyncHandler(async (req, res, next) => {
  const { rating, review } = req.body;

  // Validate rating
  if (!rating || rating < 1 || rating > 5) {
    return next(new ErrorResponse(`Please provide a rating between 1 and 5`, 400));
  }

  const amenity = await Amenity.findById(req.params.id);

  if (!amenity) {
    return next(new ErrorResponse(`Amenity not found with id of ${req.params.id}`, 404));
  }

  // Check if user belongs to the same community
  if (req.user.community.toString() !== amenity.community.toString()) {
    return next(new ErrorResponse(`User is not authorized to rate this amenity`, 403));
  }

  // Check if user has already rated this amenity
  const hasRated = amenity.ratings.find(
    item => item.user.toString() === req.user.id
  );

  if (hasRated) {
    // Update existing rating
    const updatedAmenity = await Amenity.findOneAndUpdate(
      { _id: req.params.id, 'ratings.user': req.user.id },
      { 
        $set: { 
          'ratings.$.rating': rating,
          'ratings.$.review': review || hasRated.review
        }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: updatedAmenity
    });
  }

  // Add new rating
  const updatedAmenity = await Amenity.findByIdAndUpdate(
    req.params.id,
    { 
      $push: { 
        ratings: { 
          user: req.user.id, 
          rating, 
          review 
        } 
      } 
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedAmenity
  });
});