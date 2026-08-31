import React, { useState, useEffect } from 'react';
import { Play, Heart, Pause, RefreshCw, TrendingUp, ListMusic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { searchYouTubeTracks, DEMO_TRACKS, CHARTS, PLAYLISTS } from '../config/youtube';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function Home() {
    const {
        playTrack, currentTrack, isPlaying, setIsPlaying,
        likedTracks, toggleLike, searchQuery, setSearchQuery,
        addToSearchHistory
    } = useStore();

    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [recommendedTracks, setRecommendedTracks] = useState([]);
    const [popularTracks, setPopularTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchTracks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const popular = await searchYouTubeTracks('popular music 2024 top hits', 20);
                setPopularTracks(popular.length > 0 ? popular : DEMO_TRACKS);

                if (searchQuery.trim()) {
                    const results = await searchYouTubeTracks(searchQuery, 20);
                    setRecommendedTracks(results.length > 0 ? results : DEMO_TRACKS);
                } else {
                    const defaultTracks = await searchYouTubeTracks('best songs 2024', 10);
                    setRecommendedTracks(defaultTracks.length > 0 ? defaultTracks : DEMO_TRACKS);
                }
            } catch (err) {
                console.error("Ошибка загрузки треков:", err);
                setPopularTracks(DEMO_TRACKS);
                setRecommendedTracks(DEMO_TRACKS);
                setError('Не удалось загрузить треки. Показываем демо-треки.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTracks();
    }, [searchQuery]);

    const handleMyWavePlay = () => {
        if (currentTrack && isPlaying) {
            setIsPlaying(false);
            return;
        }

        const waveQueue = likedTracks.length > 0 ? likedTracks : recommendedTracks;
        if (waveQueue.length > 0) {
            const randomTrack = waveQueue[Math.floor(Math.random() * waveQueue.length)];
            if (randomTrack) {
                playTrack(randomTrack, waveQueue);
                if (randomTrack.title && randomTrack.artist) {
                    addToSearchHistory(`${randomTrack.title} ${randomTrack.artist}`);
                }
            }
        }
    };

    const handleTrackClick = (track) => {
        playTrack(track, recommendedTracks);
        if (track.title && track.artist) {
            addToSearchHistory(`${track.title} ${track.artist}`);
        }
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '80vh',
                color: '#888'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                        <RefreshCw size={40} color="#9B51E0" />
                    </div>
                    <div style={{ marginTop: '16px', fontSize: '16px' }}>Загрузка музыки...</div>
                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '20px' }}
        >
            <motion.div
                variants={itemVariants}
                onClick={handleMyWavePlay}
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    scale: isPlaying ? [1, 1.02, 1] : 1
                }}
                transition={{
                    backgroundPosition: { duration: 15, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
                }}
                style={{
                    width: '100%',
                    height: isMobile ? '140px' : '200px',
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                    backgroundSize: '300% 300%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 20px 60px rgba(102, 126, 234, 0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15), transparent)',
                    pointerEvents: 'none'
                }} />

                {isPlaying && (
                    <>
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                width: '300%',
                                height: '300%',
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.1)',
                                pointerEvents: 'none'
                            }}
                        />
                        <motion.div
                            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            style={{
                                position: 'absolute',
                                width: '200%',
                                height: '200%',
                                borderRadius: '50%',
                                border: '1px solid rgba(255,255,255,0.08)',
                                pointerEvents: 'none'
                            }}
                        />
                    </>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', zIndex: 1 }}>
                    {isPlaying ?
                        <Pause size={isMobile ? 32 : 44} fill="#fff" color="#fff" /> :
                        <Play size={isMobile ? 32 : 44} fill="#fff" color="#fff" />
                    }
                    <h1 style={{ fontSize: isMobile ? '24px' : '40px', margin: 0, fontWeight: '900', letterSpacing: '-1px' }}>
                        Моя волна
                    </h1>
                </div>
                <div style={{ zIndex: 1, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {currentTrack && isPlaying && (
                        <div style={{
                            padding: '4px 14px',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            fontSize: isMobile ? '11px' : '13px',
                            maxWidth: '80%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            ▶ {currentTrack.title}
                        </div>
                    )}
                    {!isPlaying && likedTracks.length > 0 && (
                        <div style={{
                            padding: '4px 14px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            fontSize: isMobile ? '11px' : '13px',
                            color: 'rgba(255,255,255,0.8)'
                        }}>
                            ❤️ {likedTracks.length} треков в лайках
                        </div>
                    )}
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '16px',
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.4)',
                    zIndex: 1
                }}>
                    {likedTracks.length > 0 ? '🎵 Из ваших лайков' : '🎶 Рекомендуемые треки'}
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <TrendingUp size={22} color="#9B51E0" />
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Чарты</h2>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                    gap: '12px'
                }}>
                    {CHARTS.map((chart) => (
                        <motion.div
                            key={chart.id}
                            whileHover={{ scale: 1.03, y: -4 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            style={{
                                padding: '16px',
                                backgroundColor: 'rgba(26, 26, 36, 0.6)',
                                borderRadius: '16px',
                                border: '1px solid #1f1f2e',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9B51E0'}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1f1f2e'}
                            onClick={() => {
                                setSearchQuery(chart.title.replace(/[^\w\s]/g, '').trim());
                            }}
                        >
                            <div style={{ fontSize: '28px', marginBottom: '4px' }}>{chart.icon}</div>
                            <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{chart.title}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <ListMusic size={22} color="#9B51E0" />
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Плейлисты</h2>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                    gap: '12px'
                }}>
                    {PLAYLISTS.map((playlist) => (
                        <motion.div
                            key={playlist.id}
                            whileHover={{ scale: 1.03, y: -4 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative',
                                aspectRatio: '1/1'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.querySelector('.playlist-overlay').style.opacity = 1;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.querySelector('.playlist-overlay').style.opacity = 0;
                            }}
                            onClick={() => {
                                setSearchQuery(playlist.title);
                            }}
                        >
                            <img
                                src={playlist.cover}
                                alt={playlist.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div className="playlist-overlay" style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, transparent 60%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '16px',
                                opacity: 0,
                                transition: 'opacity 0.3s'
                            }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{playlist.title}</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>{playlist.tracks} треков</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={itemVariants}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                        {searchQuery.trim() ? `Результаты "${searchQuery}"` : 'Рекомендуем'}
                    </h2>
                    {searchQuery.trim() && (
                        <span style={{ fontSize: '13px', color: '#888' }}>
                            {recommendedTracks.length} треков
                        </span>
                    )}
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 200, 0, 0.1)',
                        border: '1px solid rgba(255, 200, 0, 0.3)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: '#f1c40f',
                        marginBottom: '16px',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {recommendedTracks.map((track, index) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <motion.div
                                key={track.id}
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
                                    border: isActive ? '1px solid rgba(155, 81, 224, 0.2)' : '1px solid transparent'
                                }}
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
                                <img
                                    src={track.cover}
                                    alt={track.title}
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '10px',
                                        objectFit: 'cover',
                                        flexShrink: 0
                                    }}
                                    onError={(e) => {
                                        e.target.src = `https://picsum.photos/seed/${track.id}/100/100`;
                                    }}
                                />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '14px', overflow: 'hidden' }}>
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

                                {!isMobile && <span style={{ fontSize: '13px', color: '#666', marginRight: '12px' }}>{track.time}</span>}

                                <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '8px',
                                        cursor: 'pointer',
                                        borderRadius: '50%',
                                        transition: 'background 0.2s'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike(track);
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Heart size={18} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#666'} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}