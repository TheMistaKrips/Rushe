import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

// Заглушки для будущих компонентов. 
// Пока они не созданы, приложение может выдавать ошибку компиляции. Это нормально.
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Onboarding from './pages/Onboarding';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Player from './components/Player';

export default function App() {
  const hasCompletedOnboarding = useStore(state => state.hasCompletedOnboarding);
  const currentTrack = useStore(state => state.currentTrack);
  const navigate = useNavigate();
  const location = useLocation();

  // Локальный стейт для адаптива (inline-стили не поддерживают @media)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Защита роутов: если нет онбординга, отправляем на экран выбора жанров
  useEffect(() => {
    if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
  }, [hasCompletedOnboarding, navigate, location]);

  if (!hasCompletedOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Onboarding />} />
      </Routes>
    );
  }

  // --- INLINE СТИЛИ ---
  const appStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0d0d12', // Темный фон из дизайна
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
    // Оставляем место снизу, если включен плеер, чтобы он не перекрывал контент
    paddingBottom: currentTrack ? (isMobile ? '160px' : '120px') : '30px',
  };

  return (
    <div style={appStyle}>
      {/* На десктопе показываем боковое меню слева */}
      {!isMobile && <Sidebar />}

      <div style={contentContainerStyle}>
        <Topbar isMobile={isMobile} />

        <div style={mainAreaStyle}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </div>
      </div>

      {/* Глобальный выносимый плеер (показывается только если есть активный трек) */}
      {currentTrack && <Player isMobile={isMobile} />}

      {/* На мобилках Sidebar превращается в нижнее навигационное меню */}
      {isMobile && <Sidebar isMobile={true} />}
    </div>
  );
}