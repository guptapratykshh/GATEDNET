import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase web config from Firebase Console
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
export const auth = getAuth(app);