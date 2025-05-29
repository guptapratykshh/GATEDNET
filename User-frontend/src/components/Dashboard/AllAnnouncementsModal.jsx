import React from 'react';
import Modal from '../UI/Modal';
import { Bell } from 'lucide-react';
import useStore from '../../store/useStore';

const AllAnnouncementsModal = ({ isOpen, onClose }) => {
  const { announcements, isLoading } = useStore();
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ALL ANNOUNCEMENTS" width="lg">
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-4">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <Bell className="text-blue-300 mr-2" size={24} />
            <span>No New Announcements</span>
          </div>
        ) : (
          announcements.map((announcement, index) => (
            <div 
              key={`${announcement.id || index}-${index}`}
              className="bg-white p-4 rounded-lg shadow border border-gray-200"
            >
              <h3 className="text-lg font-medium text-navy-900">
                {announcement.title}
              </h3>
              <p className="mt-2 text-gray-600">
                {announcement.message}
              </p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(announcement.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};

export default AllAnnouncementsModal;