import React, { useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Player({ isMobile }) {
    const { currentTrack, isPlaying, setIsPlaying, playNext, likedTracks, toggleLike, volume } = useStore();
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch(err => {
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack, volume]);

    if (!currentTrack) return null;
    const isLiked = likedTracks.some(t => t.id === currentTrack.id);

    // Безопасный аудиопоток с fallback на стабильный MP3-пример
    const audioSource = currentTrack.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

    const containerStyle = isMobile ? {
        position: 'fixed',
        bottom: '75px',
        left: '10px',
        right: '10px',
        height: '56px',
        backgroundColor: '#1c1c1e',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 990
    } : {
        position: 'fixed',
        bottom: '20px',
        left: '260px',
        right: '30px',
        height: '80px',
        backgroundColor: '#12121a',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 25px',
        border: '1px solid #1f1f2e',
        zIndex: 100
    };

    return (
        <div style={containerStyle}>
            <audio
                ref={audioRef}
                src={audioSource}
                onEnded={playNext}
            />

            <img src={currentTrack.cover} alt="Cover" style={{ width: isMobile ? '40px' : '56px', height: isMobile ? '40px' : '56px', borderRadius: isMobile ? '8px' : '12px', objectFit: 'cover' }} />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '12px', overflow: 'hidden' }}>
                <span style={{ fontWeight: 'bold', fontSize: isMobile ? '14px' : '15px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.title}
                </span>
                <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.artist}
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px' }}>
                <button onClick={() => toggleLike(currentTrack)} style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer' }}>
                    <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#fff'} />
                </button>
                <button onClick={() => setIsPlaying(!isPlaying)} style={{ background: 'none', border: 'none', padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    {isPlaying ? <Pause size={isMobile ? 24 : 28} fill="#fff" color="#fff" /> : <Play size={isMobile ? 24 : 28} fill="#fff" color="#fff" />}
                </button>
                <button onClick={playNext} style={{ background: 'none', border: 'none', padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <SkipForward size={isMobile ? 24 : 28} fill="#fff" color="#fff" />
                </button>
            </div>
        </div>
    );
}