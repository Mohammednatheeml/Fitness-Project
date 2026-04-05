import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Calories from './pages/Calories';
import Profile from './pages/Profile';
import DietPlan from './pages/DietPlan';
import Progress from './pages/Progress';
import Hydration from './pages/Hydration';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Workout from './pages/Workout';
import SleepTracker from './pages/SleepTracker';

const PrivateRoute = ({ children, isProfileRequired = true, profileComplete = false }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mandatory profile completion guard
  if (isProfileRequired && !profileComplete && location.pathname !== '/profile') {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

function App() {
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkProfileStatus = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('http://localhost:5000/user/profile', config);
      
      const isComplete = res.data && res.data.age && res.data.height && res.data.weight;
      setProfileComplete(!!isComplete);
    } catch (error) {
      // If token is invalid or expired
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        localStorage.removeItem('token');
      }
      // 404 or other errors mean profile is not yet complete or has an issue
      setProfileComplete(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkProfileStatus();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-on-surface-variant font-display text-xs tracking-widest uppercase animate-pulse">Initializing Ecosystem...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={() => checkProfileStatus()} />} />
        
        <Route path="/profile" element={
          <PrivateRoute isProfileRequired={false} profileComplete={profileComplete}>
            <Layout>
              <Profile onProfileUpdate={() => checkProfileStatus()} />
            </Layout>
          </PrivateRoute>
        } />

        <Route path="/" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/chat" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Chat />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/calories" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Calories />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/diet" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <DietPlan />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/workout" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Workout />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/progress" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Progress />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/water" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Hydration />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/sleep" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <SleepTracker />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/reports" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Reports />
            </Layout>
          </PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute profileComplete={profileComplete}>
            <Layout>
              <Settings />
            </Layout>
          </PrivateRoute>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
