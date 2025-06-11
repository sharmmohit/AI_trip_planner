// src/components/SignUp.jsx
import { useState } from 'react';
import { auth, db, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: userCred.user.email,
      });
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
      });
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Get Started</h2>
        <form onSubmit={handleEmailSignUp}>
          <input type="email" placeholder="Email" className="w-full p-3 border rounded mb-4" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">Sign Up</button>
        </form>
        <button onClick={handleGoogleSignUp} className="w-full mt-4 bg-red-500 text-white p-3 rounded hover:bg-red-600 transition">
          Sign Up with Google
        </button>
        <p className="text-center mt-4 text-sm">
          Already have an account? <Link to="/signin" className="text-blue-600">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
