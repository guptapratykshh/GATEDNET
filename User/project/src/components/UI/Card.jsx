import React from 'react';

const Card = ({ title, children, footer, onClick }) => {
  return (
    <div 
      className={`bg-navy-900 rounded-lg overflow-hidden shadow-md mb-6 text-white ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      {title && (
        <div className="p-4 border-b border-navy-700">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="p-3 bg-navy-800 text-center text-blue-300 hover:text-blue-200 transition-colors">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;