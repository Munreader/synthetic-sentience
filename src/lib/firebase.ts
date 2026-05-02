import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase configuration for Mün OS
const firebaseConfig = {
  apiKey: 'AIzaSyCzfyIPOwatJSX0Q8NPsfu9ZDN27cgzIJ4',
  authDomain: 'mun-mvp-test.firebaseapp.com',
  projectId: 'mun-mvp-test',
  storageBucket: 'mun-mvp-test.firebasestorage.app',
  messagingSenderId: '250949997267',
  appId: '1:250949997267:web:e95a14a28b81c0f873fa26',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider to show account selector
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
