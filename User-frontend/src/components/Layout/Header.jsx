import React from 'react';
import { Shield, User } from 'lucide-react';
import useStore from '../../store/useStore';

const Header = ({ onProfileClick }) => {
  const { user } = useStore();
  
  return (
    <header className="bg-navy-950 text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Shield className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold">GREENLANDS SOCIETY</h1>
      </div>
      
      <div 
        className="flex items-center bg-blue-800 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition"
        onClick={onProfileClick}
      >
        <User className="h-6 w-6 text-blue-200" />
      </div>
    </header>
  );
};

export default Header;