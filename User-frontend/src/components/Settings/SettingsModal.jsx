import React, { useState } from 'react';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import useStore from '../../store/useStore';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user, updateUserSettings, updatePassword } = useStore();
  const [formData, setFormData] = useState({
    societyName: user?.societyName || '',
    flatNumber: user?.apartmentNumber || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        alert('New passwords do not match');
        return;
      }
      await updatePassword(formData.currentPassword, formData.newPassword);
    }
    
    await updateUserSettings({
      societyName: formData.societyName,
      flatNumber: formData.flatNumber,
    });
    
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" width="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-navy-900 mb-2">
            Society Name
          </label>
          <input
            type="text"
            name="societyName"
            value={formData.societyName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter society name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-navy-900 mb-2">
            Flat Number
          </label>
          <input
            type="text"
            name="flatNumber"
            value={formData.flatNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your flat number"
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-navy-900 mb-4">
            Update Your Password
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-navy-900 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm new password"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;