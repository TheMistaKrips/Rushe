import React from 'react';
import { Bell, ChevronDown, User } from 'lucide-react';

export default function Topbar({ isMobile }) {
    // --- INLINE СТИЛИ ---
    const topbarStyle = {
        height: '80px',
        display: 'flex',
        justifyContent: 'flex-end', // Сдвигаем профиль вправо
        alignItems: 'center',
        padding: isMobile ? '0 15px' : '0 30px',
        backgroundColor: 'transparent',
        flexShrink: 0
    };

    const profileContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        cursor: 'pointer',
        padding: '8px 12px',
        borderRadius: '30px',
        transition: 'background-color 0.2s',
    };

    const avatarStyle = {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#2a2a35',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
    };

    const infoStyle = {
        display: isMobile ? 'none' : 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    };

    const bellStyle = {
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#12121a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '15px',
        cursor: 'pointer',
        border: '1px solid #2a2a35'
    };

    return (
        <header style={topbarStyle}>
            <div
                style={profileContainerStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1a1a24'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <div style={avatarStyle}>
                    <User size={24} color="#888" />
                </div>
                <div style={infoStyle}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#fff' }}>
                        Герман Фетисов
                    </span>
                    <span style={{ fontSize: '12px', color: '#9B51E0' }}>
                        Pro Member
                    </span>
                </div>
                {!isMobile && <ChevronDown size={16} color="#888" style={{ marginLeft: '5px' }} />}
            </div>

            <div style={bellStyle}>
                <Bell size={20} color="#fff" />
            </div>
        </header>
    );
}