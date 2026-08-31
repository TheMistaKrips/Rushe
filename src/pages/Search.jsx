import React, { useState, useEffect } from 'react';
import { Play, Heart, Music, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { searchYouTubeTracks } from '../config/youtube';

export default function Search() {
    const { searchQuery, playTrack, currentTrack, likedTracks, toggleLike } = useStore();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchMusic = async () => {
            if (!searchQuery.trim()) {
                setResults([]);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const tracks = await searchYouTubeTracks(searchQuery, 40);

                if (tracks && tracks.length > 0) {
                    setResults(tracks);
                } else {
                    setResults([]);
                    setError(`По запросу "${searchQuery}" ничего не найдено на YouTube`);
                }
            } catch (err) {
                console.error("Ошибка поиска:", err);
                setError('Не удалось выполнить поиск. Проверьте подключение к интернету.');
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchMusic();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const trackListItemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: isActive ? '#1a1a24' : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        gap: '12px'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', height: '100%', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, display: isMobile ? 'none' : 'block' }}>
                Результаты поиска на YouTube
            </h2>

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
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {isLoading ? (
                    <div style={{ color: '#888', textAlign: 'center', marginTop: '30px' }}>
                        <div style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                            <Music size={32} color="#9B51E0" />
                        </div>
                        <div style={{ marginTop: '12px' }}>Поиск на YouTube...</div>
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
                                onClick={() => playTrack(track, results)}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', flex: 2, gap: '15px', overflow: 'hidden' }}>
                                    <div style={{ position: 'relative', width: '45px', height: '45px', flexShrink: 0 }}>
                                        <img
                                            src={track.cover}
                                            alt={track.title}
                                            style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = `https://picsum.photos/seed/${track.id}/100/100`;
                                            }}
                                        />
                                        {isActive && (
                                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                                <Play size={16} fill="#9B51E0" color="#9B51E0" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{
                                            fontWeight: isActive ? 'bold' : 'normal',
                                            color: isActive ? '#9B51E0' : '#fff',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden'
                                        }}>
                                            {track.title}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {track.artist}
                                        </span>
                                    </div>
                                </div>

                                {!isMobile && <span style={{ width: '60px', color: '#888', fontSize: '14px', textAlign: 'right', paddingRight: '20px' }}>{track.time}</span>}

                                <button
                                    style={{ width: '40px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                                    onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
                                >
                                    <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                                </button>
                            </motion.div>
                        );
                    })
                ) : (
                    searchQuery && !isLoading && (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
                            <Music size={48} color="#333" style={{ marginBottom: '16px' }} />
                            <div>Ничего не найдено по запросу "{searchQuery}"</div>
                            <div style={{ fontSize: '14px', marginTop: '8px', color: '#555' }}>Попробуйте другой запрос</div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}