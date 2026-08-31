import React, { useState, useEffect } from 'react';
import { Play, Heart, Music, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

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
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#888',
                gap: '16px'
            }}>
                <Heart size={64} color="#333" />
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Нет лайков</div>
                <div style={{ fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>
                    Добавляйте треки в избранное ❤️, чтобы они появились здесь
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Heart size={28} color="#FF2A54" fill="#FF2A54" />
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Любимые треки</h1>
                <span style={{ fontSize: '14px', color: '#888', marginLeft: '8px' }}>{likedTracks.length} треков</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', overflowY: 'auto', flex: 1, paddingBottom: '20px' }}>
                {likedTracks.map((track) => {
                    const isActive = currentTrack?.id === track.id;
                    return (
                        <div
                            key={track.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px',
                                borderRadius: '12px',
                                backgroundColor: isActive ? '#1a1a24' : 'transparent',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s'
                            }}
                            onClick={() => playTrack(track, likedTracks)}
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
                                src={track.cover || `https://picsum.photos/seed/${track.id}/100/100`}
                                alt={track.title}
                                style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }}
                                onError={(e) => e.target.src = `https://picsum.photos/seed/${track.id}/100/100`}
                            />
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '15px', overflow: 'hidden' }}>
                                <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#9B51E0' : '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                    {track.title}
                                </span>
                                <span style={{ fontSize: '13px', color: '#888' }}>{track.artist}</span>
                            </div>
                            {!isMobile && <span style={{ fontSize: '13px', color: '#666', marginRight: '15px' }}>{track.time}</span>}
                            <button
                                style={{ background: 'none', border: 'none', padding: '10px', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); toggleLike(track); }}
                            >
                                <Heart size={20} fill="#FF2A54" color="#FF2A54" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}