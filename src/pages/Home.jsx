import React, { useState, useEffect } from 'react';
import { Play, Heart, MoreHorizontal, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

const DEFAULT_TRACKS = [
    { id: '1', title: 'Midnight City', artist: 'M83', time: '4:03', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80', videoId: 'dX3k_LSd3YY' },
    { id: '2', title: 'Starboy', artist: 'The Weeknd', time: '3:50', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=100&q=80', videoId: '34Na4j8HLjc' },
    { id: '3', title: 'Blinding Lights', artist: 'The Weeknd', time: '3:20', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80', videoId: '4NRXx6U8ABQ' },
];

export default function Home() {
    const { playTrack, currentTrack, isPlaying, setIsPlaying, likedTracks, toggleLike } = useStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleMyWavePlay = () => {
        if (currentTrack && isPlaying) {
            setIsPlaying(false);
            return;
        }
        const waveQueue = likedTracks.length > 0 ? likedTracks : DEFAULT_TRACKS;
        const randomTrack = waveQueue[Math.floor(Math.random() * waveQueue.length)];
        playTrack(randomTrack, waveQueue);
    };

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
                    height: isMobile ? '200px' : '280px',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    {isPlaying ? <Pause size={isMobile ? 32 : 48} fill="#fff" /> : <Play size={isMobile ? 32 : 48} fill="#fff" />}
                    <h1 style={{ fontSize: isMobile ? '32px' : '56px', margin: 0, fontWeight: '900', letterSpacing: '-1px' }}>Моя волна</h1>
                </div>
                {currentTrack && isPlaying && (
                    <div style={{ marginTop: '20px', padding: '8px 20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '20px', backdropFilter: 'blur(10px)' }}>
                        Играет: {currentTrack.title}
                    </div>
                )}
            </motion.div>

            {/* ПОПУЛЯРНОЕ */}
            <div>
                <div style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '15px' }}>Рекомендуем</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {DEFAULT_TRACKS.map((track) => {
                        const isActive = currentTrack?.id === track.id;
                        const isLiked = likedTracks.some(t => t.id === track.id);

                        return (
                            <div
                                key={track.id}
                                style={{
                                    display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: '12px',
                                    backgroundColor: isActive ? '#1a1a24' : 'transparent', cursor: 'pointer'
                                }}
                                onClick={() => playTrack(track, DEFAULT_TRACKS)}
                            >
                                <img src={track.cover} alt={track.title} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '15px', overflow: 'hidden' }}>
                                    <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#9B51E0' : '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                        {track.title}
                                    </span>
                                    <span style={{ fontSize: '13px', color: '#888' }}>{track.artist}</span>
                                </div>

                                <button
                                    style={{ background: 'none', border: 'none', padding: '10px' }}
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