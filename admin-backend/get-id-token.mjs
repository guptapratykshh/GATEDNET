import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
const admin = require('firebase-admin');

// Updated Firebase web config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyD6yWgl_QtPM8q_bGiuN7EdpdIRCRt6W1o",
  authDomain: "gatenet-a1199.firebaseapp.com",
  projectId: "gatenet-a1199",
  storageBucket: "gatenet-a1199.appspot.com",
  messagingSenderId: "332058420990",
  appId: "1:332058420990:web:9c1168efd2058ed828e7af",
  measurementId: "G-M8S320Q8DN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(config.firebaseConfig)
});

// Function to generate a custom token
async function generateCustomToken(uid) {
  try {
    const customToken = await admin.auth().createCustomToken(uid);
    return customToken;
  } catch (error) {
    console.error("Error creating custom token:", error);
    throw error;
  }
}

// Example usage
generateCustomToken('user-uid')
  .then(token => {
    // Use the token as needed
  })
  .catch(error => {
    // Handle error
  });

// Paste your custom token here
const customToken = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTc0NzI0OTc0MSwiZXhwIjoxNzQ3MjUzMzQxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0BnYXRlbmV0LWExMTk5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwic3ViIjoiZmlyZWJhc2UtYWRtaW5zZGstZmJzdmNAZ2F0ZW5ldC1hMTE5OS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInVpZCI6IlhqY0hKNzdWTGtQNWVNcDlCYjRYWFFJZXVaNzMifQ.RxSjf1cTBRPKrZ3zSgPGRWqMvgOYfK8wG3Urs3CHFWHECmp5wXhWD9zI5w2MOyPP5ahzQOVWFt2EWsNCn8wkfGN8vRd4CjdVN0bFCuTyWt7zjGqdNU8908uXb45hPhYF74u9JE-3fIbUKYCcDi-aPb_dJ3tJ81GtQ0Ht4kbHkzR-1jym0AaLv4r_35Q0vuWyTRG-J-3Kk74LdcjZS77_iMjSPbfCH5qP7BU-_32QsG2IId_pRRA9E2DpEPQ0d0nJiOlp7khEh_3hjzCdiniKCKT1t-vHbHJsYKt-fFZ1VwpqxCwESoMIAMQYfvDiYLYBhll0CNVf0RngyyW5OJPBKQ";

signInWithCustomToken(auth, customToken)
  .then(userCredential => userCredential.user.getIdToken())
  .then(idToken => {
    console.log("ID Token:", idToken);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

export const getIdTokenFromCustomToken = async (token) => {
  if (token) {
    return token; // Assuming the token is already valid
  }
  throw new Error("Invalid token");
}; 