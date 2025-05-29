import React from 'react';
import { LogOut, User, Settings } from 'lucide-react';
import useStore from '../../store/useStore';

const ProfileDropdown = ({ onLogout }) => {
  const { user } = useStore();

  if (!user) return null;

  return (
    <div className="absolute top-16 right-4 z-10 bg-white shadow-lg rounded-lg overflow-hidden w-64">
      <div className="p-4 bg-blue-600 text-white">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-blue-700 rounded-full">
            <User size={20} />
          </div>
          <div>
            <div className="font-bold">{user.name}</div>
            <div className="text-sm opacity-80">{user.email}</div>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer flex items-center">
          <Settings size={18} className="mr-2 text-gray-600" />
          <span>Account Settings</span>
        </div>
        <div 
          className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer flex items-center text-red-600"
          onClick={onLogout}
        >
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;