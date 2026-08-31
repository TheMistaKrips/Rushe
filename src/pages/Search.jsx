import React, { useState, useEffect } from 'react';
import { Play, Heart, Music, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import axios from 'axios';

const RECCOBEATS_API = 'https://api.reccobeats.com/v1';

// Рабочие Invidious инстансы
const INVIDIOUS_INSTANCES = [
    'https://inv.odyssey346.dev',
    'https://inv.bp.kiwi',
    'https://inv.nadeko.net',
    'https://inv.in.projectsegfau.lt',
    'https://inv.nerdvpn.de',
    'https://invidious.nerdvpn.de',
    'https://invidious.sethforprivacy.com',
    'https://y.com.sb',
    'https://invidious.fdn.fr',
    'https://inv.riverside.rocks',
];

async function searchReccoBeats(query) {
    try {
        const response = await axios.get(`${RECCOBEATS_API}/track/search`, {
            params: {
                searchText: query,
                size: 40,
                page: 0
            },
            timeout: 10000
        });

        if (response.data && response.data.content && response.data.content.length > 0) {
            return response.data.content.map(item => ({
                id: item.id,
                title: item.trackTitle || item.name || 'Unknown',
                artist: item.artists && item.artists.length > 0 ? item.artists[0].name : 'Unknown Artist',
                time: formatDuration(item.durationMs ? Math.floor(item.durationMs / 1000) : 0),
                cover: item.album?.cover || `https://picsum.photos/seed/${item.id}/100/100`,
                audioUrl: null,
                duration: item.durationMs ? Math.floor(item.durationMs / 1000) : 0,
                isrc: item.isrc || null
            }));
        }
        return [];
    } catch (err) {
        console.error('ReccoBeats search error:', err);
        return [];
    }
}

async function searchYouTubeInvidious(query) {
    for (const instance of INVIDIOUS_INSTANCES) {
        try {
            const response = await axios.get(`${instance}/api/v1/search`, {
                params: {
                    q: query,
                    type: 'video',
                    sort: 'relevance',
                    limit: 30
                },
                timeout: 8000
            });

            if (response.data && response.data.length > 0) {
                return response.data.map(item => ({
                    id: item.videoId,
                    title: item.title || 'Unknown',
                    artist: item.author || 'Unknown Artist',
                    time: formatDuration(item.lengthSeconds || 0),
                    cover: `https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`,
                    audioUrl: null,
                    duration: item.lengthSeconds || 0,
                    videoId: item.videoId,
                    youtubeUrl: `https://www.youtube.com/watch?v=${item.videoId}`
                }));
            }
        } catch (err) {
            continue;
        }
    }
    return [];
}

const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
};

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
                let tracks = [];

                // Сначала пробуем ReccoBeats
                tracks = await searchReccoBeats(searchQuery);

                // Если ничего не найдено, пробуем YouTube
                if (!tracks || tracks.length === 0) {
                    tracks = await searchYouTubeInvidious(searchQuery);
                }

                if (tracks && tracks.length > 0) {
                    setResults(tracks);
                } else {
                    setResults([]);
                    setError(`По запросу "${searchQuery}" ничего не найдено`);
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
                Результаты поиска
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
                        <div style={{ marginTop: '12px' }}>Поиск музыки...</div>
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