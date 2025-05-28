const AmenityBooking = require('../models/AmenityBooking');
const Amenity = require('../models/Amenity');
const Member = require('../models/Member');

// Get all amenity bookings and populate amenity and member details
exports.getAllAmenityBookings = async (req, res) => {
  try {
    const bookings = await AmenityBooking.find()
      .populate('amenity', 'name description') // Populate amenity details
      .populate('member', 'name'); // Populate member name

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error fetching amenity bookings:', error);
    res.status(500).json({ error: 'Failed to fetch amenity bookings' });
  }
};

// Update the status of an amenity booking
exports.updateAmenityBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!['booked', 'confirmed', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    const booking = await AmenityBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('amenity', 'name description')
      .populate('member', 'name');

    if (!booking) {
      return res.status(404).json({ error: 'Amenity booking not found' });
    }

    res.status(200).json({ message: 'Amenity booking status updated successfully', booking });
  } catch (error) {
    console.error('Error updating amenity booking status:', error);
    res.status(500).json({ error: 'Failed to update amenity booking status' });
  }
}; 