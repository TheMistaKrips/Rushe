import React, { useState, useEffect } from 'react';
import { Play, Heart, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const PIPED_INSTANCES = [
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.tokhmi.xyz',
    'https://pipedapi.moomoo.me'
];

// Резервная база треков, которая активируется при сбое внешних API
const LOCAL_FALLBACK_DATABASE = [
    { id: '1', title: 'Midnight City', artist: 'M83', time: '4:03', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80', videoId: 'dX3k_LSd3YY', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: '2', title: 'Starboy', artist: 'The Weeknd', time: '3:50', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=100&q=80', videoId: '34Na4j8HLjc', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: '3', title: 'Blinding Lights', artist: 'The Weeknd', time: '3:20', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80', videoId: '4NRXx6U8ABQ', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: '4', title: 'Numb', artist: 'Linkin Park', time: '3:05', cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80', videoId: 'kXYiU_JCYtU', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { id: '5', title: 'Believer', artist: 'Imagine Dragons', time: '3:24', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=100&q=80', videoId: '7wtfhZwyrcc', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }
];

export default function Search() {
    const { searchQuery, playTrack, currentTrack, likedTracks, toggleLike } = useStore();
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
            let dataFetched = false;

            // Пробуем внешние Piped API
            for (const instance of PIPED_INSTANCES) {
                try {
                    const response = await fetch(`${instance}/search?q=${encodeURIComponent(searchQuery)}&filter=music_songs`, { signal: AbortSignal.timeout(3000) });
                    if (!response.ok) continue;

                    const data = await response.json();
                    if (!data.items) continue;

                    const formattedResults = data.items
                        .filter(item => item.type === 'stream')
                        .map(item => ({
                            id: item.url.replace('/watch?v=', ''),
                            title: item.title,
                            artist: item.uploaderName || 'Исполнитель',
                            time: formatTime(item.duration),
                            cover: item.thumbnail,
                            videoId: item.url.replace('/watch?v=', ''),
                            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
                        }));

                    if (formattedResults.length > 0) {
                        setResults(formattedResults);
                        dataFetched = true;
                        break;
                    }
                } catch (err) {
                    console.warn(`Узел ${instance} недоступен, переключаемся на локальную базу...`);
                }
            }

            // Если внешние API упали — ищем по локальной резервной базе
            if (!dataFetched) {
                const query = searchQuery.toLowerCase();
                const filtered = LOCAL_FALLBACK_DATABASE.filter(
                    track => track.title.toLowerCase().includes(query) || track.artist.toLowerCase().includes(query)
                );
                // Если по запросу ничего нет в локальной базе, показываем всю базу для удобства
                setResults(filtered.length > 0 ? filtered : LOCAL_FALLBACK_DATABASE);
            }

            setIsLoading(false);
        };

        const timeoutId = setTimeout(() => {
            fetchMusic();
        }, 400);

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
                    <div style={{ color: '#888', textAlign: 'center', marginTop: '30px' }}>Ищем треки...</div>
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
                        <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>Ничего не найдено</div>
                    )
                )}
            </div>
        </div>
    );
}