import { useState } from 'react';
import { auth, db, provider } from '../firebase';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCred.user.uid), {
        email: userCred.user.email,
        createdAt: new Date().toISOString()
      });
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        createdAt: new Date().toISOString(),
        photoURL: result.user.photoURL
      });
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/popup-blocked') {
        alert('Popup blocked! Please allow popups for this site.');
      } else if (err.code !== 'auth/cancelled-popup-request') {
        alert(err.message);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-xl shadow-sm w-full max-w-md border border-gray-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h1>
          <p className="text-gray-500 text-sm">Get started with your trip planning</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition flex justify-center items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing Up...
              </>
            ) : (
              'Sign Up'
            )}
          </motion.button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          disabled={loading || googleLoading}
          className="w-full bg-white text-gray-700 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-lg" />
          {googleLoading ? 'Signing in with Google...' : 'Sign Up with Google'}
        </motion.button>

        <p className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default SignUp;
