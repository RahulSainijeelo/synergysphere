import { getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {getAuth }from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyBhfZ_gD0b9S0PqXIwiWmoXyeqOlJlUqtE",
  authDomain: "odoo-549b4.firebaseapp.com",
  projectId: "odoo-549b4",
  storageBucket: "odoo-549b4.firebasestorage.app",
  messagingSenderId: "795824592697",
  appId: "1:795824592697:web:95e7675b56ec879d027ae8",
  measurementId: "G-87BJHNLDYC"
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { auth };