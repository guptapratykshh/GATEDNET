// import React from 'react';
// import '../styles/ComponentCard.css';
// import societyImage from '../assets/societyImage.png';

// const SocietyByLaws = () => {
//   return (
//     <div className="card">
//       <h3>SOCIETY BY LAWS</h3>
//       <img src={societyImage} alt="Society Bylaws" className="society-image" />
//       <p>📝 SocietyByLaws.docs</p>
//     </div>
//   );
// };

// export default SocietyByLaws;

import React from 'react';
import '../styles/ComponentCard.css';
import societyImage from '../assets/societyImage.png';

const SocietyByLaws = () => {
  // Function to handle opening the PDF
  const openBylaws = () => {
    // Opens the PDF in a new tab
    window.open('/societyBylaws.pdf', '_blank');
  };

  return (
    <div className="card">
      <h3>SOCIETY BY LAWS</h3>
      <img src={societyImage} alt="Society Bylaws" className="society-image" />
      <p
        onClick={openBylaws}
        style={{ cursor: 'pointer'}}
      >
        📝 Click to View Society Bylaws
      </p>
    </div>
  );
};

export default SocietyByLaws;

