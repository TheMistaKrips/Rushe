import React, { useState } from 'react';
import { Search as SearchIcon, Play, Heart, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const { playTrack, currentTrack, likedTracks, toggleLike } = useStore();
    const [isMobile] = useState(window.innerWidth < 768);

    // Функция поиска через публичный Invidious API (YouTube без ограничений)
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults([]);

        try {
            // Используем публичный инстанс Invidious (можно заменить на другой, если этот недоступен)
            const response = await fetch(`https://vid.puffyan.us/api/v1/search?q=${encodeURIComponent(query + ' audio')}&type=video`);

            if (!response.ok) throw new Error('Ошибка при поиске');

            const data = await response.json();

            // Форматируем данные под наш плеер
            const formattedResults = data.map(item => ({
                id: item.videoId,
                title: item.title,
                artist: item.author,
                time: item.lengthSeconds ? `${Math.floor(item.lengthSeconds / 60)}:${String(item.lengthSeconds % 60).padStart(2, '0')}` : '0:00',
                cover: item.videoThumbnails?.find(t => t.quality === 'medium')?.url || item.videoThumbnails?.[0]?.url || 'https://via.placeholder.com/150/1a1a24/ffffff?text=No+Cover',
                videoId: item.videoId
            }));

            setResults(formattedResults);
        } catch (err) {
            console.error(err);
            setError('Не удалось загрузить результаты. Возможно, сервер поиска перегружен.');
        } finally {
            setIsLoading(false);
        }
    };

    // --- INLINE СТИЛИ ---
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        height: '100%',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto'
    };

    const formStyle = {
        display: 'flex',
        gap: '10px',
        width: '100%',
        position: 'relative'
    };

    const inputStyle = {
        flex: 1,
        height: '50px',
        borderRadius: '25px',
        backgroundColor: '#1a1a24',
        border: '1px solid #2a2a35',
        color: '#fff',
        padding: '0 20px 0 50px',
        fontSize: '16px',
        outline: 'none'
    };

    const searchIconStyle = {
        position: 'absolute',
        left: '20px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#888'
    };

    const buttonStyle = {
        height: '50px',
        padding: '0 25px',
        borderRadius: '25px',
        backgroundColor: '#9B51E0',
        color: '#fff',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '16px',
        boxShadow: '0 4px 15px rgba(155, 81, 224, 0.4)'
    };

    const trackListItemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: isActive ? '#1a1a24' : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    });

    // Компонент Skeleton для отображения загрузки
    const SkeletonLoader = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: '#1a1a24',
                        gap: '15px'
                    }}
                >
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#2a2a35' }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ width: '60%', height: '14px', borderRadius: '4px', backgroundColor: '#2a2a35' }} />
                        <div style={{ width: '30%', height: '10px', borderRadius: '4px', backgroundColor: '#2a2a35' }} />
                    </div>
                </motion.div>
            ))}
        </div>
    );

    return (
        <div style={containerStyle}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Поиск треков</h2>

            <form onSubmit={handleSearch} style={formStyle}>
                <SearchIcon size={20} style={searchIconStyle} />
                <input
                    type="text"
                    placeholder="Введите название трека или исполнителя..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={inputStyle}
                />
                <button type="submit" style={buttonStyle}>Найти</button>
            </form>

            {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#FF2A54', padding: '15px', backgroundColor: 'rgba(255, 42, 84, 0.1)', borderRadius: '12px' }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1 }}>
                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    results.map((track) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <div
                                key={track.id}
                                style={trackListItemStyle(isActive)}
                                onClick={() => playTrack(track, results)}
                                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#15151f' }}
                                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', flex: 2, gap: '15px' }}>
                                    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
                                        <img src={track.cover} alt={track.title} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                                        {isActive && (
                                            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                                                <Play size={16} fill="#9B51E0" color="#9B51E0" />
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                                        <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#9B51E0' : '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {track.title}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                            {track.artist}
                                        </span>
                                    </div>
                                </div>

                                {!isMobile && (
                                    <span style={{ width: '60px', color: '#888', fontSize: '14px', textAlign: 'right', paddingRight: '20px' }}>
                                        {track.time}
                                    </span>
                                )}

                                <button
                                    style={{ width: '40px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike(track);
                                    }}
                                >
                                    <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                                </button>
                            </div>
                        );
                    })
                )}

                {!isLoading && results.length === 0 && !error && query && (
                    <div style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
                        Нажмите "Найти", чтобы искать музыку по всему миру.
                    </div>
                )}
            </div>
        </div>
    );
}