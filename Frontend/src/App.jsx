import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Components/Landing';
import PreferencesForm from './Components/PreferencesForm';
import TripSuggestion from './Components/TripSuggestion';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';

// New import
// For protected routes

function App() {
  return (
    <Router>
    
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/preferences" element={<PreferencesForm />} />
          <Route path="/trip-suggestion" element={<TripSuggestion />} />
  
        </Routes>
      
    </Router>
  );
}

export default App;