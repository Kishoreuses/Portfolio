import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Interests from './components/Interests';
import Certifications from './components/Certifications';
import Projects from './components/Projects';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import api from './services/api';
import { fallbackProfile } from './data/fallback';
import BackgroundAnimation from './components/BackgroundAnimation';

const HomePage = ({ profile }) => {
  useEffect(() => {
    // Auto-logout when visiting the home page
    localStorage.removeItem('token');
    localStorage.removeItem('adminInfo');
  }, []);

  return (
    <>
      <Navbar />
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills />
      <Interests />
      <Certifications />
      <Projects />
      <Education />
      <Contact profile={profile} />
      <Footer />
    </>
  );
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
};

function App() {
  const [profile, setProfile] = useState(fallbackProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    sections.forEach((section) => observer.observe(section));

    const fetchData = async () => {
      try {
        const profileData = await api.getProfile();
        if (profileData && Object.keys(profileData).length > 0) {
          setProfile(profileData);
        } else {
          setProfile(fallbackProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(fallbackProfile);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    return () => observer.disconnect();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text)' }}>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <BackgroundAnimation />
      <Routes>
        <Route path="/" element={<HomePage profile={profile} />} />
        <Route path="/admin/login" element={<AdminLogin onLoginSuccess={() => setProfile({ ...profile })} />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard profile={profile} refreshProfile={setProfile} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

