import React, { useState } from 'react';
import { addMember } from '../api/members';
import './AddMember.css';

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    flat: '',
    contact: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await addMember(formData);
      
      if (result.error) {
        setErrorMessage(result.error);
      } else {
        setSuccessMessage('✅ Member added successfully!');
        setFormData({ name: '', flat: '', contact: '' });

        // For backward compatibility with localStorage version
        const existingData = JSON.parse(localStorage.getItem('membersExcel')) || [];
        const newMember = {
          Name: formData.name,
          Flat: formData.flat,
          Contact: formData.contact,
        };
        const updatedData = [...existingData, newMember];
        localStorage.setItem('membersExcel', JSON.stringify(updatedData));
      }
    } catch (err) {
      setErrorMessage('Failed to add member. Please try again.');
      console.error('Error adding member:', err);
    } finally {
      setIsLoading(false);
    }

    // Auto-hide messages after 3 seconds
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  return (
    <div className="add-member-container">
      <h2>Add New Society Member</h2>

      {successMessage && (
        <div className="success-toast">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="error-toast">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Name" 
          required 
          disabled={isLoading}
        />

        <input 
          name="flat" 
          value={formData.flat} 
          onChange={handleChange} 
          placeholder="Flat No." 
          required 
          disabled={isLoading}
        />

        <input 
          name="contact" 
          value={formData.contact} 
          onChange={handleChange} 
          placeholder="Contact Number" 
          required 
          disabled={isLoading}
        />

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Adding Member..." : "Add Member"}
        </button>
      </form>
    </div>
  );
};

export default AddMember;
