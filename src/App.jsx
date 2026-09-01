import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { AnimatePresence } from 'framer-motion';

import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Liked from './pages/Liked';
import PlaylistDetail from './pages/PlaylistDetail';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import WidgetRouter from './pages/WidgetRouter';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import UnifiedPlayer from './components/UnifiedPlayer';

function AppContent() {
  const { hasCompletedOnboarding, currentTrack } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isWidget = location.pathname.startsWith('/widget');

  if (!hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  if (isWidget) {
    return <WidgetRouter />;
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
    padding: isMobile ? '12px' : '30px',
    paddingBottom: currentTrack ? (isMobile ? '150px' : '120px') : (isMobile ? '90px' : '30px'),
    scrollBehavior: 'smooth'
  };

  return (
    <div style={appStyle}>
      {!isMobile && <Sidebar isMobile={false} />}

      <div style={contentContainerStyle}>
        <Topbar isMobile={isMobile} />

        <div style={mainAreaStyle}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="/playlist/:id" element={<PlaylistDetail />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>

      {currentTrack && <UnifiedPlayer isWidget={false} />}
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