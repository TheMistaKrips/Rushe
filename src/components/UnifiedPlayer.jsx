import React, { useRef, useEffect, useState, useCallback } from 'react';
import YouTube from 'react-youtube';
import {
    Play, Pause, SkipForward, Heart, Volume2, VolumeX,
    Maximize2, Minimize2, ListMusic, Check, X, ExternalLink
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

// Проверяем Electron
const isElectron = () => {
    return window.electronAPI && window.electronAPI.isElectron === true;
};

export default function UnifiedPlayer() {
    const {
        currentTrack, isPlaying, setIsPlaying, playNext,
        likedTracks, toggleLike, volume, setVolume,
        isFullscreenPlayerOpen, toggleFullscreenPlayer,
        myPlaylists, addTrackToPlaylist
    } = useStore();

    const [player, setPlayer] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const progressRef = useRef(null);

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

    // Управление плеером
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

    // Обновление времени
    useEffect(() => {
        if (player && isReady && isPlaying) {
            const interval = setInterval(() => {
                try {
                    setCurrentTime(player.getCurrentTime());
                } catch (e) {
                    // Игнорируем ошибки при получении времени
                }
            }, 500);
            return () => clearInterval(interval);
        }
    }, [player, isReady, isPlaying]);

    const handleProgressClick = useCallback((e) => {
        if (!player || !isReady || !duration) return;
        try {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const newTime = x * duration;
            player.seekTo(newTime, true);
            setCurrentTime(newTime);
        } catch (err) {
            console.warn('Seek error:', err);
        }
    }, [player, isReady, duration]);

    const handleVolumeChange = useCallback((e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (player && isReady) {
            try {
                player.setVolume(newVolume * 100);
            } catch (err) {
                console.warn('Volume change error:', err);
            }
        }
    }, [player, isReady, setVolume]);

    const handleAddToPlaylist = useCallback((playlistId) => {
        if (currentTrack) {
            addTrackToPlaylist(playlistId, currentTrack);
            setShowPlaylistMenu(false);
        }
    }, [currentTrack, addTrackToPlaylist]);

    // Открыть мини-плеер в отдельном окне
    const openMiniPlayerWidget = () => {
        if (isElectron()) {
            window.electronAPI.openWidget('miniplayer');
        } else {
            window.open('/widget/miniplayer', '_blank', 'width=420,height=220,menubar=no,toolbar=no,location=no,status=no');
        }
    };

    // Открыть полноэкранный плеер в отдельном окне
    const openFullscreenWidget = () => {
        if (isElectron()) {
            window.electronAPI.openWidget('fullscreenplayer');
        } else {
            window.open('/widget/fullscreenplayer', '_blank', 'width=500,height=700,menubar=no,toolbar=no,location=no,status=no');
        }
    };

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds) || !isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    if (!currentTrack) return null;

    const isLiked = likedTracks.some(t => t.id === currentTrack.id);
    const videoId = currentTrack.videoId;
    const isInPlaylist = (playlistId) => {
        const playlist = myPlaylists.find(p => p.id === playlistId);
        return playlist?.tracks?.some(t => t.id === currentTrack.id) || false;
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

    // Стили для мини-плеера
    const miniStyle = isMobile ? {
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

    // Полноэкранный режим
    if (isFullscreenPlayerOpen) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(40px)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: isMobile ? '20px' : '40px'
                }}
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

                <button
                    onClick={toggleFullscreenPlayer}
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
                    <Minimize2 size={24} />
                </button>

                {/* Кнопка открытия в отдельном окне (только в Electron) */}
                {isElectron() && (
                    <button
                        onClick={openFullscreenWidget}
                        style={{
                            position: 'absolute',
                            top: isMobile ? '20px' : '30px',
                            left: isMobile ? '20px' : '30px',
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
                        title="Открыть в отдельном окне"
                    >
                        <ExternalLink size={24} />
                    </button>
                )}

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{
                        width: isMobile ? '100%' : '500px',
                        maxWidth: '600px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '24px'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            width: isMobile ? '280px' : '380px',
                            height: isMobile ? '280px' : '380px',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 30px 80px rgba(155, 81, 224, 0.3)',
                            position: 'relative'
                        }}
                    >
                        <img
                            src={currentTrack.cover || `https://picsum.photos/seed/${currentTrack.id}/400/400`}
                            alt="Cover"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                            onError={(e) => {
                                e.target.src = `https://picsum.photos/seed/${currentTrack.id}/400/400`;
                            }}
                        />
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ textAlign: 'center' }}
                    >
                        <h2 style={{ fontSize: isMobile ? '20px' : '26px', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
                            {currentTrack.title}
                        </h2>
                        <p style={{ fontSize: isMobile ? '14px' : '16px', color: '#888', margin: 0 }}>
                            {currentTrack.artist}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ width: '100%' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '12px', color: '#666' }}>{formatTime(currentTime)}</span>
                            <div
                                ref={progressRef}
                                onClick={handleProgressClick}
                                style={{
                                    flex: 1,
                                    height: '4px',
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
                            <span style={{ fontSize: '12px', color: '#666' }}>{formatTime(duration)}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '30px' }}
                    >
                        <button
                            onClick={() => toggleLike(currentTrack)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
                        >
                            <Heart size={isMobile ? 28 : 32} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#fff'} />
                        </button>

                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}
                            >
                                <ListMusic size={isMobile ? 28 : 32} color="#fff" />
                            </button>

                            {showPlaylistMenu && (
                                <div style={{
                                    position: 'absolute',
                                    bottom: '50px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: '#1c1c1e',
                                    borderRadius: '16px',
                                    border: '1px solid #2a2a35',
                                    padding: '8px',
                                    minWidth: '180px',
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                                    zIndex: 3000
                                }}>
                                    {myPlaylists.length === 0 ? (
                                        <div style={{ padding: '12px', color: '#666', fontSize: '13px' }}>
                                            Нет плейлистов
                                        </div>
                                    ) : (
                                        myPlaylists.map(playlist => {
                                            const added = isInPlaylist(playlist.id);
                                            return (
                                                <div
                                                    key={playlist.id}
                                                    onClick={() => handleAddToPlaylist(playlist.id)}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        padding: '10px 14px',
                                                        borderRadius: '10px',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.2s',
                                                        color: added ? '#888' : '#fff',
                                                        fontSize: '13px'
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#2a2a35'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <span>{playlist.name}</span>
                                                    {added && <Check size={16} color="#9B51E0" />}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}
                        </div>

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
                    </motion.div>

                    {!isMobile && (
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                width: '100%',
                                maxWidth: '300px'
                            }}
                        >
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
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        );
    }

    // Мини-плеер
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            style={miniStyle}
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

                {!isMobile && (
                    <>
                        <button
                            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                            style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                        >
                            {volume > 0 ? <Volume2 size={18} color="#888" /> : <VolumeX size={18} color="#888" />}
                        </button>
                        {showVolumeSlider && (
                            <div style={{
                                position: 'absolute',
                                bottom: '70px',
                                right: '100px',
                                backgroundColor: 'rgba(28,28,30,0.95)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                border: '1px solid #2a2a35',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                zIndex: 100
                            }}>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.01"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    style={{
                                        width: '120px',
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
                    </>
                )}

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

                {/* Кнопка открытия мини-плеера в отдельном окне */}
                <button
                    onClick={openMiniPlayerWidget}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: '#888'
                    }}
                    title={isElectron() ? "Открыть в отдельном окне" : "Открыть в новом окне"}
                >
                    <ExternalLink size={isMobile ? 16 : 20} />
                </button>

                <button
                    onClick={toggleFullscreenPlayer}
                    style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                >
                    <Maximize2 size={isMobile ? 18 : 22} color="#888" />
                </button>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(0.8); }
                }
            `}</style>
        </motion.div>
    );
}