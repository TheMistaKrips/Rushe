import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Onboarding from './pages/Onboarding';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Player from './components/Player';

export default function App() {
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
    backgroundColor: '#000000', // Истинно черный для мобилок
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
    // Динамический отступ: если есть плеер на мобилке (60px) + нижнее меню (70px) = 140px
    paddingBottom: currentTrack ? (isMobile ? '140px' : '120px') : (isMobile ? '80px' : '30px'),
  };

  return (
    <div style={appStyle}>
      {!isMobile && <Sidebar />}

      <div style={contentContainerStyle}>
        {/* Скрываем Topbar на мобилках на странице поиска, чтобы не дублировать инпуты */}
        {!(isMobile && location.pathname === '/search') && <Topbar isMobile={isMobile} />}

        <div style={mainAreaStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {currentTrack && <Player isMobile={isMobile} />}
      {isMobile && <Sidebar isMobile={true} />}
    </div>
  );
}