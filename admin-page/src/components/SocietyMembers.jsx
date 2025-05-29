import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ComponentCard.css';
import societyMembersImage from '../assets/societyMembersImage.png';

const SocietyMembers = () => {
  const navigate = useNavigate();

  const handleAddMemberClick = () => {
    navigate('/add-member');
  };

  const handleUpdateMembersClick = () => {
    navigate('/download-excel');
  };

  return (
    <div className="card">
      <h3>SOCIETY MEMBERS</h3>
      <img
        src={societyMembersImage}
        alt="Society Members"
        className="society-members-image"
      />
      <div className="action-container">
        <button className="action add-member" onClick={handleAddMemberClick}>
          <span style={{ marginRight: '5px' }}>+</span> Add New Members
        </button>
        <button className="action update-member" onClick={handleUpdateMembersClick}>
          <span style={{ marginRight: '5px' }}>↻</span> Update Members
        </button>
      </div>
    </div>
  );
};

export default SocietyMembers;
