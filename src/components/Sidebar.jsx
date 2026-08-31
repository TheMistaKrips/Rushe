import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library } from 'lucide-react';

export default function Sidebar({ isMobile }) {
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

    return (
        <nav style={sidebarStyle}>
            {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '10px' }}>
                    <img src="/rushe_logo.png" alt="RushE" style={{ width: '28px', filter: 'invert(1)' }} />
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
            </div>

            {!isMobile && (
                <div style={{ marginTop: 'auto', padding: '20px 10px', color: '#666', fontSize: '12px', lineHeight: '1.5' }}>
                    RushE - музыка без ограничений
                </div>
            )}
        </nav>
    );
}