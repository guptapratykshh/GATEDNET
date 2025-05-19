import React, { useState } from 'react';
import Modal from '../common/Modal';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    societyName: '',
    flatNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    // Password validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
      valid = false;
    }

    if (formData.newPassword && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Save changes logic would go here
      console.log('Saving settings:', formData);
      // Mock successful save
      setTimeout(() => {
        alert('Settings saved successfully!');
        onClose();
      }, 500);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Settings" 
      width="450px"
      className="settings-modal"
    >
      <div className="settings-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="societyName">Name Society</label>
            <input
              type="text"
              id="societyName"
              name="societyName"
              value={formData.societyName}
              onChange={handleChange}
              placeholder="Enter society name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="flatNumber">Flat Number</label>
            <input
              type="text"
              id="flatNumber"
              name="flatNumber"
              value={formData.flatNumber}
              onChange={handleChange}
              placeholder="Enter your flat number"
            />
          </div>

          <div className="form-section">
            <h3>Update Your Password</h3>
            
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current password"
                className={errors.currentPassword ? 'error' : ''}
              />
              {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New password"
                className={errors.newPassword ? 'error' : ''}
              />
              {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="save-btn">Save Changes</button>
        </form>
      </div>
    </Modal>
  );
};

export default SettingsModal;