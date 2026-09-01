import React, { useRef, useEffect, useState } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipForward, Heart, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

export default function YouTubePlayer({ isMobile }) {
    const {
        currentTrack, isPlaying, setIsPlaying, playNext,
        likedTracks, toggleLike, volume, setVolume,
        toggleFullscreenPlayer
    } = useStore();

    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const progressRef = useRef(null);

    const onReady = (event) => {
        setPlayer(event.target);
        setIsReady(true);
        event.target.setVolume(volume * 100);
        if (isPlaying) {
            event.target.playVideo();
        }
    };

    const onStateChange = (event) => {
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
        if (player && isReady && isPlaying) {
            const interval = setInterval(() => {
                setCurrentTime(player.getCurrentTime());
            }, 500);
            return () => clearInterval(interval);
        }
    }, [player, isReady, isPlaying]);

    const handleProgressClick = (e) => {
        if (!player || !isReady) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const newTime = x * duration;
        player.seekTo(newTime, true);
        setCurrentTime(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (player && isReady) {
            player.setVolume(newVolume * 100);
        }
    };

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
        bottom: '86px',
        left: '16px',
        right: '16px',
        height: '64px',
        backgroundColor: 'rgba(28, 28, 30, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
        zIndex: 990,
        gap: '8px',
        border: '1px solid rgba(255,255,255,0.05)'
    } : {
        position: 'fixed',
        bottom: '24px',
        left: '280px',
        right: '30px',
        height: '72px',
        backgroundColor: 'rgba(18, 18, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        border: '1px solid #1f1f2e',
        zIndex: 100,
        boxShadow: '0 10px 40px rgba(0,0,0,0.4)'
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
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={containerStyle}
        >
            {videoId && (
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    style={{ display: 'none' }}
                />
            )}

            <div
                style={{
                    position: 'relative',
                    width: isMobile ? '44px' : '52px',
                    height: isMobile ? '44px' : '52px',
                    flexShrink: 0,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                }}
                onClick={toggleFullscreenPlayer}
            >
                <img
                    src={currentTrack.cover || `https://picsum.photos/seed/${currentTrack.id}/100/100`}
                    alt="Cover"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${currentTrack.id}/100/100`;
                    }}
                />
                {isPlaying && (
                    <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: '#9B51E0',
                        border: '2px solid rgba(28,28,30,0.95)',
                        animation: 'pulse 1.5s ease-in-out infinite'
                    }} />
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '12px', overflow: 'hidden', minWidth: 0, cursor: 'pointer' }} onClick={toggleFullscreenPlayer}>
                <span style={{ fontWeight: 'bold', fontSize: isMobile ? '13px' : '14px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.title}
                </span>
                <span style={{ fontSize: isMobile ? '11px' : '12px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {currentTrack.artist}
                </span>
                {!isMobile && videoId && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                        <span style={{ fontSize: '10px', color: '#666' }}>{formatTime(currentTime)}</span>
                        <div
                            ref={progressRef}
                            onClick={handleProgressClick}
                            style={{
                                flex: 1,
                                height: '3px',
                                backgroundColor: '#2a2a35',
                                borderRadius: '2px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                position: 'relative'
                            }}
                        >
                            <div style={{
                                width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                                height: '100%',
                                backgroundColor: '#9B51E0',
                                borderRadius: '2px',
                                transition: 'width 0.1s linear'
                            }} />
                        </div>
                        <span style={{ fontSize: '10px', color: '#666' }}>{formatTime(duration)}</span>
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '16px', flexShrink: 0 }}>
                <button
                    onClick={() => toggleLike(currentTrack)}
                    style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                >
                    <Heart size={isMobile ? 18 : 22} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#fff'} />
                </button>

                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        opacity: !videoId ? 0.5 : 1
                    }}
                    disabled={!videoId}
                >
                    {isPlaying ? <Pause size={isMobile ? 20 : 26} fill="#fff" color="#fff" /> : <Play size={isMobile ? 20 : 26} fill="#fff" color="#fff" />}
                </button>
                <button
                    onClick={playNext}
                    style={{ background: 'none', border: 'none', padding: '4px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                >
                    <SkipForward size={isMobile ? 18 : 22} fill="#fff" color="#fff" />
                </button>
                {!isMobile && (
                    <button
                        onClick={toggleFullscreenPlayer}
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                    >
                        <Maximize2 size={18} color="#888" />
                    </button>
                )}
            </div>

            {!isMobile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '15px' }}>
                    <button
                        onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                        style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                    >
                        {volume > 0 ? <Volume2 size={18} color="#888" /> : <VolumeX size={18} color="#888" />}
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
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            background: #9B51E0;
                            cursor: pointer;
                        }
                    `}</style>
                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }
            `}</style>
        </motion.div>
    );
}