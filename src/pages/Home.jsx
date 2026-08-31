import React, { useState, useEffect } from 'react';
import { Play, Heart, Pause, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const JAMENDO_CLIENT_ID = '9970bd20';

export default function Home() {
    const { playTrack, currentTrack, isPlaying, setIsPlaying, likedTracks, toggleLike, searchQuery } = useStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [recommendedTracks, setRecommendedTracks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Загрузка реальных треков с Jamendo
    useEffect(() => {
        const fetchTracks = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&order=popularity_total&include=musicinfo`;

                // Если есть поисковый запрос, фильтруем
                if (searchQuery.trim()) {
                    url = `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(searchQuery)}&include=musicinfo`;
                }

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`Ошибка API: ${response.status}`);
                }

                const data = await response.json();

                if (data && data.results && data.results.length > 0) {
                    const formattedTracks = data.results.map(item => ({
                        id: item.id.toString(),
                        title: item.name,
                        artist: item.artist_name,
                        time: formatTime(item.duration),
                        cover: item.image || item.album_image || 'https://picsum.photos/seed/' + item.id + '/100/100',
                        audioUrl: item.audio || `https://api.jamendo.com/v3.0/tracks/file/?client_id=${JAMENDO_CLIENT_ID}&track_id=${item.id}`,
                        duration: item.duration
                    }));
                    setRecommendedTracks(formattedTracks);
                } else {
                    setRecommendedTracks([]);
                    if (searchQuery.trim()) {
                        setError('По вашему запросу ничего не найдено');
                    }
                }
            } catch (err) {
                console.error("Ошибка загрузки треков:", err);
                setError('Не удалось загрузить треки. Проверьте подключение к интернету.');
                setRecommendedTracks([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchTracks, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const handleMyWavePlay = () => {
        if (currentTrack && isPlaying) {
            setIsPlaying(false);
            return;
        }

        // Используем треки из лайков или рекомендуемые
        const waveQueue = likedTracks.length > 0 ? likedTracks : recommendedTracks;
        if (waveQueue.length > 0) {
            const randomTrack = waveQueue[Math.floor(Math.random() * waveQueue.length)];
            if (randomTrack) {
                playTrack(randomTrack, waveQueue);
            }
        }
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#888'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                        <RefreshCw size={32} color="#9B51E0" />
                    </div>
                    <div style={{ marginTop: '12px' }}>Загрузка музыки...</div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '100%', width: '100%' }}>
            {/* МОЯ ВОЛНА */}
            <motion.div
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
                    height: isMobile ? '180px' : '250px',
                    borderRadius: '24px',
                    background: 'linear-gradient(270deg, #00f2fe, #4facfe, #8E2DE2, #4A00E0)',
                    backgroundSize: '300% 300%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 10px 40px rgba(79, 172, 254, 0.4)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1), transparent)',
                    pointerEvents: 'none'
                }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1 }}>
                    {isPlaying ?
                        <Pause size={isMobile ? 32 : 48} fill="#fff" color="#fff" /> :
                        <Play size={isMobile ? 32 : 48} fill="#fff" color="#fff" />
                    }
                    <h1 style={{ fontSize: isMobile ? '28px' : '48px', margin: 0, fontWeight: '900', letterSpacing: '-1px' }}>
                        Моя волна
                    </h1>
                </div>
                <div style={{ zIndex: 1, marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {currentTrack && isPlaying && (
                        <div style={{
                            padding: '6px 16px',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            fontSize: isMobile ? '12px' : '14px',
                            maxWidth: '80%',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            ▶ {currentTrack.title} — {currentTrack.artist}
                        </div>
                    )}
                    {!isPlaying && likedTracks.length > 0 && (
                        <div style={{
                            padding: '6px 16px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            fontSize: isMobile ? '12px' : '14px',
                            color: 'rgba(255,255,255,0.8)'
                        }}>
                            ❤️ {likedTracks.length} треков в лайках
                        </div>
                    )}
                    {!isPlaying && likedTracks.length === 0 && recommendedTracks.length > 0 && (
                        <div style={{
                            padding: '6px 16px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '20px',
                            fontSize: isMobile ? '12px' : '14px',
                            color: 'rgba(255,255,255,0.8)'
                        }}>
                            🎵 {recommendedTracks.length} треков доступно
                        </div>
                    )}
                </div>
                <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '20px',
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.4)',
                    zIndex: 1
                }}>
                    {likedTracks.length > 0 ? '🎵 Из ваших лайков' : '🎶 Рекомендуемые треки'}
                </div>
            </motion.div>

            {/* РЕКОМЕНДАЦИИ / РЕЗУЛЬТАТЫ ПОИСКА */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                        {searchQuery.trim() ? `Результаты "${searchQuery}"` : 'Популярные треки'}
                    </div>
                    {searchQuery.trim() && (
                        <span style={{ fontSize: '13px', color: '#888' }}>
                            {recommendedTracks.length} треков
                        </span>
                    )}
                </div>

                {error && (
                    <div style={{
                        backgroundColor: 'rgba(255, 42, 84, 0.1)',
                        border: '1px solid rgba(255, 42, 84, 0.3)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        color: '#FF2A54',
                        marginBottom: '16px'
                    }}>
                        {error}
                    </div>
                )}

                {recommendedTracks.length === 0 && !error && !isLoading && (
                    <div style={{
                        textAlign: 'center',
                        color: '#888',
                        padding: '40px 0'
                    }}>
                        <Music size={48} color="#333" style={{ marginBottom: '16px' }} />
                        <div>Нет доступных треков</div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {recommendedTracks.map((track) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <div
                                key={track.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '10px 12px',
                                    borderRadius: '12px',
                                    backgroundColor: isActive ? '#1a1a24' : 'transparent',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s'
                                }}
                                onClick={() => playTrack(track, recommendedTracks)}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = '#12121a';
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
                                        width: '45px',
                                        height: '45px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        flexShrink: 0
                                    }}
                                    onError={(e) => {
                                        e.target.src = 'https://picsum.photos/seed/' + track.id + '/100/100';
                                    }}
                                />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '15px', overflow: 'hidden' }}>
                                    <span style={{
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        color: isActive ? '#9B51E0' : '#fff',
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden'
                                    }}>
                                        {track.title}
                                    </span>
                                    <span style={{ fontSize: '13px', color: '#888' }}>{track.artist}</span>
                                </div>

                                <button
                                    style={{ background: 'none', border: 'none', padding: '10px', cursor: 'pointer' }}
                                    onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
                                >
                                    <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}