// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Components/Landing';
import SignIn from './Components/SignIn';
import PreferencesForm from './Components/PreferencesForm';
import TripSuggestion from './Components/TripSuggestion';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/preferences" element={<PreferencesForm/>} />
        <Route path="/trip-suggestion" element={<TripSuggestion />} />
      </Routes>
    </Router>
  );
}

export default App;