import React from 'react';
import { Bell, Search as SearchIcon, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Topbar({ isMobile }) {
    const { userProfile, searchQuery, setSearchQuery } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        if (location.pathname !== '/search' && e.target.value.trim() !== '') {
            navigate('/search');
        }
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
        border: '1px solid #2a2a35'
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
        gap: isMobile ? '10px' : '20px'
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
        border: '2px solid #2a2a35'
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

    return (
        <header style={topbarStyle}>
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
                    <div style={avatarStyle}>
                        {userProfile?.avatar ? (
                            <img src={userProfile.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <User size={24} color="#888" />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}