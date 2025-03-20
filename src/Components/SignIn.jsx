// src/components/SignIn.jsx
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // Import Google icon from react-icons

function SignIn() {
    const navigate = useNavigate();

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log('User signed in:', user);
                navigate("/");
            })
            .catch((error) => {
                console.error('Error signing in:', error);
            });
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-100 to-blue-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign In</h2>
                <button
                    className="flex items-center justify-center w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 rounded-md border border-gray-300 transition-colors duration-300"
                    onClick={signInWithGoogle}
                >
                    <FcGoogle className="h-6 w-6 mr-2" /> {/* Use Google icon */}
                    Sign In with Google
                </button>
            </div>
        </div>
    );
}

export default SignIn;