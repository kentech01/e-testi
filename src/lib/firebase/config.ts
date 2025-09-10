import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAXYK9ECtByC1hcgm1ABjp3ohrtoapt7ug',
  authDomain: 'e-testi-523ef.firebaseapp.com',
  projectId: 'e-testi-523ef',
  storageBucket: 'e-testi-523ef.firebasestorage.app',
  messagingSenderId: '835299946838',
  appId: '1:835299946838:web:c71dc454b5152b3c2826f7',
  measurementId: 'G-S6KS759NXR',
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
