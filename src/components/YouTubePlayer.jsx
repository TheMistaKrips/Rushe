import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipForward, Heart, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function YouTubePlayer({ isMobile }) {
    const { currentTrack, isPlaying, setIsPlaying, playNext, likedTracks, toggleLike, volume, setVolume } = useStore();
    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);

    const onReady = (event) => {
        setPlayer(event.target);
        setIsReady(true);
        event.target.setVolume(volume * 100);

        if (isPlaying) {
            event.target.playVideo();
        }
    };

    const onStateChange = (event) => {
        // YouTube API states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
        if (event.data === 1) {
            setIsPlaying(true);
            setDuration(event.target.getDuration());
        } else if (event.data === 2) {
            setIsPlaying(false);
        } else if (event.data === 0) {
            playNext();
        }
    };

    useEffect(() => {
        if (player && isReady) {
            if (isPlaying) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        }
    }, [isPlaying, player, isReady]);

    useEffect(() => {
        if (player && isReady) {
            player.setVolume(volume * 100);
        }
    }, [volume, player, isReady]);

    useEffect(() => {
        if (player && isReady) {
            // Обновляем текущее время каждую секунду
            const interval = setInterval(() => {
                if (player && isPlaying) {
                    setCurrentTime(player.getCurrentTime());
                }
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [player, isReady, isPlaying]);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    if (!currentTrack) return null;

    const isLiked = likedTracks.some(t => t.id === currentTrack.id);
    const videoId = currentTrack.videoId;

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

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            origin: window.location.origin
        },
    };

    return (
        <div style={containerStyle}>
            {videoId && (
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    style={{ display: 'none' }}
                />
            )}

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
                    {!videoId && <span style={{ fontSize: '11px', color: '#f1c40f', marginLeft: '8px' }}>(демо)</span>}
                </span>
                <span style={{ fontSize: isMobile ? '12px' : '13px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.artist}
                </span>
                {!isMobile && videoId && (
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
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        opacity: !videoId ? 0.5 : 1
                    }}
                    disabled={!videoId}
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
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
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