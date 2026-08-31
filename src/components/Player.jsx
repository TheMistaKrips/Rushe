import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, SkipForward, Heart, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Player({ isMobile }) {
    const { currentTrack, isPlaying, setIsPlaying, playNext, likedTracks, toggleLike, volume, setVolume } = useStore();
    const audioRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
            if (isPlaying) {
                audioRef.current.play().catch((err) => {
                    console.error("Ошибка воспроизведения:", err);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack, volume]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration || 0);
            };
            const handleLoadedMetadata = () => {
                setDuration(audio.duration || 0);
            };
            const handleEnded = () => {
                playNext();
            };
            const handleError = (e) => {
                console.error("Ошибка аудио:", e);
                setIsPlaying(false);
            };

            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('ended', handleEnded);
            audio.addEventListener('error', handleError);

            return () => {
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('ended', handleEnded);
                audio.removeEventListener('error', handleError);
            };
        }
    }, [currentTrack, playNext, setIsPlaying]);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    if (!currentTrack) return null;
    const isLiked = likedTracks.some(t => t.id === currentTrack.id);

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
        zIndex: 990,
        gap: '8px'
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
                src={currentTrack.audioUrl}
                preload="metadata"
            />

            <img
                src={currentTrack.cover || `https://picsum.photos/seed/${currentTrack.id}/100/100`}
                alt="Cover"
                style={{
                    width: isMobile ? '40px' : '56px',
                    height: isMobile ? '40px' : '56px',
                    borderRadius: isMobile ? '8px' : '12px',
                    objectFit: 'cover',
                    flexShrink: 0
                }}
                onError={(e) => {
                    e.target.src = `https://picsum.photos/seed/${currentTrack.id}/100/100`;
                }}
            />

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '12px', overflow: 'hidden', minWidth: 0 }}>
                <span style={{ fontWeight: 'bold', fontSize: isMobile ? '14px' : '15px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.title}
                </span>
                <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.artist}
                </span>
                {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#666' }}>{formatTime(currentTime)}</span>
                        <div style={{ flex: 1, height: '3px', backgroundColor: '#2a2a35', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`, height: '100%', backgroundColor: '#9B51E0', borderRadius: '2px' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#666' }}>{formatTime(duration)}</span>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '20px', flexShrink: 0 }}>
                <button
                    onClick={() => toggleLike(currentTrack)}
                    style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer' }}
                >
                    <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#fff'} />
                </button>
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{ background: 'none', border: 'none', padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    {isPlaying ? <Pause size={isMobile ? 24 : 28} fill="#fff" color="#fff" /> : <Play size={isMobile ? 24 : 28} fill="#fff" color="#fff" />}
                </button>
                <button
                    onClick={playNext}
                    style={{ background: 'none', border: 'none', padding: '5px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <SkipForward size={isMobile ? 24 : 28} fill="#fff" color="#fff" />
                </button>
            </div>

            {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '15px' }}>
                    <button
                        onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                        style={{ background: 'none', border: 'none', padding: '5px', cursor: 'pointer' }}
                    >
                        {volume > 0 ? <Volume2 size={20} color="#888" /> : <VolumeX size={20} color="#888" />}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        style={{
                            width: '80px',
                            height: '4px',
                            WebkitAppearance: 'none',
                            backgroundColor: '#2a2a35',
                            borderRadius: '2px',
                            outline: 'none'
                        }}
                    />
                    <style>{`
                        input[type="range"]::-webkit-slider-thumb {
                            -webkit-appearance: none;
                            width: 12px;
                            height: 12px;
                            border-radius: 50%;
                            background: #9B51E0;
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}