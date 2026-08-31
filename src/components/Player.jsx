import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Player({ isMobile }) {
    const {
        currentTrack,
        isPlaying,
        setIsPlaying,
        playNext,
        playPrevious,
        volume,
        setVolume,
        likedTracks,
        toggleLike
    } = useStore();

    const playerRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    if (!currentTrack) return null;

    const isLiked = likedTracks.some(t => t.id === currentTrack.id);

    const formatTime = (seconds) => {
        if (!seconds) return '0:00';
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    // --- INLINE СТИЛИ ---
    const playerContainerStyle = {
        position: 'fixed',
        bottom: isMobile ? '80px' : '20px',
        left: isMobile ? '10px' : '260px',
        right: isMobile ? '10px' : '30px',
        height: '90px',
        backgroundColor: 'rgba(26, 26, 36, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '0 15px' : '0 30px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 100
    };

    const trackInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        width: isMobile ? '50%' : '30%',
        overflow: 'hidden'
    };

    const coverStyle = {
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        objectFit: 'cover',
        flexShrink: 0
    };

    const textStyle = {
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
    };

    const controlsStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: isMobile ? '50%' : '40%',
        gap: '8px'
    };

    const buttonsStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '15px' : '25px'
    };

    const playButtonStyle = {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: 'none'
    };

    const iconBtnStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#fff',
        display: 'flex',
        padding: 0
    };

    const progressContainerStyle = {
        display: isMobile ? 'none' : 'flex',
        alignItems: 'center',
        width: '100%',
        gap: '10px',
        fontSize: '12px',
        color: '#888'
    };

    const volumeContainerStyle = {
        display: isMobile ? 'none' : 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '30%',
        justifyContent: 'flex-end'
    };

    return (
        <div style={playerContainerStyle}>
            {/* Невидимый плеер YouTube */}
            <div style={{ display: 'none' }}>
                <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/watch?v=${currentTrack.videoId}`}
                    playing={isPlaying}
                    volume={volume}
                    onProgress={(e) => setProgress(e.played)}
                    onDuration={(e) => setDuration(e)}
                    onEnded={playNext}
                    width="0"
                    height="0"
                />
            </div>

            {/* Инфо о треке */}
            <div style={trackInfoStyle}>
                <img src={currentTrack.cover} alt="Cover" style={coverStyle} />
                <div style={textStyle}>
                    <span style={{ fontWeight: 'bold', fontSize: '15px', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {currentTrack.title}
                    </span>
                    <span style={{ fontSize: '13px', color: '#888', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {currentTrack.artist}
                    </span>
                </div>
                {!isMobile && (
                    <button style={{ ...iconBtnStyle, marginLeft: '10px' }} onClick={() => toggleLike(currentTrack)}>
                        <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                    </button>
                )}
            </div>

            {/* Управление */}
            <div style={controlsStyle}>
                <div style={buttonsStyle}>
                    <button style={iconBtnStyle} onClick={playPrevious}>
                        <SkipBack size={24} color="#fff" />
                    </button>
                    <button style={playButtonStyle} onClick={() => setIsPlaying(!isPlaying)}>
                        {isPlaying ? <Pause size={20} color="#000" /> : <Play size={20} color="#000" style={{ marginLeft: '3px' }} />}
                    </button>
                    <button style={iconBtnStyle} onClick={playNext}>
                        <SkipForward size={24} color="#fff" />
                    </button>
                </div>

                <div style={progressContainerStyle}>
                    <span>{formatTime(duration * progress)}</span>
                    <input
                        type="range"
                        min={0} max={1} step="any"
                        value={progress}
                        onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setProgress(val);
                            playerRef.current.seekTo(val);
                        }}
                        style={{ flex: 1, accentColor: '#9B51E0', height: '4px', cursor: 'pointer' }}
                    />
                    <span>{formatTime(duration)}</span>
                </div>
            </div>

            {/* Громкость (только десктоп) */}
            <div style={volumeContainerStyle}>
                <Volume2 size={20} color="#888" />
                <input
                    type="range"
                    min={0} max={1} step="any"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    style={{ width: '80px', accentColor: '#fff', height: '4px', cursor: 'pointer' }}
                />
            </div>
        </div>
    );
}