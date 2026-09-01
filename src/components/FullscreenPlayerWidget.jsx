import React, { useRef, useEffect, useState, useCallback } from 'react';
import YouTube from 'react-youtube';
import { Play, Pause, SkipForward, Heart, Volume2, VolumeX, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import WidgetWrapper, { closeWidget } from './WidgetWrapper';

export default function FullscreenPlayerWidget() {
    const {
        currentTrack, isPlaying, setIsPlaying, playNext,
        likedTracks, toggleLike, volume, setVolume,
        closeFullscreenPlayer
    } = useStore();

    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const onReady = useCallback((event) => {
        setPlayer(event.target);
        setIsReady(true);
        event.target.setVolume(volume * 100);
        if (isPlaying) {
            event.target.playVideo();
        }
    }, [volume, isPlaying]);

    const onStateChange = useCallback((event) => {
        if (event.data === 1) {
            setIsPlaying(true);
            setDuration(event.target.getDuration());
        } else if (event.data === 2) {
            setIsPlaying(false);
        } else if (event.data === 0) {
            playNext();
        }
    }, [setIsPlaying, playNext]);

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
                try {
                    setCurrentTime(player.getCurrentTime());
                } catch (e) { }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [player, isReady, isPlaying]);

    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (player && isReady) {
            try {
                player.setVolume(newVolume * 100);
            } catch (err) { }
        }
    }, [player, isReady, setVolume]);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    if (!currentTrack) {
        return (
            <WidgetWrapper widgetId="fullscreenplayer" title="RushE - Плеер" transparent>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#888'
                }}>
                    Нет активного трека
                </div>
            </WidgetWrapper>
        );
    }

    const isLiked = likedTracks.some(t => t.id === currentTrack.id);
    const videoId = currentTrack.videoId;

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
        <WidgetWrapper widgetId="fullscreenplayer" title="RushE - Плеер" transparent>
            {videoId && (
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    style={{ display: 'none' }}
                />
            )}

            <div style={{
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                backdropFilter: 'blur(40px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: isMobile ? '20px' : '40px',
                position: 'relative'
            }}>
                {/* Кнопка закрытия */}
                <button
                    onClick={() => {
                        closeFullscreenPlayer();
                        closeWidget('fullscreenplayer');
                    }}
                    style={{
                        position: 'absolute',
                        top: isMobile ? '20px' : '30px',
                        right: isMobile ? '20px' : '30px',
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: '#fff',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                    <X size={24} />
                </button>

                <div style={{
                    width: isMobile ? '100%' : '500px',
                    maxWidth: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '24px'
                }}>
                    {/* Обложка */}
                    <div style={{
                        width: isMobile ? '280px' : '380px',
                        height: isMobile ? '280px' : '380px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        boxShadow: '0 30px 80px rgba(155, 81, 224, 0.3)'
                    }}>
                        <img
                            src={currentTrack.cover || `https://picsum.photos/seed/${currentTrack.id}/400/400`}
                            alt="Cover"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                                e.target.src = `https://picsum.photos/seed/${currentTrack.id}/400/400`;
                            }}
                        />
                    </div>

                    {/* Информация */}
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
                            {currentTrack.title}
                        </h2>
                        <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#888', margin: 0 }}>
                            {currentTrack.artist}
                        </p>
                    </div>

                    {/* Прогресс */}
                    <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>{formatTime(currentTime)}</span>
                            <div style={{
                                flex: 1,
                                height: '4px',
                                backgroundColor: '#2a2a35',
                                borderRadius: '2px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                                    height: '100%',
                                    backgroundColor: '#9B51E0',
                                    borderRadius: '2px'
                                }} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#666' }}>{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Кнопки */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '30px' }}>
                        <button
                            onClick={() => toggleLike(currentTrack)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
                        >
                            <Heart size={isMobile ? 28 : 32} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#fff'} />
                        </button>

                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#fff',
                                opacity: !videoId ? 0.5 : 1
                            }}
                            disabled={!videoId}
                        >
                            {isPlaying ? <Pause size={isMobile ? 44 : 56} fill="#fff" color="#fff" /> : <Play size={isMobile ? 44 : 56} fill="#fff" color="#fff" />}
                        </button>

                        <button
                            onClick={playNext}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
                        >
                            <SkipForward size={isMobile ? 28 : 32} fill="#fff" color="#fff" />
                        </button>
                    </div>

                    {/* Громкость */}
                    {!isMobile && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            width: '100%',
                            maxWidth: '300px'
                        }}>
                            <button
                                onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}
                            >
                                {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                style={{
                                    flex: 1,
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
                                    width: 16px;
                                    height: 16px;
                                    border-radius: 50%;
                                    background: #9B51E0;
                                    cursor: pointer;
                                }
                            `}</style>
                        </div>
                    )}
                </div>
            </div>
        </WidgetWrapper>
    );
}