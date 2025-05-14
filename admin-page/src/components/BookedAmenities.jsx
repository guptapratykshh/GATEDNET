// import React from 'react';
// import '../styles/ComponentCard.css';
// import bookedAmenitiesImage from '../assets/BookedAmenities.png'; // Adjust the path as needed

// const BookedAmenities = () => {
//   return (
//     <div className="card">
//       <h3>BOOKED AMENITIES</h3>
//       <img src={bookedAmenitiesImage} alt="Booked Amenities" className="booked-amenities-image" />
//       <p>🗓️ SEE ALL BOOKINGS</p>
//     </div>
//   );
// };

// export default BookedAmenities;

import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate to programmatically navigate
import '../styles/ComponentCard.css';
import bookedAmenitiesImage from '../assets/BookedAmenities.png'; // Adjust the path as needed

const BookedAmenities = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/view-booked-amenities');  // Navigate to the booked amenities page
  };

  return (
    <div className="card">
      <h3>BOOKED AMENITIES</h3>
      <img src={bookedAmenitiesImage} alt="Booked Amenities" className="booked-amenities-image" />
      <button onClick={handleClick}>🗓️ SEE ALL BOOKINGS</button>
    </div>
  );
};

export default BookedAmenities;
