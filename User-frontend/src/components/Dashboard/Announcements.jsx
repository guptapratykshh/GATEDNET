import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import Card from '../UI/Card';
import useStore from '../../store/useStore';

const Announcements = () => {
  const { announcements, fetchAnnouncements, isLoading, error } = useStore();
  
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);
  
  return (
    <Card 
      title="ANNOUNCEMENTS"
      footer={<span>SEE ALL ANNOUNCEMENTS</span>}
    >
      {isLoading ? (
        <div className="text-center py-4">Loading announcements...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-600 bg-red-100 rounded">{error}</div>
      ) : announcements.length === 0 ? (
        <div className="flex items-center justify-center py-4">
          <Bell className="text-blue-300 mr-2" size={24} />
          <span>No New Announcements</span>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(announcement => (
            <div key={announcement._id || announcement.id}>
              <h4 className="text-lg font-medium">{announcement.title}</h4>
              <p className="text-blue-200 mt-1">{announcement.message || announcement.description}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Announcements;