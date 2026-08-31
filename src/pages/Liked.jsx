import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function Liked() {
    const { likedTracks, playTrack, currentTrack, toggleLike } = useStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (likedTracks.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '80vh',
                    color: '#888',
                    gap: '20px'
                }}
            >
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'rgba(255,42,84,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Heart size={40} color="#333" />
                </div>
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>Нет лайков</div>
                <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '300px', color: '#666' }}>
                    Добавляйте треки в избранное ❤️, чтобы они появились здесь
                </div>
            </motion.div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart size={28} color="#FF2A54" fill="#FF2A54" />
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Любимые треки</h1>
                <span style={{ fontSize: '14px', color: '#888', marginLeft: '8px' }}>{likedTracks.length} треков</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {likedTracks.map((track, index) => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                        <motion.div
                            key={track.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px',
                                borderRadius: '12px',
                                backgroundColor: isActive ? 'rgba(155, 81, 224, 0.15)' : 'transparent',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: isActive ? '1px solid rgba(155, 81, 224, 0.2)' : '1px solid transparent'
                            }}
                            onClick={() => playTrack(track, likedTracks)}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <img
                                src={track.cover || `https://picsum.photos/seed/${track.id}/100/100`}
                                alt={track.title}
                                style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }}
                                onError={(e) => e.target.src = `https://picsum.photos/seed/${track.id}/100/100`}
                            />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '14px', overflow: 'hidden' }}>
                                <span style={{
                                    fontWeight: isActive ? 'bold' : 'normal',
                                    color: isActive ? '#9B51E0' : '#fff',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                    overflow: 'hidden',
                                    fontSize: '14px'
                                }}>
                                    {track.title}
                                </span>
                                <span style={{ fontSize: '12px', color: '#888' }}>{track.artist}</span>
                            </div>
                            {!isMobile && <span style={{ fontSize: '13px', color: '#666', marginRight: '12px' }}>{track.time}</span>}
                            <button
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    borderRadius: '50%',
                                    transition: 'background 0.2s'
                                }}
                                onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <Heart size={18} fill="#FF2A54" color="#FF2A54" />
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}