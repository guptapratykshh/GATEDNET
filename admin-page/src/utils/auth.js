import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { auth } from "./firebase"; // your firebase config

// Function to refresh the Firebase ID token
export const refreshToken = async () => {
  try {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (currentUser) {
      const newToken = await currentUser.getIdToken(true);
      localStorage.setItem('admin_id_token', newToken);
      return newToken;
    }
    
    // If no current user, try to get the custom token from localStorage
    const customToken = localStorage.getItem('admin_custom_token');
    if (customToken) {
      const userCredential = await signInWithCustomToken(auth, customToken);
      const newToken = await userCredential.user.getIdToken();
      localStorage.setItem('admin_id_token', newToken);
      return newToken;
    }
    
    throw new Error('No valid token found');
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Function to get ID token from custom token
export const getIdTokenFromCustomToken = async (customToken) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithCustomToken(auth, customToken);
    const idToken = await userCredential.user.getIdToken();
    localStorage.setItem('admin_custom_token', customToken); // Store custom token for future refresh
    return idToken;
  } catch (error) {
    console.error('Error getting ID token:', error);
    throw error;
  }
};