import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library } from 'lucide-react';

export default function Sidebar({ isMobile }) {
    // --- INLINE СТИЛИ ---
    const sidebarStyle = isMobile ? {
        // Мобильный стиль (нижняя панель)
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '65px',
        backgroundColor: '#12121a',
        borderTop: '1px solid #2a2a35',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 50,
        paddingBottom: 'env(safe-area-inset-bottom)'
    } : {
        // Десктопный стиль (боковое меню)
        width: '240px',
        height: '100vh',
        backgroundColor: '#12121a',
        borderRight: '1px solid #2a2a35',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px 20px',
        flexShrink: 0
    };

    const logoContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '40px',
        paddingLeft: '10px'
    };

    const navContainerStyle = {
        display: 'flex',
        flexDirection: isMobile ? 'row' : 'column',
        gap: isMobile ? '0' : '10px',
        width: '100%'
    };

    // Функция для динамических стилей активной/неактивной ссылки
    const getLinkStyle = ({ isActive }) => {
        const baseStyle = {
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: 'center',
            gap: isMobile ? '4px' : '15px',
            padding: isMobile ? '10px' : '12px 15px',
            borderRadius: '12px',
            textDecoration: 'none',
            color: isActive ? '#fff' : '#888',
            backgroundColor: isActive && !isMobile ? '#2a2a35' : 'transparent',
            fontWeight: isActive ? 'bold' : 'normal',
            fontSize: isMobile ? '10px' : '16px',
            transition: 'all 0.2s ease',
        };
        return baseStyle;
    };

    return (
        <nav style={sidebarStyle}>
            {!isMobile && (
                <div style={logoContainerStyle}>
                    <img
                        src="/rushe_logo.png"
                        alt="RushE"
                        style={{ width: '28px', filter: 'invert(1)' }}
                    />
                    <span style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                        RushE
                    </span>
                </div>
            )}

            <div style={navContainerStyle}>
                <NavLink to="/" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Home size={isMobile ? 24 : 22} color={isActive ? '#9B51E0' : '#888'} />
                            <span>Главная</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/search" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Search size={isMobile ? 24 : 22} color={isActive ? '#9B51E0' : '#888'} />
                            <span>Поиск</span>
                        </>
                    )}
                </NavLink>

                <NavLink to="/library" style={getLinkStyle}>
                    {({ isActive }) => (
                        <>
                            <Library size={isMobile ? 24 : 22} color={isActive ? '#9B51E0' : '#888'} />
                            <span>Медиатека</span>
                        </>
                    )}
                </NavLink>
            </div>
        </nav>
    );
}