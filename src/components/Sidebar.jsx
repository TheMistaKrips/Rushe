import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Heart, LogOut, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function Sidebar({ isMobile }) {
    const { userProfile } = useStore();
    const [isHovered, setIsHovered] = useState(false);

    const sidebarStyle = isMobile ? {
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        right: '16px',
        width: 'auto',
        height: '70px',
        backgroundColor: 'rgba(20, 20, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 1000,
        padding: '0 8px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    } : {
        width: '260px',
        height: '100vh',
        backgroundColor: '#0a0a0f',
        borderRight: '1px solid #1f1f2e',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        flexShrink: 0,
        position: 'sticky',
        top: 0
    };

    const getLinkStyle = ({ isActive }) => ({
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isMobile ? '4px' : '14px',
        padding: isMobile ? '6px 10px' : '12px 16px',
        borderRadius: '14px',
        textDecoration: 'none',
        color: isActive ? '#fff' : '#666',
        backgroundColor: isActive && !isMobile ? 'rgba(155, 81, 224, 0.15)' : 'transparent',
        fontWeight: isActive ? 'bold' : 'normal',
        fontSize: isMobile ? '10px' : '15px',
        transition: 'all 0.2s ease',
        flex: isMobile ? '1' : 'none',
        position: 'relative'
    });

    const handleLogout = () => {
        localStorage.removeItem('rushe-storage');
        window.location.reload();
    };

    return (
        <nav style={sidebarStyle}>
            {!isMobile && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '6px' }}
                >
                    <img
                        src="/rushe_logo_colored.png"
                        alt="RushE"
                        style={{
                            width: '40px',
                            height: '40px',
                            objectFit: 'contain'
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <span style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #9B51E0, #4A00E0)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        RushE
                    </span>
                </motion.div>
            )}

            <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: isMobile ? '0' : '6px', width: '100%' }}>
                <NavLink to="/" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Home
                                size={isMobile ? 24 : 20}
                                color={isActive ? '#9B51E0' : '#666'}
                                style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(155,81,224,0.4))' } : {}}
                            />
                            <span style={{ color: isActive ? '#9B51E0' : '#666' }}>Главная</span>
                            {isActive && !isMobile && (
                                <motion.div layoutId="activeIndicator" style={{ position: 'absolute', left: 0, width: '3px', height: '28px', background: '#9B51E0', borderRadius: '0 4px 4px 0' }} />
                            )}
                        </>
                    )}
                </NavLink>
                <NavLink to="/search" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Search
                                size={isMobile ? 24 : 20}
                                color={isActive ? '#9B51E0' : '#666'}
                                style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(155,81,224,0.4))' } : {}}
                            />
                            <span style={{ color: isActive ? '#9B51E0' : '#666' }}>Поиск</span>
                            {isActive && !isMobile && (
                                <motion.div layoutId="activeIndicator" style={{ position: 'absolute', left: 0, width: '3px', height: '28px', background: '#9B51E0', borderRadius: '0 4px 4px 0' }} />
                            )}
                        </>
                    )}
                </NavLink>
                <NavLink to="/library" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Library
                                size={isMobile ? 24 : 20}
                                color={isActive ? '#9B51E0' : '#666'}
                                style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(155,81,224,0.4))' } : {}}
                            />
                            <span style={{ color: isActive ? '#9B51E0' : '#666' }}>Медиатека</span>
                            {isActive && !isMobile && (
                                <motion.div layoutId="activeIndicator" style={{ position: 'absolute', left: 0, width: '3px', height: '28px', background: '#9B51E0', borderRadius: '0 4px 4px 0' }} />
                            )}
                        </>
                    )}
                </NavLink>
                <NavLink to="/liked" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Heart
                                size={isMobile ? 24 : 20}
                                color={isActive ? '#FF2A54' : '#666'}
                                style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(255,42,84,0.4))' } : {}}
                            />
                            <span style={{ color: isActive ? '#FF2A54' : '#666' }}>Лайки</span>
                            {isActive && !isMobile && (
                                <motion.div layoutId="activeIndicator" style={{ position: 'absolute', left: 0, width: '3px', height: '28px', background: '#FF2A54', borderRadius: '0 4px 4px 0' }} />
                            )}
                        </>
                    )}
                </NavLink>
            </div>

            {!isMobile && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginTop: 'auto', padding: '16px 10px', borderTop: '1px solid #1f1f2e' }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9B51E0, #4A00E0)',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            {userProfile?.avatar ? (
                                <img src={userProfile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <User size={20} color="#fff" />
                            )}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                {userProfile?.name || 'Гость'}
                            </div>
                            <div style={{ fontSize: '11px', color: '#666' }}>Пользователь</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: 'none',
                            border: '1px solid #2a2a35',
                            borderRadius: '12px',
                            color: '#888',
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#FF2A54';
                            e.currentTarget.style.color = '#FF2A54';
                            e.currentTarget.style.background = 'rgba(255,42,84,0.05)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#2a2a35';
                            e.currentTarget.style.color = '#888';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <LogOut size={16} />
                        Выйти
                    </button>
                </motion.div>
            )}
        </nav>
    );
}