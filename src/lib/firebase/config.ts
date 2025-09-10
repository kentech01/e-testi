import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDO2DD3sAn1Uet9suZmy6I_7gwv3MqB48Q',
  authDomain: 'e-testi-2400b.firebaseapp.com',
  projectId: 'e-testi-2400b',
  storageBucket: 'e-testi-2400b.firebasestorage.app',
  messagingSenderId: '781268602382',
  appId: '1:781268602382:web:0c4bf3c83f4c62ee80365f',
  measurementId: 'G-1X7K3Y0GDF',
};

// Initialize Firebase only if no apps exist
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Authentication
export const auth = getAuth(app);

export default app;
