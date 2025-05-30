import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import { toast, ToastContainer } from 'react-toastify'; // Import toast notifications
import 'react-toastify/dist/ReactToastify.css';
import './ViewBookedAmenities.css';

// Helper function to return class based on status (Keep or adapt existing one)
const getStatusClass = (status) => {
  switch (status?.toLowerCase()) { // Use optional chaining in case status is null/undefined
    case 'confirmed':
      return 'status-confirmed';
    case 'pending':
      return 'status-pending';
    case 'cancelled':
      return 'status-cancelled';
    default:
      return '';
  }
};

const ViewBookedAmenities = () => {
  const [bookedAmenities, setBookedAmenities] = useState([]);
  const [amenities, setAmenities] = useState([]); // Add state for amenities list
  const [loadingBookings, setLoadingBookings] = useState(true); // Rename loading state for clarity
  const [loadingAmenities, setLoadingAmenities] = useState(true); // Add loading state for amenities
  const [error, setError] = useState(null); // Keep a single error state for simplicity

  // Function to fetch bookings from the backend
  const fetchBookings = async () => {
    setLoadingBookings(true);
    // setError(null); // Let the combined fetch handle errors
    try {
      // Get the token from localStorage (assuming it's stored here)
      const token = localStorage.getItem('admin_id_token'); 
      if (!token) {
        setError('Authentication token not found.');
        setLoadingBookings(false);
        return;
      }

      const response = await axios.get('/api/amenity-bookings', { // Use the new backend endpoint
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBookedAmenities(response.data);
    } catch (err) {
      console.error('Error fetching amenity bookings:', err);
      setError('Failed to fetch amenity bookings.');
      toast.error('Failed to fetch amenity bookings.');
    } finally {
      setLoadingBookings(false);
    }
  };

  // Function to fetch amenities from the backend
  const fetchAmenities = async () => {
    setLoadingAmenities(true);
    // setError(null); // Let the combined fetch handle errors
    try {
      const token = localStorage.getItem('admin_id_token');
      if (!token) {
        setError('Authentication token not found.');
        setLoadingAmenities(false);
        return;
      }
      const response = await axios.get('/api/amenities', { // Endpoint to fetch amenities
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setAmenities(response.data);
    } catch (err) {
      console.error('Error fetching amenities:', err);
      setError('Failed to fetch amenities.');
      toast.error('Failed to fetch amenities.');
    } finally {
      setLoadingAmenities(false);
    }
  };

  // Function to handle status update
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_id_token');
      if (!token) {
        toast.error('Authentication token not found.');
        return;
      }

      const response = await axios.patch(
        `/api/amenity-bookings/${bookingId}/status`, // Use the new update status endpoint
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      // Update the local state with the updated booking
      setBookedAmenities(bookedAmenities.map(booking => 
        booking._id === bookingId ? response.data : booking
      ));
      toast.success('Booking status updated successfully!');

    } catch (err) {
      console.error('Error updating booking status:', err);
      toast.error('Failed to update booking status.');
    }
  };

  // Function to handle deleting an amenity
  const handleDeleteAmenity = async (amenityId) => {
    if (window.confirm('Are you sure you want to delete this amenity and all its bookings?')) {
      try {
        const token = localStorage.getItem('admin_id_token');
        if (!token) {
          toast.error('Authentication token not found.');
          return;
        }
        await axios.delete(`/api/amenities/${amenityId}`, { // Endpoint to delete amenity
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        toast.success('Amenity and bookings deleted successfully!');
        // Remove the deleted amenity from the state
        setAmenities(amenities.filter(amenity => amenity._id !== amenityId));
        // Also refetch bookings in case any were deleted
        fetchBookings(); 
      } catch (err) {
        console.error('Error deleting amenity:', err);
        toast.error('Failed to delete amenity.');
      }
    }
  };

  // Fetch both bookings and amenities on component mount
  useEffect(() => {
    fetchBookings();
    fetchAmenities();
  }, []); // Empty dependency array to fetch only once on mount

  const isLoading = loadingBookings || loadingAmenities; // Combined loading state

  if (isLoading) {
    return <div className="loading">Loading data...</div>; // Combined loading indicator
  }

  if (error) {
    return <div className="error-message">{error}</div>; // Error message
  }

  return (
    <div className="bookings-container"> {/* Keep the main container class */}
      
      <h2>Booked Amenities</h2>
      {bookedAmenities.length > 0 ? (
        <ul className="bookings-list"> {/* Keep existing class */}
          {bookedAmenities.map((booking) => (
            <li key={booking._id} className="booking-item"> {/* Add amenity-item class for consistent styling */}
              <div className="booking-details"> {/* Use booking-details class */}
                <span className="booking-label">Amenity:</span> <span className="booking-value">{booking.amenity?.name || 'N/A'}</span><br /> {/* Access nested amenity name */}
                {booking.amenity?.description && ( // Display description if available
                  <>
                    <span className="booking-label">Description:</span> <span className="booking-value">{booking.amenity.description}</span><br />
                  </>
                )}
                <span className="booking-label">Booked By:</span> <span className="booking-value">{booking.member?.name || 'N/A'} ({booking.member?.flat || 'N/A'})</span><br /> {/* Access nested member name and flat */}
                <span className="booking-label">Booking Date:</span> <span className="booking-value">{new Date(booking.date).toLocaleDateString()}</span><br /> {/* Format date */}
                
                <span className="booking-label">Status:</span> 
                <span className={`booking-status ${getStatusClass(booking.status)}`}> {/* Apply status class */}
                  {/* Dropdown for status update */}
                  <select 
                    value={booking.status} 
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </span>
              </div>
              {/* Add delete button here, aligned to the right */}
              <button 
                className="delete-amenity-btn" // Reuse the delete button class
                onClick={() => handleDeleteAmenity(booking.amenity._id)} // Call delete with amenity ID
                style={{ marginLeft: 'auto' }} // Push button to the right
              >
                Delete Amenity
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-bookings">No bookings found.</p>
      )}

      {/* Remove the Manage Amenities section */}
      {/*
      <h2 style={{ marginTop: '40px' }}>Manage Amenities</h2>
      {amenities.length > 0 ? (
        <ul className="amenities-list">
          {amenities.map((amenity) => (
            <li key={amenity._id} className="amenity-item">
              <div className="amenity-details">
                <span className="amenity-label">Name:</span> <span className="amenity-value">{amenity.name}</span><br />
                <span className="amenity-label">Description:</span> <span className="amenity-value">{amenity.description || 'N/A'}</span>
              </div>
              <button
                className="delete-amenity-btn"
                onClick={() => handleDeleteAmenity(amenity._id)}
              >
                Delete Amenity
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-amenities">No amenities found.</p>
      )}
      */}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default ViewBookedAmenities;
