import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, Moon, Sun, Trash2, User, Music, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Settings() {
    const navigate = useNavigate();
    const { volume, setVolume, likedTracks, userProfile, myPlaylists } = useStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [darkMode, setDarkMode] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const clearAllData = () => {
        localStorage.removeItem('rushe-storage');
        window.location.reload();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            height: '100%',
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#888',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Настройки</h1>
            </div>

            {/* Профиль */}
            <div style={{
                backgroundColor: '#1a1a24',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #2a2a35'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={20} color="#9B51E0" />
                    Профиль
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        width: '56px',
                        height: '56px',
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
                            <User size={24} color="#fff" />
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{userProfile?.name || 'Гость'}</div>
                        <div style={{ fontSize: '13px', color: '#888' }}>{userProfile?.email || 'user@example.com'}</div>
                    </div>
                </div>
            </div>

            {/* Громкость */}
            <div style={{
                backgroundColor: '#1a1a24',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #2a2a35'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Volume2 size={20} color="#9B51E0" />
                    Громкость
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontSize: '14px', color: '#888' }}>{Math.round(volume * 100)}%</span>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        style={{
                            flex: 1,
                            height: '4px',
                            WebkitAppearance: 'none',
                            backgroundColor: '#2a2a35',
                            borderRadius: '2px',
                            outline: 'none'
                        }}
                    />
                    <style>{`
                        input[type="range"]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            background: #9B51E0;
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            </div>

            {/* Статистика */}
            <div style={{
                backgroundColor: '#1a1a24',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #2a2a35'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Music size={20} color="#9B51E0" />
                    Статистика
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: '#0d0d12', padding: '12px 16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Любимые треки</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{likedTracks.length}</div>
                    </div>
                    <div style={{ backgroundColor: '#0d0d12', padding: '12px 16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#888' }}>Плейлисты</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{myPlaylists.length}</div>
                    </div>
                </div>
            </div>

            {/* Очистка данных */}
            <div style={{
                backgroundColor: '#1a1a24',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #2a2a35'
            }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '10px', color: '#FF2A54' }}>
                    <Trash2 size={20} color="#FF2A54" />
                    Опасная зона
                </h3>
                {showConfirm ? (
                    <div>
                        <div style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
                            Вы уверены? Все данные будут удалены безвозвратно.
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={clearAllData}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#FF2A54',
                                    border: 'none',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Да, удалить
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #2a2a35',
                                    borderRadius: '10px',
                                    color: '#888',
                                    cursor: 'pointer'
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setShowConfirm(true)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'rgba(255,42,84,0.1)',
                            border: '1px solid #FF2A54',
                            borderRadius: '10px',
                            color: '#FF2A54',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            fontSize: '14px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,42,84,0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,42,84,0.1)'}
                    >
                        Очистить все данные
                    </button>
                )}
            </div>

            <div style={{
                fontSize: '12px',
                color: '#444',
                textAlign: 'center',
                padding: '16px 0',
                borderTop: '1px solid #1a1a24',
                marginTop: '8px'
            }}>
                RushE Music Player v1.0.0
            </div>
        </div>
    );
}