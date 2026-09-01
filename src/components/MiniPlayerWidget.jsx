import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, Heart, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../store/useStore';
import WidgetWrapper from './WidgetWrapper';

export default function MiniPlayerWidget() {
    const {
        currentTrack, isPlaying, setIsPlaying, playNext,
        likedTracks, toggleLike, volume, setVolume
    } = useStore();

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = React.useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack]);

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const updateTime = () => {
                setCurrentTime(audio.currentTime);
                setDuration(audio.duration || 0);
            };
            audio.addEventListener('timeupdate', updateTime);
            audio.addEventListener('loadedmetadata', updateTime);
            return () => {
                audio.removeEventListener('timeupdate', updateTime);
                audio.removeEventListener('loadedmetadata', updateTime);
            };
        }
    }, [currentTrack]);

    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    if (!currentTrack) {
        return (
            <WidgetWrapper widgetId="miniplayer" title="RushE - Мини-плеер" transparent>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#888',
                    fontSize: '14px'
                }}>
                    Нет активного трека
                </div>
            </WidgetWrapper>
        );
    }

    const isLiked = likedTracks.some(t => t.id === currentTrack.id);

    return (
        <WidgetWrapper widgetId="miniplayer" title="RushE - Мини-плеер" transparent width={400} height={200}>
            <div style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(20, 20, 30, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
            }}>
                <audio
                    ref={audioRef}
                    src={currentTrack.audioUrl}
                    preload="metadata"
                />

                {/* Заголовок */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <img
                        src={currentTrack.cover || `https://picsum.photos/seed/${currentTrack.id}/100/100`}
                        alt="Cover"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {currentTrack.title}
                        </div>
                        <div style={{
                            fontSize: '12px',
                            color: '#888',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                        }}>
                            {currentTrack.artist}
                        </div>
                    </div>
                </div>

                {/* Прогресс */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '10px', color: '#666' }}>{formatTime(currentTime)}</span>
                    <div style={{
                        flex: 1,
                        height: '3px',
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
                    <span style={{ fontSize: '10px', color: '#666' }}>{formatTime(duration)}</span>
                </div>

                {/* Кнопки */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                    <button
                        onClick={() => toggleLike(currentTrack)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <Heart size={18} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #9B51E0, #4A00E0)',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {isPlaying ?
                            <Pause size={20} fill="#fff" color="#fff" /> :
                            <Play size={20} fill="#fff" color="#fff" />
                        }
                    </button>

                    <button
                        onClick={playNext}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px'
                        }}
                    >
                        <SkipForward size={18} fill="#fff" color="#fff" />
                    </button>

                    {/* Громкость */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                            onClick={() => setVolume(volume > 0 ? 0 : 0.8)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                        >
                            {volume > 0 ? <Volume2 size={16} color="#888" /> : <VolumeX size={16} color="#888" />}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            style={{
                                width: '60px',
                                height: '3px',
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
                </div>
            </div>
        </WidgetWrapper>
    );
}