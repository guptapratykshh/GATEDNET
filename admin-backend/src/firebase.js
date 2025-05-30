const admin = require('firebase-admin');
const serviceAccount = require('./gatenet-a1199-firebase-adminsdk-fbsvc-7b7eb61cf8.json')

// Validate service account
if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
  throw new Error('Invalid Firebase service account configuration');
}

console.log('Initializing Firebase Admin SDK with config:', {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  hasPrivateKey: !!serviceAccount.private_key
});

let firebaseApp;

try {
  if (!admin.apps.length) {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    firebaseApp = admin.app();
    console.log('Using existing Firebase Admin SDK instance');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
  throw error;
}

// Verify Firebase connection
const verifyFirebaseConnection = async () => {
  try {
    await admin.auth().listUsers(1);
    console.log('Firebase connection verified successfully');
    return true;
  } catch (error) {
    console.error('Error verifying Firebase connection:', error);
    return false;
  }
};

// Export both admin and verification function
module.exports = {
  admin,
  verifyFirebaseConnection
};