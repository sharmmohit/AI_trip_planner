import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC1NAelPjsgIJum1tl9iO5Kw7pgI5b43uU",
  authDomain: "tripplanner-88ede.firebaseapp.com",
  projectId: "tripplanner-88ede",
  storageBucket: "tripplanner-88ede.appspot.com",
  messagingSenderId: "1027232887347",
  appId: "1:1027232887347:web:00e9e0b700944fa3732946",
  measurementId: "G-M2W9JY9GKL"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Helper functions for trips
const saveTrip = async (userId, tripData) => {
  try {
    const docRef = await addDoc(collection(db, "trips"), {
      userId,
      ...tripData,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding trip: ", e);
    throw e;
  }
};

const getUserTrips = async (userId) => {
  try {
    const q = query(collection(db, "trips"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (e) {
    console.error("Error getting trips: ", e);
    throw e;
  }
};

export { auth, provider, db, saveTrip, getUserTrips };