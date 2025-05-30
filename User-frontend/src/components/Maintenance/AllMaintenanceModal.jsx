import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import useStore from '../../store/useStore';

const AllMaintenanceModal = ({ isOpen, onClose }) => {
  const { maintenanceUpdates, fetchMaintenanceUpdates, isLoading, error } = useStore();

  useEffect(() => {
    if (isOpen) {
      fetchMaintenanceUpdates(); // Ensure all updates are fetched when modal opens
    }
  }, [isOpen, fetchMaintenanceUpdates]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-navy-900 rounded-3xl p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-navy-800">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white text-3xl font-light focus:outline-none"
        >
          <X size={32} />
        </button>
        <h2 className="text-3xl font-extrabold text-white text-center mb-10 tracking-wide w-full">All Maintenance Updates</h2>

        {isLoading ? (
          <div className="text-center py-4 text-white">Loading updates...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-400">Error loading updates: {error}</div>
        ) : maintenanceUpdates.length === 0 ? (
          <div className="text-center py-4 text-white">No maintenance updates available.</div>
        ) : (
          <div className="space-y-4">
            {maintenanceUpdates.map(update => (
              <div 
                key={update.id} // Assuming updates have an id
                className="py-2"
              >
                <h3 className="text-lg font-bold text-white leading-tight">{update.title}</h3> {/* Assuming title field */}
                <p className="text-gray-400 mt-1 leading-tight">{update.description}</p> {/* Assuming description field */}
                <p className="text-xs text-gray-500 mt-1 leading-tight">Date: {new Date(update.date).toLocaleDateString()}</p> {/* Assuming date field */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllMaintenanceModal;