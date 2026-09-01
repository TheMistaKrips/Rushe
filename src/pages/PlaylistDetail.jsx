import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Trash2, Plus, Search, X, Music, Play } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { searchYouTubeTracks } from '../config/youtube';

export default function PlaylistDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { myPlaylists, removeTrackFromPlaylist, addTrackToPlaylist, playTrack, currentTrack, toggleLike, likedTracks } = useStore();
    const [playlist, setPlaylist] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showAddTracks, setShowAddTracks] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const pl = myPlaylists.find(p => p.id === id);
        if (pl) {
            setPlaylist(pl);
        } else {
            navigate('/library');
        }
    }, [id, myPlaylists, navigate]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            setSearchError(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            setSearchError(null);
            try {
                const results = await searchYouTubeTracks(searchQuery, 15);
                if (results && results.length > 0) {
                    setSearchResults(results);
                } else {
                    setSearchResults([]);
                    setSearchError('Ничего не найдено');
                }
            } catch (err) {
                console.error('Search error:', err);
                setSearchError('Ошибка поиска');
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleAddTrack = (track) => {
        addTrackToPlaylist(id, track);
        setSearchQuery('');
        setSearchResults([]);
        setShowAddTracks(false);
    };

    const isTrackInPlaylist = (trackId) => {
        return playlist?.tracks?.some(t => t.id === trackId) || false;
    };

    if (!playlist) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                    onClick={() => navigate('/library')}
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
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, flex: 1 }}>
                    {playlist.name}
                </h1>
                <button
                    onClick={() => setShowAddTracks(!showAddTracks)}
                    style={{
                        padding: '10px 16px',
                        backgroundColor: '#9B51E0',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <Plus size={16} />
                    Добавить
                </button>
            </div>

            <div style={{ fontSize: '14px', color: '#888' }}>
                {playlist.tracks?.length || 0} треков
            </div>

            <AnimatePresence>
                {showAddTracks && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            backgroundColor: '#1a1a24',
                            borderRadius: '16px',
                            padding: '16px',
                            border: '1px solid #2a2a35'
                        }}
                    >
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
                            <Search size={18} color="#666" />
                            <input
                                type="text"
                                placeholder="Поиск треков для добавления..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: '#fff',
                                    outline: 'none',
                                    fontSize: '14px'
                                }}
                                autoFocus
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#666',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        {searchError && (
                            <div style={{
                                textAlign: 'center',
                                color: '#f1c40f',
                                padding: '16px',
                                fontSize: '14px',
                                backgroundColor: 'rgba(255,200,0,0.05)',
                                borderRadius: '10px'
                            }}>
                                {searchError}
                            </div>
                        )}

                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {isSearching ? (
                                <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                                    <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                                        <Music size={24} color="#9B51E0" />
                                    </div>
                                    <div style={{ marginTop: '8px', fontSize: '14px' }}>Поиск...</div>
                                    <style>{`
                                        @keyframes spin {
                                            0% { transform: rotate(0deg); }
                                            100% { transform: rotate(360deg); }
                                        }
                                    `}</style>
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((track) => {
                                    const isAdded = isTrackInPlaylist(track.id);
                                    return (
                                        <div
                                            key={track.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                padding: '8px 12px',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                                gap: '12px',
                                                opacity: isAdded ? 0.5 : 1
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <img
                                                src={track.cover}
                                                alt={track.title}
                                                style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '13px' }}>{track.title}</div>
                                                <div style={{ fontSize: '11px', color: '#888' }}>{track.artist}</div>
                                            </div>
                                            {!isAdded && (
                                                <button
                                                    onClick={() => handleAddTrack(track)}
                                                    style={{
                                                        padding: '6px 14px',
                                                        backgroundColor: '#9B51E0',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        color: '#fff',
                                                        fontSize: '12px',
                                                        cursor: 'pointer',
                                                        transition: 'all 0.3s'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                >
                                                    Добавить
                                                </button>
                                            )}
                                            {isAdded && (
                                                <span style={{ fontSize: '11px', color: '#9B51E0' }}>✅ В плейлисте</span>
                                            )}
                                        </div>
                                    );
                                })
                            ) : searchQuery && !isSearching && (
                                <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                                    Введите запрос для поиска треков
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {playlist.tracks?.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
                        <Music size={40} color="#333" style={{ marginBottom: '16px' }} />
                        <div style={{ fontSize: '16px' }}>Плейлист пуст</div>
                        <div style={{ fontSize: '14px', marginTop: '8px', color: '#555' }}>
                            Добавьте треки, нажав кнопку "Добавить" выше
                        </div>
                    </div>
                ) : (
                    playlist.tracks.map((track, index) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <motion.div
                                key={track.id + '_' + index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? 'rgba(155, 81, 224, 0.15)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: isActive ? '1px solid rgba(155, 81, 224, 0.2)' : '1px solid transparent',
                                    gap: '12px'
                                }}
                                onClick={() => playTrack(track, playlist.tracks)}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                <div style={{
                                    width: '28px',
                                    fontSize: '12px',
                                    color: '#666',
                                    textAlign: 'center',
                                    flexShrink: 0
                                }}>
                                    {index + 1}
                                </div>
                                <img
                                    src={track.cover || `https://picsum.photos/seed/${track.id}/100/100`}
                                    alt={track.title}
                                    style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    <span style={{
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        color: isActive ? '#9B51E0' : '#fff',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        fontSize: '14px'
                                    }}>
                                        {track.title}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>{track.artist}</span>
                                </div>
                                <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '6px',
                                        cursor: 'pointer',
                                        borderRadius: '50%',
                                        transition: 'background 0.2s',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike(track);
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Heart size={16} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#666'} />
                                </button>
                                <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '6px',
                                        cursor: 'pointer',
                                        borderRadius: '50%',
                                        transition: 'all 0.2s',
                                        color: '#666',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTrackFromPlaylist(id, track.id);
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
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}