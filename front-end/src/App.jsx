import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LeadDashboard from './components/LeadDashboard';
import Header from './components/Header';
import Settings from './components/Settings';
import LeadsPage from './components/LeadsPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('movingLeadsToken');
    const user = localStorage.getItem('movingLeadsUser');
    
    if (token && user) {
      setUserData({
        token: token,
        user: JSON.parse(user)
      });
      setIsLoggedIn(true);
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (data) => {
    setUserData(data);
    setIsLoggedIn(true);
    localStorage.setItem('movingLeadsToken', data.token);
    localStorage.setItem('movingLeadsUser', JSON.stringify(data.user));
  };

  const handleLogout = () => {
    setUserData(null);
    setIsLoggedIn(false);
    localStorage.removeItem('movingLeadsToken');
    localStorage.removeItem('movingLeadsUser');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router basename="/moving-leads-app">
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? (
                <>
                  <Header onLogout={handleLogout} user={userData.user} />
                  <LeadDashboard userData={userData} />
                </>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/leads" 
            element={
              isLoggedIn ? (
                <>
                  <Header onLogout={handleLogout} user={userData.user} />
                  <LeadsPage />
                </>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/settings" 
            element={
              isLoggedIn ? (
                <>
                  <Header onLogout={handleLogout} user={userData.user} />
                  <Settings />
                </>
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          <Route 
            path="/" 
            element={
              <Navigate to={isLoggedIn ? "/dashboard" : "/login"} />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;