// import React from 'react';
// import '../styles/ComponentCard.css';
// import announcementImage from '../assets/AnnouncementImage.png';  // Adjust path as needed

// const Announcements = () => {
//   return (
//     <div className="card">
//       <h3>ANNOUNCEMENTS</h3>
//       <img src={announcementImage} alt="Announcements" className="announcement-image" />
//       <p>🔔 Add a new announcement</p>
//     </div>
//   );
// };

// export default Announcements;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ComponentCard.css';
import announcementImage from '../assets/AnnouncementImage.png';

const Announcements = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/add-announcement'); // ✅ Navigates to the new page
  };

  return (
    <div className="card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h3>ANNOUNCEMENTS</h3>
      <img src={announcementImage} alt="Announcements" className="announcement-image" />
      <p>🔔 Add a new announcement</p>
    </div>
  );
};

export default Announcements;
