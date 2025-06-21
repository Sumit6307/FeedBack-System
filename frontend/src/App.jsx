import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar.jsx';
import Login from './components/Login.jsx';
import ManagerDashboard from './pages/ManagerDashboard.jsx';
import EmployeeDashboard from './pages/EmployeeDashboard.jsx';
import Home from './pages/Home.jsx';
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => setUser(res.data)).catch(() => {
        setError('Failed to fetch user data');
        localStorage.removeItem('token');
        setToken(null);
      });
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (!token || !user) {
    return <Login setToken={setToken} error={error} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar logout={logout} user={user} />
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/dashboard" element={
            user.role === 'manager' ? <ManagerDashboard user={user} /> : <EmployeeDashboard user={user} />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;