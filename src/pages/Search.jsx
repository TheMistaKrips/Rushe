import React, { useState, useEffect, useRef } from 'react';
import { Play, Heart, Music, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { searchYouTubeTracks } from '../config/youtube';

export default function Search() {
    const {
        searchQuery, playTrack, currentTrack, likedTracks, toggleLike,
        addToSearchHistory, searchHistory
    } = useStore();

    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [error, setError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const searchTimeoutRef = useRef(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Pull to refresh
    useEffect(() => {
        let startY = 0;
        let isPulling = false;

        const handleTouchStart = (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        };

        const handleTouchMove = (e) => {
            if (!isPulling) return;
            const diff = e.touches[0].clientY - startY;
            if (diff > 80) {
                isPulling = false;
                handleRefresh();
            }
        };

        const handleTouchEnd = () => {
            isPulling = false;
        };

        const container = document.querySelector('.search-container');
        if (container) {
            container.addEventListener('touchstart', handleTouchStart);
            container.addEventListener('touchmove', handleTouchMove);
            container.addEventListener('touchend', handleTouchEnd);
        }

        return () => {
            if (container) {
                container.removeEventListener('touchstart', handleTouchStart);
                container.removeEventListener('touchmove', handleTouchMove);
                container.removeEventListener('touchend', handleTouchEnd);
            }
        };
    }, []);

    const handleRefresh = () => {
        if (searchQuery.trim()) {
            fetchMusic();
        }
    };

    const fetchMusic = async (query = searchQuery) => {
        if (!query.trim()) {
            setResults([]);
            setError(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const tracks = await searchYouTubeTracks(query, 40);

            if (tracks && tracks.length > 0) {
                setResults(tracks);
                setRetryCount(0);
            } else {
                setResults([]);
                setError(`По запросу "${query}" ничего не найдено на YouTube`);
            }
        } catch (err) {
            console.error("Ошибка поиска:", err);
            if (retryCount < 2) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => fetchMusic(query), 1000);
            } else {
                setError('Не удалось выполнить поиск. Проверьте подключение к интернету.');
                setResults([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            if (searchQuery.trim()) {
                fetchMusic(searchQuery);
            } else {
                setResults([]);
                setError(null);
            }
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const handleTrackClick = (track) => {
        playTrack(track, results);
        if (track.title && track.artist) {
            addToSearchHistory(`${track.title} ${track.artist}`);
        }
    };

    const trackListItemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: isActive ? 'rgba(155, 81, 224, 0.15)' : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        gap: '12px',
        border: isActive ? '1px solid rgba(155, 81, 224, 0.2)' : '1px solid transparent'
    });

    return (
        <div className="search-container" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            height: '100%',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch'
        }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, display: isMobile ? 'none' : 'block' }}>
                Результаты поиска
            </h2>

            {searchQuery.trim() && (
                <div style={{ fontSize: '14px', color: '#888' }}>
                    По запросу: <span style={{ color: '#fff', fontWeight: 'bold' }}>"{searchQuery}"</span>
                </div>
            )}

            {error && (
                <div style={{
                    backgroundColor: 'rgba(255, 200, 0, 0.1)',
                    border: '1px solid rgba(255, 200, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    color: '#f1c40f',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px'
                }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    {retryCount < 2 && (
                        <button
                            onClick={() => fetchMusic(searchQuery)}
                            style={{
                                background: 'none',
                                border: '1px solid #f1c40f',
                                borderRadius: '8px',
                                color: '#f1c40f',
                                padding: '4px 12px',
                                cursor: 'pointer',
                                fontSize: '12px'
                            }}
                        >
                            Повторить
                        </button>
                    )}
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {isLoading ? (
                    <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>
                        <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                            <Music size={40} color="#9B51E0" />
                        </div>
                        <div style={{ marginTop: '16px', fontSize: '16px' }}>Поиск на YouTube...</div>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </div>
                ) : results.length > 0 ? (
                    results.map((track, index) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <motion.div
                                key={track.id + '_' + index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={trackListItemStyle(isActive)}
                                onClick={() => handleTrackClick(track)}
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
                                <div style={{ display: 'flex', alignItems: 'center', flex: 2, gap: '15px', overflow: 'hidden' }}>
                                    <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                                        <img
                                            src={track.cover}
                                            alt={track.title}
                                            style={{ width: '100%', height: '100%', borderRadius: '10px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = `https://picsum.photos/seed/${track.id}/100/100`;
                                            }}
                                        />
                                        {isActive && (
                                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>
                                                <Play size={20} fill="#9B51E0" color="#9B51E0" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
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
                                        <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {track.artist}
                                        </span>
                                    </div>
                                </div>

                                {!isMobile && <span style={{ width: '60px', color: '#666', fontSize: '13px', textAlign: 'right', paddingRight: '16px' }}>{track.time}</span>}

                                <button
                                    style={{
                                        width: '36px',
                                        height: '36px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderRadius: '50%',
                                        transition: 'background 0.2s'
                                    }}
                                    onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Heart size={18} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#666'} />
                                </button>
                            </motion.div>
                        );
                    })
                ) : (
                    !isLoading && (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
                            <Music size={48} color="#333" style={{ marginBottom: '16px' }} />
                            <div style={{ fontSize: '18px' }}>Ничего не найдено</div>
                            <div style={{ fontSize: '14px', marginTop: '8px', color: '#555' }}>Попробуйте другой запрос</div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}