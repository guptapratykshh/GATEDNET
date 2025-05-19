const admin = require('firebase-admin');
const { firebaseConfig } = require('./config/config');

console.log('Firebase config:', {
  projectId: firebaseConfig.projectId,
  clientEmail: firebaseConfig.clientEmail,
  privateKey: firebaseConfig.privateKey ? 'Loaded' : 'Missing',
});

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: firebaseConfig.projectId,
      clientEmail: firebaseConfig.clientEmail,
      privateKey: firebaseConfig.privateKey,
    }),
  });
}

module.exports = admin;