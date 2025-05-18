import axios from 'axios';

// Hardcode the base URL to ensure correct port
 const BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
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

// Add a new poll
export async function createPoll(pollData) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.post(`${BASE_URL}/api/polls`, pollData, {
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

// Get all polls
export async function getAllPolls(status) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const url = status ? `${BASE_URL}/api/polls?status=${status}` : `${BASE_URL}/api/polls`;
    
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

// Get poll by ID
export async function getPollById(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.get(`${BASE_URL}/api/polls/${id}`, {
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

// Close a poll
export async function closePoll(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.put(`${BASE_URL}/api/polls/${id}/close`, {}, {
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

// Delete a poll (if needed)
export async function deletePoll(id) {
  try {
    const token = localStorage.getItem('admin_id_token');
    const response = await axios.delete(`${BASE_URL}/api/polls/${id}`, {
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