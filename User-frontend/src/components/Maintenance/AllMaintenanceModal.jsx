import React from 'react';
import Modal from '../UI/Modal';
import useStore from '../../store/useStore';

const AllMaintenanceModal = ({ isOpen, onClose }) => {
  const { maintenanceUpdates, isLoading } = useStore();
  
  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-yellow-400 text-yellow-900',
      'in-progress': 'bg-blue-400 text-blue-900',
      resolved: 'bg-green-400 text-green-900'
    };
    
    return (
      <span className={`px-3 py-1 font-medium rounded ${badges[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ALL MAINTENANCE UPDATES" width="lg">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-4">Loading updates...</div>
        ) : maintenanceUpdates.length === 0 ? (
          <div className="text-center py-4">No maintenance updates</div>
        ) : (
          maintenanceUpdates.map(update => (
            <div 
              key={update.id}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-navy-900">
                  {update.title}
                </h3>
                {getStatusBadge(update.status)}
              </div>
              <p className="text-gray-600">{update.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                Updated: {new Date(update.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default AllMaintenanceModal;