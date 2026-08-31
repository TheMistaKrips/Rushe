import React, { useState } from 'react';
import { Bell, Search as SearchIcon, User, LogOut, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Topbar({ isMobile }) {
    const { userProfile, searchQuery, setSearchQuery } = useStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (location.pathname !== '/search' && e.target.value.trim() !== '') {
            navigate('/search');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('rushe-storage');
        window.location.reload();
    };

    const topbarStyle = {
        height: '80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '0 15px' : '0 30px',
        backgroundColor: 'transparent',
        flexShrink: 0,
        gap: '15px'
    };

    const searchContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#1a1a24',
        borderRadius: '25px',
        padding: '0 15px',
        height: '46px',
        flex: isMobile ? '1' : '0 1 400px',
        border: '1px solid #2a2a35',
        transition: 'border-color 0.2s'
    };

    const inputStyle = {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#fff',
        width: '100%',
        marginLeft: '10px',
        outline: 'none',
        fontSize: '15px'
    };

    const rightSectionStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '10px' : '20px',
        position: 'relative'
    };

    const avatarStyle = {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#2a2a35',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        border: '2px solid #2a2a35',
        cursor: 'pointer',
        transition: 'border-color 0.2s'
    };

    const bellStyle = {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#12121a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '1px solid #2a2a35',
        flexShrink: 0
    };

    const dropdownStyle = {
        position: 'absolute',
        top: '55px',
        right: '0',
        backgroundColor: '#1c1c1e',
        borderRadius: '12px',
        border: '1px solid #2a2a35',
        padding: '8px',
        minWidth: '200px',
        zIndex: 1000,
        boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    };

    const dropdownItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 16px',
        borderRadius: '8px',
        cursor: 'pointer',
        color: '#fff',
        fontSize: '14px',
        background: 'none',
        border: 'none',
        width: '100%',
        textAlign: 'left',
        transition: 'background-color 0.2s'
    };

    return (
        <header style={topbarStyle}>
            {isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/rushe_logo_colored.png" alt="RushE" style={{ width: '28px', height: '28px' }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>RushE</span>
                </div>
            )}

            <div style={searchContainerStyle}>
                <SearchIcon size={18} color="#888" />
                <input
                    type="text"
                    placeholder="Поиск музыки..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={inputStyle}
                />
            </div>

            <div style={rightSectionStyle}>
                {!isMobile && (
                    <div style={bellStyle}>
                        <Bell size={20} color="#fff" />
                    </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!isMobile && (
                        <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>
                            {userProfile?.name || 'Пользователь'}
                        </span>
                    )}
                    <div
                        style={avatarStyle}
                        onClick={() => setShowDropdown(!showDropdown)}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9B51E0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a35'}
                    >
                        {userProfile?.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={24} color="#888" />
                        )}
                    </div>
                </div>

                {showDropdown && (
                    <div style={dropdownStyle}>
                        <div style={{ padding: '8px 16px', borderBottom: '1px solid #2a2a35', marginBottom: '8px' }}>
                            <div style={{ fontWeight: 'bold' }}>{userProfile?.name || 'Пользователь'}</div>
                            <div style={{ fontSize: '12px', color: '#888' }}>{userProfile?.email || 'user@example.com'}</div>
                        </div>
                        <button
                            style={dropdownItemStyle}
                            onClick={() => { setShowDropdown(false); navigate('/'); }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a35'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <Settings size={18} color="#888" />
                            Настройки
                        </button>
                        <button
                            style={{ ...dropdownItemStyle, color: '#FF2A54' }}
                            onClick={handleLogout}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,42,84,0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <LogOut size={18} color="#FF2A54" />
                            Выйти
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}