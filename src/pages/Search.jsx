import React, { useState, useEffect } from 'react';
import { Play, Heart, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function Search() {
    const { searchQuery, playTrack, currentTrack, likedTracks, toggleLike } = useStore();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobile] = useState(window.innerWidth < 768);

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchMusic = async () => {
            if (!searchQuery.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);

            try {
                // Используем публичное API Jamendo для поиска реальных треков с прямой аудиоссылкой
                const clientId = '9970bd20'; // Публичный тестовый client_id Jamendo
                const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=${clientId}&format=json&limit=20&search=${encodeURIComponent(searchQuery)}`);

                if (!response.ok) throw new Error('Ошибка сети');

                const data = await response.json();

                if (data && data.results) {
                    const formattedResults = data.results.map(item => ({
                        id: item.id,
                        title: item.name,
                        artist: item.artist_name,
                        time: formatTime(item.duration),
                        cover: item.image || item.album_image,
                        videoId: item.id, // ID для плеера
                        audioUrl: item.audio // Настоящая рабочая прямая ссылка на MP3-поток
                    }));
                    setResults(formattedResults);
                }
            } catch (err) {
                console.error("Ошибка поиска:", err);
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
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', height: '100%', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, display: isMobile ? 'none' : 'block' }}>Результаты поиска</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {isLoading ? (
                    <div style={{ color: '#888', textAlign: 'center', marginTop: '30px' }}>Ищем музыку...</div>
                ) : results.length > 0 ? (
                    results.map((track) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <motion.div key={track.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={trackListItemStyle(isActive)} onClick={() => playTrack(track, results)}>
                                <div style={{ display: 'flex', alignItems: 'center', flex: 2, gap: '15px', overflow: 'hidden' }}>
                                    <div style={{ position: 'relative', width: '45px', height: '45px', flexShrink: 0 }}>
                                        <img src={track.cover} alt={track.title} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80' }} />
                                        {isActive && (
                                            <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                                <Play size={16} fill="#9B51E0" color="#9B51E0" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#9B51E0' : '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{track.title}</span>
                                        <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{track.artist}</span>
                                    </div>
                                </div>

                                {!isMobile && <span style={{ width: '60px', color: '#888', fontSize: '14px', textAlign: 'right', paddingRight: '20px' }}>{track.time}</span>}

                                <button style={{ width: '40px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }} onClick={(e) => { e.stopPropagation(); toggleLike(track); }}>
                                    <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                                </button>
                            </motion.div>
                        );
                    })
                ) : (
                    searchQuery && !isLoading && (
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>Ничего не найдено по запросу "{searchQuery}"</div>
                    )
                )}
            </div>
        </div>
    );
}