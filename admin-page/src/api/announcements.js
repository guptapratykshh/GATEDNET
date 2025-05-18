import axios from 'axios';

// Hardcode the base URL to ensure correct port
//const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'
const BASE_URL = 'http://localhost:5000'; // Force port 5000 explicitly

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

// Add a new announcement
export async function addAnnouncement(announcementData) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.post(`${BASE_URL}/api/announcements/add`, announcementData, {
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

// Get all announcements
export async function getAllAnnouncements() {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.get(`${BASE_URL}/api/announcements`, {
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

// Get announcement by ID
export async function getAnnouncementById(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.get(`${BASE_URL}/api/announcements/${id}`, {
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

// Update announcement
export async function updateAnnouncement(id, announcementData) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.put(`${BASE_URL}/api/announcements/${id}`, announcementData, {
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

// Delete announcement
export async function deleteAnnouncement(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.delete(`${BASE_URL}/api/announcements/${id}`, {
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