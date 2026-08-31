import React, { useState, useEffect } from 'react';
import { Heart, Music, Plus, Trash2, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Library() {
    const { likedTracks, myPlaylists, createPlaylist, deletePlaylist } = useStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showCreate, setShowCreate] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setShowCreate(false);
        }
    };

    const openPlaylist = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Медиатека</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#9B51E0',
                        border: 'none',
                        borderRadius: '14px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Plus size={18} />
                    Создать
                </button>
            </div>

            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            display: 'flex',
                            gap: '10px',
                            backgroundColor: '#1a1a24',
                            padding: '16px',
                            borderRadius: '16px',
                            alignItems: 'center',
                            flexWrap: 'wrap'
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Название плейлиста"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                backgroundColor: '#0d0d12',
                                border: '1px solid #2a2a35',
                                borderRadius: '10px',
                                color: '#fff',
                                fontSize: '14px',
                                outline: 'none',
                                minWidth: '150px'
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleCreatePlaylist();
                            }}
                        />
                        <button
                            onClick={handleCreatePlaylist}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#9B51E0',
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
                            Создать
                        </button>
                        <button
                            onClick={() => setShowCreate(false)}
                            style={{
                                padding: '12px 20px',
                                backgroundColor: 'transparent',
                                border: '1px solid #2a2a35',
                                borderRadius: '10px',
                                color: '#888',
                                cursor: 'pointer'
                            }}
                        >
                            Отмена
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
                <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{
                        backgroundColor: '#1a1a24',
                        borderRadius: '16px',
                        padding: '20px',
                        border: '1px solid #2a2a35',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FF2A54'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a35'}
                    onClick={() => navigate('/liked')}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #FF2A54, #ff6b81)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Heart size={22} color="#fff" />
                        </div>
                        <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Любимые треки</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#888' }}>{likedTracks.length} треков</div>
                    <ChevronRight size={16} color="#666" style={{ marginTop: '8px' }} />
                </motion.div>

                {myPlaylists.map((playlist) => (
                    <motion.div
                        key={playlist.id}
                        whileHover={{ y: -4, scale: 1.01 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                        style={{
                            backgroundColor: '#1a1a24',
                            borderRadius: '16px',
                            padding: '20px',
                            border: '1px solid #2a2a35',
                            cursor: 'pointer',
                            transition: 'all 0.3s',
                            position: 'relative'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9B51E0'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2a35'}
                        onClick={() => openPlaylist(playlist.id)}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, #9B51E0, #4A00E0)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {playlist.cover ? (
                                    <img src={playlist.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <Music size={20} color="#fff" />
                                )}
                            </div>
                            <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{playlist.name}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#888' }}>{playlist.tracks?.length || 0} треков</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                            <ChevronRight size={16} color="#666" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deletePlaylist(playlist.id);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#666',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    borderRadius: '8px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#FF2A54';
                                    e.currentTarget.style.background = 'rgba(255,42,84,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#666';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}