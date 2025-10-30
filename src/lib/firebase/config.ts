import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAw2qPzKkC4dQCI15oylKJEnW2e8REgz9o',
  authDomain: 'e-testi-f3a58.firebaseapp.com',
  projectId: 'e-testi-f3a58',
  storageBucket: 'e-testi-f3a58.firebasestorage.app',
  messagingSenderId: '624254973631',
  appId: '1:624254973631:web:6f9addb7b108d074a1f80a',
  measurementId: 'G-NB99HZ4XS7',
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

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;
