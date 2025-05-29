import React from 'react';
import { BarChart3, PenTool as Tool, Calendar, BookOpen, Settings } from 'lucide-react';

const SidebarItem = ({ icon, label, isActive = false, onClick }) => {
  return (
    <div 
      className={`flex items-center p-4 cursor-pointer transition duration-200 
        ${isActive ? 'text-blue-400' : 'text-blue-200 hover:text-blue-300'}`}
      onClick={onClick}
    >
      <div className="mr-3">{icon}</div>
      <span className="text-lg font-medium">{label}</span>
    </div>
  );
};

const Sidebar = ({ activeItem, onItemClick }) => {
  const items = [
    { id: 'voting', label: 'Voting & Polling', icon: <BarChart3 size={24} /> },
    { id: 'maintenance', label: 'Maintenance Requests', icon: <Tool size={24} /> },
    { id: 'amenity', label: 'Amenity Booking', icon: <Calendar size={24} /> },
    { id: 'bylaws', label: 'Society By Laws', icon: <BookOpen size={24} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={24} /> },
  ];

  return (
    <div className="bg-navy-900 text-white h-full pt-6">
      <div className="p-4 text-2xl font-bold mb-8 text-center">DASHBOARD</div>
      <div>
        {items.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItem === item.id}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;