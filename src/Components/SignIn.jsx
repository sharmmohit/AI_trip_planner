// src/components/SignIn.jsx
import { useState } from 'react';
import { auth, provider } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Sign In</h2>
        <form onSubmit={handleEmailSignIn}>
          <input type="email" placeholder="Email" className="w-full p-3 border rounded mb-4" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">Sign In</button>
        </form>
        <button onClick={handleGoogleSignIn} className="w-full mt-4 bg-red-500 text-white p-3 rounded hover:bg-red-600 transition">
          Sign In with Google
        </button>
        <p className="text-center mt-4 text-sm">
          Don't have an account? <Link to="/signup" className="text-blue-600">Get Started</Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
