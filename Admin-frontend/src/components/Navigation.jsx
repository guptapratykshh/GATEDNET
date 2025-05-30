import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeOutlined, 
    TeamOutlined,
    BellOutlined,
  BarChartOutlined,
  ToolOutlined,
    CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  CaretDownOutlined,
  CaretUpOutlined
} from '@ant-design/icons';
import './Navigation.css';

const Navigation = () => {
    const location = useLocation();
  const [expandedItem, setExpandedItem] = useState(null);

  const navItems = [
    { path: '/dashboard', icon: <HomeOutlined />, label: 'Dashboard' },
        {
      label: 'Member Management', icon: <TeamOutlined />, children: [
        { path: '/add-member', label: 'Add Member' },
        { path: '/update-members', label: 'Update Members' },
        { path: '/download-excel', label: 'Download Excel' }
            ]
        },
        {
      label: 'Announcements', icon: <BellOutlined />, children: [
        { path: '/add-announcement', label: 'Add Announcement' },
        { path: '/announcements', label: 'View Announcements' }
            ]
        },
        {
      label: 'Active Votes', icon: <BarChartOutlined />, children: [
        { path: '/create-poll', label: 'Create Poll' },
        { path: '/poll-results', label: 'Poll Results' }
            ]
        },
        {
      label: 'Amenities', icon: <CalendarOutlined />, children: [
        { path: '/view-booked-amenities', label: 'View Bookings' }
            ]
        },
        {
      label: 'Maintenance Updates', icon: <ToolOutlined />, children: [
        { path: '/maintenance-updates/add-task', label: 'Add Task' },
        { path: '/maintenance-updates/view-tasks', label: 'View Tasks' },
        { path: '/maintenance-updates/update-task', label: 'Update Task' }
      ]
                },
    ];

  const handleItemClick = (item) => {
    if (item.children) {
      setExpandedItem(expandedItem === item.label ? null : item.label);
    }
    };

    return (
    <nav className="navigation">
      <ul className="nav-menu">
        {navItems.map((item) => (
          <li key={item.path || item.label} className="nav-item">
            {item.children ? (
              <div 
                className={`nav-link ${expandedItem === item.label ? 'active' : ''}`}
                onClick={() => handleItemClick(item)}
                style={{ cursor: 'pointer' }}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                <span className="expand-icon">
                  {expandedItem === item.label ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </span>
              </div>
            ) : (
              <Link
                to={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            )}
            {item.children && expandedItem === item.label && (
              <ul className="submenu">
                {item.children.map((child) => (
                  <li key={child.path} className="submenu-item">
                    <Link
                      to={child.path}
                      className={`submenu-link ${location.pathname === child.path ? 'active' : ''}`}
                    >
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
    );
};

export default Navigation; 