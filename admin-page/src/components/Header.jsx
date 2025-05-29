import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../api/admin';
import '../styles/Header.css';

const Header = ({ setIsAuthenticated }) => {
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  useEffect(() => {
    // Get admin info from localStorage if available
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      try {
        const parsedUser = JSON.parse(adminUser);
        if (parsedUser && parsedUser.name) {
          setAdminName(parsedUser.name);
        }
      } catch (error) {
        console.error('Error parsing admin user data:', error);
      }
    }
  }, []);

  const handleLogout = async () => {
    const result = await adminLogout();
    if (result.success) {
      localStorage.removeItem('admin_id_token');
      setIsAuthenticated(false);
      navigate('/admin/login');
    } else {
      console.error('Logout failed:', result.error);
    }
  };

  return (
    <header className="header">
      <div className="title">GREENLANDS SOCIETY</div>
      <div className="admin-controls">
        <span className="admin-name">{adminName}</span>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
