import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// TODO: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcqlMLULQZVU7lQI6FwN7tbrpVBVnnNdU",
  authDomain: "iv-fluid-8de53.firebaseapp.com",
  databaseURL: "https://iv-fluid-8de53-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "iv-fluid-8de53",
  storageBucket: "iv-fluid-8de53.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { app, db };
