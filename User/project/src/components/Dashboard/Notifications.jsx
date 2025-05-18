import React, { useEffect } from 'react';
import Card from '../UI/Card';
import useStore from '../../store/useStore';

const Notifications = () => {
  const { notifications, fetchNotifications, isLoading } = useStore();
  
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  return (
    <Card 
      title="RECENT NOTIFICATIONS"
      footer={<span>SEE ALL NOTIFICATIONS</span>}
    >
      {isLoading ? (
        <div className="text-center py-4">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-4">No notifications</div>
      ) : (
        <div className="space-y-4">
          {notifications.map(notification => (
            <div key={notification.id} className="flex items-start">
              <div className="w-6 h-6 mt-1 mr-3 rounded-full bg-blue-400 flex-shrink-0"></div>
              <div>
                <div className="text-lg">{notification.title}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default Notifications;