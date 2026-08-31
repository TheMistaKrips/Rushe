import React, { useState, useEffect } from 'react';
import { Play, Heart, AlertCircle, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

// Список резервных API-узлов для надежности
const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.tokhmi.xyz',
    'https://pipedapi.moomoo.me'
];

export default function Search() {
    const { searchQuery, playTrack, currentTrack, likedTracks, toggleLike } = useStore();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isMobile] = useState(window.innerWidth < 768);

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchMusic = async () => {
            if (!searchQuery.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            let dataFetched = false;

            // Перебираем зеркала API, пока запрос не пройдет успешно
            for (const instance of PIPED_INSTANCES) {
                try {
                    const response = await fetch(`${instance}/search?q=${encodeURIComponent(searchQuery)}&filter=music_songs`);
                    if (!response.ok) continue;

                    const data = await response.json();
                    if (!data.items) continue;

                    const formattedResults = data.items
                        .filter(item => item.type === 'stream')
                        .map(item => ({
                            id: item.url.replace('/watch?v=', ''),
                            title: item.title,
                            artist: item.uploaderName || 'Неизвестный исполнитель',
                            time: formatTime(item.duration),
                            cover: item.thumbnail,
                            videoId: item.url.replace('/watch?v=', ''),
                            audioUrl: `https://rr1---sn-5goelz7z.googlevideo.com/videoplayback?expire=${Date.now() + 3600000}` // Прямой поток или fallback плеере
                        }));

                    setResults(formattedResults);
                    dataFetched = true;
                    break; // Успешно нашли данные, прекращаем перебор зеркал
                } catch (err) {
                    console.warn(`Узел ${instance} недоступен, пробуем следующий...`);
                }
            }

            if (!dataFetched) {
                setError('Не удалось загрузить треки. Все сервера поиска временно перегружены.');
            }

            setIsLoading(false);
        };

        const timeoutId = setTimeout(() => {
            fetchMusic();
        }, 600);

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

    const SkeletonLoader = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div key={i} animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} style={{ display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: '#1a1a24', gap: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '8px', backgroundColor: '#2a2a35' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ width: '50%', height: '14px', borderRadius: '4px', backgroundColor: '#2a2a35' }} />
                        <div style={{ width: '30%', height: '10px', borderRadius: '4px', backgroundColor: '#2a2a35' }} />
                    </div>
                </motion.div>
            ))}
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', height: '100%', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, display: isMobile ? 'none' : 'block' }}>Результаты поиска</h2>

            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FF2A54', padding: '15px', backgroundColor: 'rgba(255, 42, 84, 0.1)', borderRadius: '12px' }}>
                    <AlertCircle size={20} /><span>{error}</span>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {isLoading ? (
                    <SkeletonLoader />
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