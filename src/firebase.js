// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe_65BQKaRmPzqjDGeTtA1Uzmjk-bBssM",
  authDomain: "plantrip-d1288.firebaseapp.com",
  projectId: "plantrip-d1288",
  storageBucket: "plantrip-d1288.firebasestorage.app",
  messagingSenderId: "431776779826",
  appId: "1:431776779826:web:dfb0dc2e0d165ea7f5b62b",
  measurementId: "G-N3Q7CN3MFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };