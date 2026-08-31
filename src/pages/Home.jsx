import React, { useState, useEffect } from 'react';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { useStore } from '../store/useStore';

// Временные данные с реальными ID из YouTube для проверки плеера
const MOCK_TRACKS = [
    { id: '1', title: 'Tak Mampu Pergi', artist: 'Sammy Simorangkir', time: '3:20', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=100&q=80', videoId: 'dQw4w9WgXcQ' },
    { id: '2', title: 'Kaulah Segalanya', artist: 'Sammy Simorangkir', time: '4:15', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=100&q=80', videoId: '4NRXx6U8ABQ' },
    { id: '3', title: 'Lagu Rindu', artist: 'Kerispatih', time: '3:45', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80', videoId: 'JGwWNGJdvx8' },
    { id: '4', title: 'Midnight City', artist: 'M83', time: '4:03', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80', videoId: 'dX3k_LSd3YY' },
];

const MOCK_ARTISTS = [
    { id: '1', name: 'Sammy Simorangkir', albums: '20 Albums', cover: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80' },
    { id: '2', name: 'Rossa', albums: '15 Albums', cover: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
    { id: '3', name: 'Dewa 19', albums: '10 Albums', cover: 'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=100&q=80' },
    { id: '4', name: 'Juicy Luicy', albums: '11 Albums', cover: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&q=80' },
];

export default function Home() {
    const { playTrack, currentTrack, likedTracks, toggleLike } = useStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- INLINE СТИЛИ ---
    const containerStyle = {
        display: 'flex',
        gap: '30px',
        height: '100%',
        width: '100%',
    };

    const mainColumnStyle = {
        flex: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
    };

    const rightColumnStyle = {
        flex: 1,
        display: isMobile ? 'none' : 'flex',
        flexDirection: 'column',
        gap: '30px',
    };

    const sectionTitleStyle = {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };

    const heroCardStyle = {
        width: '100%',
        height: '280px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #4A00E0, #8E2DE2, #FF2A54)',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        boxShadow: '0 10px 30px rgba(142, 45, 226, 0.3)',
        position: 'relative',
        overflow: 'hidden'
    };

    const heroPlayButtonStyle = {
        backgroundColor: '#fff',
        color: '#000',
        border: 'none',
        borderRadius: '30px',
        padding: '12px 24px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        width: 'fit-content'
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

    const artistItemStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        padding: '10px 0',
    };

    return (
        <div style={containerStyle}>
            {/* ЛЕВАЯ/ОСНОВНАЯ КОЛОНКА */}
            <div style={mainColumnStyle}>
                <div>
                    <span style={{ color: '#888', fontSize: '14px' }}>Top</span>
                    <div style={sectionTitleStyle}>Trending</div>

                    <div style={heroCardStyle}>
                        <span style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '10px' }}>Playlist</span>
                        <h1 style={{ fontSize: isMobile ? '32px' : '48px', margin: '0 0 30px 0', lineHeight: 1.1 }}>
                            Top Song<br />Of The Week
                        </h1>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button
                                style={heroPlayButtonStyle}
                                onClick={() => playTrack(MOCK_TRACKS[0], MOCK_TRACKS)}
                            >
                                <Play size={18} fill="#000" /> Play
                            </button>
                            <button style={{ ...heroPlayButtonStyle, backgroundColor: 'rgba(0,0,0,0.3)', color: '#fff' }}>
                                View Playlist
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <span style={{ color: '#888', fontSize: '14px' }}>Global</span>
                    <div style={sectionTitleStyle}>Top 50</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', padding: '0 12px 10px 12px', color: '#888', fontSize: '14px', borderBottom: '1px solid #2a2a35', marginBottom: '10px' }}>
                            <span style={{ width: '30px' }}>#</span>
                            <span style={{ flex: 2 }}>Name Song</span>
                            {!isMobile && <span style={{ flex: 1 }}>Artist</span>}
                            <span style={{ width: '60px' }}>Time</span>
                            <span style={{ width: '50px' }}>Like</span>
                        </div>

                        {MOCK_TRACKS.map((track, index) => {
                            const isActive = currentTrack?.id === track.id;
                            const isLiked = likedTracks.some(t => t.id === track.id);

                            return (
                                <div
                                    key={track.id}
                                    style={trackListItemStyle(isActive)}
                                    onClick={() => playTrack(track, MOCK_TRACKS)}
                                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#15151f' }}
                                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                                >
                                    <span style={{ width: '30px', color: isActive ? '#9B51E0' : '#888' }}>
                                        {isActive ? <Play size={14} fill="#9B51E0" /> : `0${index + 1}`}
                                    </span>
                                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <img src={track.cover} alt={track.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#9B51E0' : '#fff' }}>
                                            {track.title}
                                            {isMobile && <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>{track.artist}</div>}
                                        </span>
                                    </div>
                                    {!isMobile && (
                                        <span style={{ flex: 1, color: '#888', fontSize: '14px' }}>{track.artist}</span>
                                    )}
                                    <span style={{ width: '60px', color: '#888', fontSize: '14px' }}>{track.time}</span>
                                    <button
                                        style={{ width: '50px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleLike(track);
                                        }}
                                    >
                                        <Heart size={18} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                                    </button>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ПРАВАЯ КОЛОНКА (ТОП АРТИСТЫ) */}
            <div style={rightColumnStyle}>
                <span style={{ color: '#888', fontSize: '14px' }}>Top</span>
                <div style={sectionTitleStyle}>
                    Artist
                    <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal', cursor: 'pointer' }}>See all</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {MOCK_ARTISTS.map((artist, index) => (
                        <div key={artist.id} style={artistItemStyle}>
                            <img src={artist.cover} alt={artist.name} style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 'bold' }}>{artist.name}</span>
                                <span style={{ fontSize: '13px', color: '#888' }}>{artist.albums}</span>
                            </div>
                            <span style={{ color: '#888', fontSize: '14px' }}>0{index + 1}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}