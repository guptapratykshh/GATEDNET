const Amenity = require('../models/Amenity');
const AmenityBooking = require('../models/AmenityBooking');

/**
 * Constants for amenity booking status validation
 */
const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled'
};

const VALID_STATUSES = Object.values(BOOKING_STATUS);

/**
 * Common population fields for amenity bookings
 */
const AMENITY_POPULATE_FIELDS = 'name description';
const MEMBER_POPULATE_FIELDS = 'name email flat';

/**
 * Standardized error response handler
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {string} message - Custom error message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
const handleError = (res, error, message, statusCode = 500) => {
  console.error(`${message}:`, error);
  return res.status(statusCode).json({ 
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
};

/**
 * Standardized success response handler
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
const handleSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Get all amenities
 * @route GET /api/amenities
 * @access Public/Admin
 */
exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find();
    return handleSuccess(res, amenities, 'Amenities fetched successfully');
  } catch (error) {
    return handleError(res, error, 'Error fetching amenities');
  }
};

/**
 * Get all amenity bookings with populated amenity and member details
 * @route GET /api/amenity-bookings
 * @access Admin
 */
exports.getAllAmenityBookings = async (req, res) => {
  try {
    const bookings = await AmenityBooking.find()
      .populate('amenity', AMENITY_POPULATE_FIELDS)
      .populate('member', MEMBER_POPULATE_FIELDS);
    
    return handleSuccess(res, bookings, 'Amenity bookings fetched successfully');
  } catch (error) {
    return handleError(res, error, 'Error fetching amenity bookings');
  }
};

/**
 * Update amenity booking status
 * @route PATCH /api/amenity-bookings/:id/status
 * @access Admin
 */
exports.updateAmenityBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid status provided',
        validStatuses: VALID_STATUSES
      });
    }

    // Update booking status
    const booking = await AmenityBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('amenity', AMENITY_POPULATE_FIELDS)
      .populate('member', MEMBER_POPULATE_FIELDS);

    // Check if booking exists
    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: 'Booking not found'
      });
    }

    return handleSuccess(res, booking, 'Booking status updated successfully');
  } catch (error) {
    return handleError(res, error, 'Error updating booking status');
  }
};

/**
 * Delete an amenity and its associated bookings
 * @route DELETE /api/amenities/:id
 * @access Admin
 */
exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if amenity exists
    const amenity = await Amenity.findById(id);
    if (!amenity) {
      return res.status(404).json({ 
        success: false,
        message: 'Amenity not found'
      });
    }

    // Delete associated bookings and amenity in parallel for better performance
    await Promise.all([
      AmenityBooking.deleteMany({ amenity: id }),
      Amenity.findByIdAndDelete(id)
    ]);

    return handleSuccess(
      res, 
      { deletedAmenityId: id }, 
      'Amenity and associated bookings deleted successfully'
    );
  } catch (error) {
    return handleError(res, error, 'Error deleting amenity');
  }
};
