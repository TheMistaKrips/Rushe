import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Player from './components/Player';
import Home from './components/Home';
import Search from './components/Search';
import Library from './components/Library';
import Liked from './components/Liked';
import Onboarding from './components/Onboarding';

function App() {
  const { hasCompletedOnboarding } = useStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const contentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    padding: isMobile ? '0 15px 130px 15px' : '0 30px 100px 30px',
    backgroundColor: '#0d0d12'
  };

  if (!hasCompletedOnboarding) {
    return (
      <BrowserRouter>
        <Onboarding />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: '#0d0d12' }}>
        <Sidebar isMobile={isMobile} />
        <div style={contentStyle}>
          <Topbar isMobile={isMobile} />
          <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/liked" element={<Liked />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
        <Player isMobile={isMobile} />
      </div>
    </BrowserRouter>
  );
}

export default App;