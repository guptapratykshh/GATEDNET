import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import ProfileDropdown from '../Profile/ProfileDropdown';
import useStore from '../../store/useStore';

const Layout = ({ children }) => {
  const [activeItem, setActiveItem] = useState('voting');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { isAuthenticated, logout } = useStore();

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Please login to continue</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header onProfileClick={handleProfileClick} />
      
      {showProfileDropdown && (
        <ProfileDropdown onLogout={handleLogout} />
      )}
      
      <div className="flex flex-1">
        <div className="w-72 bg-navy-900">
          <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        </div>
        
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;