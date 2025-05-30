const Amenity = require('../models/Amenity');
const AmenityBooking = require('../models/AmenityBooking');

// Get all amenities
exports.getAllAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find();
    res.status(200).json(amenities);
  } catch (error) {
    console.error('Error fetching amenities:', error);
    res.status(500).json({ message: 'Error fetching amenities' });
  }
};

// Get all amenity bookings and populate amenity and member details
exports.getAllAmenityBookings = async (req, res) => {
  try {
    const bookings = await AmenityBooking.find()
      .populate('amenity', 'name description') // Populate amenity details (name and description)
      .populate('member', 'name email flat'); // Populate member details (name, email, flat)
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching amenity bookings:', error);
    res.status(500).json({ message: 'Error fetching amenity bookings' });
  }
};

// Update amenity booking status
exports.updateAmenityBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided' });
    }

    const booking = await AmenityBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('amenity', 'name description')
      .populate('member', 'name email flat');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error('Error updating amenity booking status:', error);
    res.status(500).json({ message: 'Error updating booking status' });
  }
};

// Delete an amenity and its associated bookings
exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the amenity to be deleted
    const amenity = await Amenity.findById(id);
    if (!amenity) {
      return res.status(404).json({ message: 'Amenity not found' });
    }

    // Delete all bookings associated with this amenity
    await AmenityBooking.deleteMany({ amenity: id });

    // Delete the amenity itself
    await Amenity.findByIdAndDelete(id);

    res.status(200).json({ message: 'Amenity and associated bookings deleted successfully' });
  } catch (error) {
    console.error('Error deleting amenity:', error);
    res.status(500).json({ message: 'Error deleting amenity' });
  }
}; 