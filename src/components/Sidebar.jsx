import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, LogOut } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Sidebar({ isMobile }) {
    const { userProfile } = useStore();

    const sidebarStyle = isMobile ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100vw',
        height: '70px',
        backgroundColor: 'rgba(10, 10, 15, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom)'
    } : {
        width: '240px',
        height: '100vh',
        backgroundColor: '#0a0a0f',
        borderRight: '1px solid #1f1f2e',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        flexShrink: 0
    };

    const getLinkStyle = ({ isActive }) => ({
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '6px' : '15px',
        padding: isMobile ? '8px' : '12px 15px',
        borderRadius: '12px',
        textDecoration: 'none',
        color: isActive ? '#fff' : '#666',
        backgroundColor: isActive && !isMobile ? '#1f1f2e' : 'transparent',
        fontWeight: isActive ? 'bold' : 'normal',
        fontSize: isMobile ? '10px' : '16px',
        transition: 'all 0.2s ease',
        flex: isMobile ? '1' : 'none'
    });

    const handleLogout = () => {
        localStorage.removeItem('rushe-storage');
        window.location.reload();
    };

    return (
        <nav style={sidebarStyle}>
            {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '10px' }}>
                    <img src="/rushe_logo_colored.png" alt="RushE" style={{ width: '32px', height: '32px' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <span style={{ fontSize: '22px', fontWeight: 'bold' }}>RushE</span>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? '0' : '10px', width: '100%' }}>
                <NavLink to="/" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Home size={isMobile ? 26 : 22} color={isActive ? '#fff' : '#666'} />
                            <span>Главная</span>
                        </>
                    )}
                </NavLink>
                <NavLink to="/search" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Search size={isMobile ? 26 : 22} color={isActive ? '#fff' : '#666'} />
                            <span>Поиск</span>
                        </>
                    )}
                </NavLink>
                <NavLink to="/library" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Library size={isMobile ? 26 : 22} color={isActive ? '#fff' : '#666'} />
                            <span>Медиатека</span>
                        </>
                    )}
                </NavLink>
                <NavLink to="/liked" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Heart size={isMobile ? 26 : 22} color={isActive ? '#fff' : '#666'} />
                            <span>Лайки</span>
                        </>
                    )}
                </NavLink>
            </div>

            {!isMobile && (
                <div style={{ marginTop: 'auto', padding: '20px 10px', borderTop: '1px solid #1f1f2e' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#2a2a35',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {userProfile?.avatar ? (
                                <img src={userProfile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ fontSize: '18px' }}>👤</span>
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{userProfile?.name || 'Гость'}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Пользователь</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '8px',
                            background: 'none',
                            border: '1px solid #2a2a35',
                            borderRadius: '8px',
                            color: '#888',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#FF2A54';
                            e.currentTarget.style.color = '#FF2A54';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#2a2a35';
                            e.currentTarget.style.color = '#888';
                        }}
                    >
                        <LogOut size={16} />
                        Выйти
                    </button>
                </div>
            )}
        </nav>
    );
}