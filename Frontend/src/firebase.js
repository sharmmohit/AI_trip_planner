import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs } from 'firebase/firestore';

const firebaseConfig = {
apiKey: "AIzaSyCe_65BQKaRmPzqjDGeTtA1Uzmjk-bBssM",
  authDomain: "plantrip-d1288.firebaseapp.com",
  projectId: "plantrip-d1288",
  storageBucket: "plantrip-d1288.appspot.com", // ✅ correct

  messagingSenderId: "431776779826",
  appId: "1:431776779826:web:dfb0dc2e0d165ea7f5b62b",
  measurementId: "G-N3Q7CN3MFS"
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