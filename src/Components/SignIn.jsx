// src/components/SignIn.jsx
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';// if you use react router dom

function SignIn() {
    const navigate = useNavigate();

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // User signed in successfully
                const user = result.user;
                console.log('User signed in:', user);
                navigate("/"); // navigate to the main page after login.
            })
            .catch((error) => {
                // Handle errors here.
                console.error('Error signing in:', error);
            });
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={signInWithGoogle}
            >
                Sign In with Google
            </button>
        </div>
    );
}

export default SignIn;