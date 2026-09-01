import React, { useState, useEffect } from 'react';
import { Play, Heart, Pause, RefreshCw, TrendingUp, ListMusic, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { searchYouTubeTracks, PLAYLISTS } from '../config/youtube';
import { Lottie } from "lottie-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 }
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lottieData, setLottieData] = useState(null);

    // Загрузка Lottie анимации
    useEffect(() => {
        fetch('/animation.json')
            .then(res => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then(data => {
                console.log('Lottie animation loaded!');
                setLottieData(data);
            })
            .catch((err) => {
                console.log('Lottie animation not found:', err.message);
            });
    }, []);

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
                let tracks = [];
                if (searchQuery.trim()) {
                    tracks = await searchYouTubeTracks(searchQuery, 20);
                } else {
                    tracks = await searchYouTubeTracks('best songs 2024', 20);
                }
                setRecommendedTracks(tracks.length > 0 ? tracks : []);
            } catch (err) {
                console.error("Ошибка загрузки треков:", err);
                setRecommendedTracks([]);
                setError('Не удалось загрузить треки.');
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
        if (!track) return;
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
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                paddingBottom: '20px',
                width: '100%'
            }}
        >
            {/* МОЯ ВОЛНА */}
            <motion.div
                variants={itemVariants}
                onClick={handleMyWavePlay}
                style={{
                    width: '100%',
                    height: isMobile ? '180px' : '240px',
                    borderRadius: '28px',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 20px 60px rgba(120, 41, 220, 0.3)',
                }}
            >
                {/* Анимированный градиентный фон */}
                <motion.div
                    animate={{
                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'linear'
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #7829DC, #B846EC, #7CD7F2)',
                        backgroundSize: '300% 300%',
                    }}
                />

                {/* Световые эффекты */}
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '60%',
                    height: '80%',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-10%',
                    width: '50%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(124, 215, 242, 0.2) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                {/* Lottie анимация */}
                {!isMobile && lottieData && (
                    <div style={{
                        position: 'absolute',
                        bottom: '-10px',
                        right: '-10px',
                        width: '180px',
                        height: '180px',
                        pointerEvents: 'none',
                        zIndex: 1,
                        opacity: 0.9
                    }}>
                        <Lottie
                            animationData={lottieData}
                            loop={true}
                            autoplay={true}
                            style={{
                                width: '100%',
                                height: '100%'
                            }}
                        />
                    </div>
                )}

                {/* Контент */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    padding: '20px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {isPlaying ? (
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            >
                                <Pause size={isMobile ? 28 : 40} fill="#fff" color="#fff" />
                            </motion.div>
                        ) : (
                            <div style={{
                                width: isMobile ? 44 : 56,
                                height: isMobile ? 44 : 56,
                                borderRadius: '50%',
                                backgroundColor: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                            }}>
                                <Play size={isMobile ? 22 : 28} fill="#fff" color="#fff" />
                            </div>
                        )}
                        <h1 style={{
                            fontSize: isMobile ? '24px' : '36px',
                            margin: 0,
                            fontWeight: '900',
                            letterSpacing: '-1px',
                            color: '#fff',
                            textShadow: '0 4px 30px rgba(0,0,0,0.3)'
                        }}>
                            Моя волна
                        </h1>
                    </div>

                    {currentTrack && isPlaying && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '10px',
                                padding: '6px 18px',
                                backgroundColor: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '30px',
                                fontSize: isMobile ? '12px' : '14px',
                                maxWidth: '70%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: '#fff',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                            }}
                        >
                            ▶ {currentTrack.title} — {currentTrack.artist}
                        </motion.div>
                    )}

                    {!isPlaying && likedTracks.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '10px',
                                padding: '6px 16px',
                                backgroundColor: 'rgba(255,255,255,0.1)',
                                backdropFilter: 'blur(20px)',
                                borderRadius: '20px',
                                fontSize: isMobile ? '11px' : '13px',
                                color: 'rgba(255,255,255,0.8)',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            ❤️ {likedTracks.length} треков в лайках
                        </motion.div>
                    )}

                    <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '20px',
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.4)',
                        zIndex: 2,
                        letterSpacing: '0.5px',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        backdropFilter: 'blur(10px)'
                    }}>
                        {likedTracks.length > 0 ? 'Из ваших лайков' : 'Рекомендуемые треки'}
                    </div>
                </div>
            </motion.div>

            {/* ЧАРТЫ */}
            <motion.div variants={itemVariants}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginBottom: '16px'
                }}>
                    <TrendingUp size={22} color="#9B51E0" />
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Чарты</h2>
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
                    gap: '12px'
                }}>
                    {[
                        { id: '1', title: 'Топ 100 Мира' },
                        { id: '2', title: 'Поп-хиты' },
                        { id: '3', title: 'Танцевальные' },
                        { id: '4', title: 'Рок легенды' },
                        { id: '5', title: 'Инструментал' },
                    ].map((chart) => (
                        <motion.div
                            key={chart.id}
                            whileHover={{ scale: 1.04, y: -4 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            style={{
                                padding: '18px 12px',
                                background: 'linear-gradient(135deg, rgba(120, 41, 220, 0.2), rgba(184, 70, 236, 0.1))',
                                borderRadius: '16px',
                                border: '1px solid rgba(120, 41, 220, 0.15)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#9B51E0';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(120, 41, 220, 0.3), rgba(184, 70, 236, 0.2))';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(120, 41, 220, 0.15)';
                                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(120, 41, 220, 0.2), rgba(184, 70, 236, 0.1))';
                            }}
                            onClick={() => {
                                setSearchQuery(chart.title);
                            }}
                        >
                            <div style={{
                                fontSize: '14px',
                                fontWeight: 'bold',
                                color: '#fff'
                            }}>
                                {chart.title}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ПЛЕЙЛИСТЫ */}
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
                            whileHover={{ scale: 1.04, y: -4 }}
                            transition={{ type: 'spring', stiffness: 400 }}
                            style={{
                                borderRadius: '16px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative',
                                aspectRatio: '1/1',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                            }}
                            onMouseEnter={(e) => {
                                const overlay = e.currentTarget.querySelector('.playlist-overlay');
                                if (overlay) overlay.style.opacity = 1;
                            }}
                            onMouseLeave={(e) => {
                                const overlay = e.currentTarget.querySelector('.playlist-overlay');
                                if (overlay) overlay.style.opacity = 0;
                            }}
                            onClick={() => {
                                setSearchQuery(playlist.title);
                            }}
                        >
                            <img
                                src={playlist.cover}
                                alt={playlist.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                onError={(e) => {
                                    e.target.src = `https://picsum.photos/seed/${playlist.id}/300/300`;
                                }}
                            />
                            <div className="playlist-overlay" style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '16px',
                                opacity: 0,
                                transition: 'opacity 0.3s'
                            }}>
                                <div style={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    color: '#fff',
                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                }}>
                                    {playlist.title}
                                </div>
                                <div style={{
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.6)'
                                }}>
                                    {playlist.tracks} треков
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ТРЕКИ */}
            <motion.div variants={itemVariants}>
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

                {recommendedTracks.length === 0 && !isLoading && !error && (
                    <div style={{
                        textAlign: 'center',
                        color: '#888',
                        padding: '40px 0'
                    }}>
                        <div style={{ fontSize: '16px' }}>Нет доступных треков</div>
                        <div style={{ fontSize: '14px', marginTop: '8px', color: '#555' }}>
                            Попробуйте изменить запрос
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {recommendedTracks.map((track, index) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <motion.div
                                key={track.id || index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.04 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 14px',
                                    borderRadius: '14px',
                                    backgroundColor: isActive ? 'rgba(155, 81, 224, 0.15)' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    border: isActive ? '1px solid rgba(155, 81, 224, 0.2)' : '1px solid transparent',
                                    gap: '12px'
                                }}
                                onClick={() => handleTrackClick(track)}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }
                                }}
                            >
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <img
                                        src={track.cover || `https://picsum.photos/seed/${track.id || index}/100/100`}
                                        alt={track.title || 'Track'}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '10px',
                                            objectFit: 'cover'
                                        }}
                                        onError={(e) => {
                                            e.target.src = `https://picsum.photos/seed/${track.id || index}/100/100`;
                                        }}
                                    />
                                    {isActive && (
                                        <div style={{
                                            position: 'absolute',
                                            inset: 0,
                                            borderRadius: '10px',
                                            backgroundColor: 'rgba(155, 81, 224, 0.3)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                width: '20px',
                                                height: '20px',
                                                borderRadius: '50%',
                                                backgroundColor: '#9B51E0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <Play size={10} fill="#fff" color="#fff" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                    <span style={{
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        color: isActive ? '#9B51E0' : '#fff',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        fontSize: '14px'
                                    }}>
                                        {track.title || 'Unknown Track'}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#888' }}>
                                        {track.artist || 'Unknown Artist'}
                                    </span>
                                </div>

                                {!isMobile && (
                                    <span style={{ fontSize: '13px', color: '#666', marginRight: '8px' }}>
                                        {track.time || '0:00'}
                                    </span>
                                )}

                                <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: '6px',
                                        cursor: 'pointer',
                                        borderRadius: '50%',
                                        transition: 'all 0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '32px',
                                        height: '32px'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike(track);
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Heart
                                        size={18}
                                        fill={isLiked ? '#FF2A54' : 'none'}
                                        color={isLiked ? '#FF2A54' : '#666'}
                                    />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}