import React, { useEffect } from 'react';
import Card from '../UI/Card';
import useStore from '../../store/useStore';

const MaintenanceUpdates = () => {
  const { maintenanceUpdates, fetchMaintenanceUpdates, isLoading, error } = useStore();
  
  useEffect(() => {
    fetchMaintenanceUpdates();
  }, [fetchMaintenanceUpdates]);
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
      case 'pending':
        return (
          <span className="px-3 py-1 bg-yellow-400 text-yellow-900 font-medium rounded">
            {status.toUpperCase()}
          </span>
        );
      case 'in-progress':
        return (
          <span className="px-3 py-1 bg-blue-400 text-blue-900 font-medium rounded">
            IN PROGRESS
          </span>
        );
      case 'resolved':
        return (
          <span className="px-3 py-1 bg-green-400 text-green-900 font-medium rounded">
            RESOLVED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-300 text-gray-800 font-medium rounded">
            {status ? status.toUpperCase() : 'UNKNOWN'}
          </span>
        );
    }
  };
  
  return (
    <Card 
      title="MAINTENANCE UPDATES"
      footer={<span>SEE ALL UPDATES</span>}
    >
      {isLoading ? (
        <div className="text-center py-4">Loading updates...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-600 bg-red-100 rounded">{error}</div>
      ) : maintenanceUpdates.length === 0 ? (
        <div className="text-center py-4">No maintenance updates</div>
      ) : (
        <div className="space-y-4">
          {maintenanceUpdates.map(update => (
            <div key={update._id || update.id} className="flex justify-between items-center">
              <div className="text-lg">{update.title}</div>
              <div>{getStatusBadge(update.status)}</div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default MaintenanceUpdates;