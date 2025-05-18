import axios from 'axios';

// Hardcode the base URL to ensure correct port
 const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';;
//const BASE_URL = 'http://localhost:5000'; // Force port 5000 explicitly

// Helper to handle API errors
const handleApiError = (error) => {
  console.error("API Error:", error);
  if (error.response) {
    return { 
      error: error.response.data.error || 'Server error', 
      status: error.response.status 
    };
  } else if (error.request) {
    return { error: 'No response from server', status: 0 };
  } else {
    return { error: 'Request configuration error', status: 0 };
  }
};

// Add a new reminder
export async function addReminder(reminderData) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.post(`${BASE_URL}/api/reminders/add`, reminderData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get all reminders
export async function getAllReminders(isCompleted) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const url = isCompleted !== undefined 
      ? `${BASE_URL}/api/reminders?isCompleted=${isCompleted}` 
      : `${BASE_URL}/api/reminders`;
    
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Get reminder by ID
export async function getReminderById(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.get(`${BASE_URL}/api/reminders/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Update reminder
export async function updateReminder(id, reminderData) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.put(`${BASE_URL}/api/reminders/${id}`, reminderData, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Toggle reminder completion status
export async function toggleReminderStatus(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.patch(`${BASE_URL}/api/reminders/${id}/toggle`, {}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
}

// Delete reminder
export async function deleteReminder(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.delete(`${BASE_URL}/api/reminders/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
} 