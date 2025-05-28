import React, { useState, useEffect } from 'react';
import './ViewBookedAmenities.css';
import axios from 'axios';
// Import Firebase auth if not already imported globally
// import { getAuth } from 'firebase/auth';
import { refreshToken } from '../utils/auth'; // Import refreshToken utility

// Use port 7000 for backend
const BASE_URL = 'http://localhost:7000';

const ViewBookedAmenities = () => {
  const [bookedAmenities, setBookedAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        let token = localStorage.getItem('admin_id_token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          // Optionally redirect to login page
          // navigate('/admin/login');
          return;
        }

        try {
          // Use the correct backend API URL with port 7000 and include token
          const response = await axios.get(`${BASE_URL}/api/amenities/bookings`, {
            headers: {
              'Authorization': `Bearer ${token}` // Include the ID token here
            }
          });
          setBookedAmenities(response.data.bookings);
          setLoading(false);
        } catch (err) {
           if (err.response?.status === 401) {
            // Token might be expired, try to refresh it
            try {
              token = await refreshToken();
              // Retry the request with the new token
              const response = await axios.get(`${BASE_URL}/api/amenities/bookings`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              setBookedAmenities(response.data.bookings);
              setLoading(false);
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              setError('Session expired. Please login again.');
              setLoading(false);
               // Optionally redirect to login page
               // navigate('/admin/login');
            }
          } else {
            console.error('Error fetching amenity bookings:', err);
            setError('Failed to fetch bookings.');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error in fetchBookings:', err);
        setError('An unexpected error occurred.');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      let token = localStorage.getItem('admin_id_token');
      if (!token) {
        alert('Authentication required. Please log in.'); // Or handle authentication error appropriately
        // Optionally redirect to login page
        // navigate('/admin/login');
        return;
      }

      try {
        // Use the correct backend API URL with port 7000 and include token
        await axios.put(`${BASE_URL}/api/amenities/bookings/${bookingId}/status`, { status: newStatus }, {
           headers: {
             'Authorization': `Bearer ${token}` // Include the ID token here
           }
        });
        // Update the local state with the new status
        setBookedAmenities(bookedAmenities.map(booking => 
          booking._id === bookingId ? { ...booking, status: newStatus } : booking
        ));
      }  catch (err) {
           if (err.response?.status === 401) {
            // Token might be expired, try to refresh it
            try {
              token = await refreshToken();
              // Retry the request with the new token
               await axios.put(`${BASE_URL}/api/amenities/bookings/${bookingId}/status`, { status: newStatus }, {
                 headers: {
                   Authorization: `Bearer ${token}`
                 }
              });
               setBookedAmenities(bookedAmenities.map(booking => 
                 booking._id === bookingId ? { ...booking, status: newStatus } : booking
               ));
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              alert('Session expired. Please login again.');
               // Optionally redirect to login page
               // navigate('/admin/login');
            }
          } else {
            console.error('Error updating booking status:', err);
            alert('Failed to update booking status.');
          }
        }

    } catch (err) {
      console.error('Error in handleStatusChange:', err);
      alert('An unexpected error occurred.');
    }
  };

  if (loading) {
    return <div className="bookings-container">Loading...</div>;
  }

  if (error) {
    return <div className="bookings-container">Error: {error}</div>;
  }

  return (
    <div className="bookings-container">
      <h2>Booked Amenities</h2>
      {bookedAmenities.length > 0 ? (
        <ul className="bookings-list">
          {bookedAmenities.map((booking) => (
            <li key={booking._id}>
              <div className="booking-detail">
                <span className="booking-label">Amenity:</span> <span className="booking-value">{booking.amenity ? booking.amenity.name : 'N/A'}</span>
              </div>
              <div className="booking-detail">
                <span className="booking-label">Description:</span> <span className="booking-value">{booking.amenity ? booking.amenity.description : 'N/A'}</span>
              </div>
              <div className="booking-detail">
                 <span className="booking-label">Booked By:</span> <span className="booking-value">{booking.member ? booking.member.name : 'N/A'}</span>
              </div>
              <div className="booking-detail">
                <span className="booking-label">Booking Date:</span> <span className="booking-value">{new Date(booking.date).toLocaleDateString()}</span>
              </div>
               <div className="booking-detail">
                <span className="booking-label">Booking Status:</span>
                 <select 
                    value={booking.status} 
                    onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                    className="booking-status-dropdown"
                  >
                    <option value="booked">Booked</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                  </select>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-bookings">No bookings found.</p>
      )}
    </div>
  );
};

export default ViewBookedAmenities;
