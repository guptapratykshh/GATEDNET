import React, { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import useStore from './store/useStore';

// Main application component
function App() {
  const { isAuthenticated, fetchActivePolls, fetchMaintenanceUpdates, fetchNotifications } = useStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      // Fetch initial data
      fetchActivePolls();
      fetchMaintenanceUpdates();
      fetchNotifications();
    }
  }, [isAuthenticated, fetchActivePolls, fetchMaintenanceUpdates, fetchNotifications]);
  
  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated ? <Dashboard /> : <Login />}
    </div>
  );
}

export default App;