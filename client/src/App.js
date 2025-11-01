import React, { useEffect, useState, useContext } from 'react'; // <-- Import useContext
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from './context/ThemeContext'; // <-- Import ThemeContext

import LoginPage from './components/LoginPage';
import SearchDashboard from './components/SearchDashboard';
import CollectionsPage from './components/CollectionsPage';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext); // <-- Get the theme

  // --- THIS IS THE NEW PART ---
  // This effect applies the theme to the root of the document
  useEffect(() => {
    for (const key in theme) {
      document.documentElement.style.setProperty(key, theme[key]);
    }
  }, [theme]);
  // --- END NEW PART ---

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('/api/current_user');
        setUser(res.data);
      } catch (err) {
        // User is not logged in
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? <SearchDashboard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/collections"
        element={
          user ? <CollectionsPage /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;