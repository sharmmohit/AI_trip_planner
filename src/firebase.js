// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1NAelPjsgIJum1tl9iO5Kw7pgI5b43uU",
  authDomain: "tripplanner-88ede.firebaseapp.com",
  projectId: "tripplanner-88ede",
  storageBucket: "tripplanner-88ede.firebasestorage.app",
  messagingSenderId: "1027232887347",
  appId: "1:1027232887347:web:00e9e0b700944fa3732946",
  measurementId: "G-M2W9JY9GKL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };