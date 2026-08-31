import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Liked from './pages/Liked';
import Onboarding from './pages/Onboarding';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import YouTubePlayer from './components/YouTubePlayer';

function AppContent() {
  const { hasCompletedOnboarding, currentTrack } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  const appStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0d0d12',
    color: '#ffffff',
    overflow: 'hidden'
  };

  const contentContainerStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'relative',
    overflow: 'hidden'
  };

  const mainAreaStyle = {
    flex: 1,
    overflowY: 'auto',
    padding: isMobile ? '10px' : '30px',
    paddingBottom: currentTrack ? (isMobile ? '140px' : '120px') : (isMobile ? '80px' : '30px'),
  };

  return (
    <div style={appStyle}>
      {!isMobile && <Sidebar isMobile={false} />}

      <div style={contentContainerStyle}>
        {!(isMobile && location.pathname === '/search') && <Topbar isMobile={isMobile} />}

        <div style={mainAreaStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {currentTrack && <YouTubePlayer isMobile={isMobile} />}
      {isMobile && <Sidebar isMobile={true} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}