import React, { useState, useEffect } from 'react';
import { Play, Heart, Plus, Trash2, Music, ChevronLeft } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Library() {
    const {
        likedTracks,
        myPlaylists,
        createPlaylist,
        deletePlaylist,
        playTrack,
        currentTrack,
        toggleLike
    } = useStore();

    const [activeTab, setActiveTab] = useState('liked'); // 'liked' | 'playlists'
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCreatePlaylist = (e) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName);
            setNewPlaylistName('');
        }
    };

    // --- INLINE СТИЛИ ---
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto'
    };

    const headerStyle = {
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        borderBottom: '1px solid #2a2a35',
        paddingBottom: '10px'
    };

    const tabStyle = (isActive) => ({
        fontSize: '20px',
        fontWeight: 'bold',
        color: isActive ? '#fff' : '#888',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0 0 10px 0',
        borderBottom: isActive ? '3px solid #9B51E0' : '3px solid transparent',
        transition: 'all 0.2s ease'
    });

    const formStyle = {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
    };

    const inputStyle = {
        flex: 1,
        height: '46px',
        borderRadius: '12px',
        backgroundColor: '#1a1a24',
        border: '1px solid #2a2a35',
        color: '#fff',
        padding: '0 15px',
        fontSize: '16px',
        outline: 'none'
    };

    const buttonStyle = {
        height: '46px',
        padding: '0 20px',
        borderRadius: '12px',
        backgroundColor: '#9B51E0',
        color: '#fff',
        border: 'none',
        fontWeight: 'bold',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    };

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '20px'
    };

    const playlistCardStyle = {
        backgroundColor: '#1a1a24',
        borderRadius: '16px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        border: '1px solid #2a2a35',
        position: 'relative'
    };

    const trackListItemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '12px',
        backgroundColor: isActive ? '#1a1a24' : 'transparent',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        marginBottom: '5px'
    });

    // Отрисовка списка треков
    const renderTrackList = (tracks, contextQueue) => {
        if (tracks.length === 0) {
            return <div style={{ color: '#888', textAlign: 'center', marginTop: '40px' }}>Здесь пока пусто.</div>;
        }

        return tracks.map((track) => {
            const isActive = currentTrack?.id === track.id;
            const isLiked = likedTracks.some(t => t.id === track.id);

            return (
                <div
                    key={track.id}
                    style={trackListItemStyle(isActive)}
                    onClick={() => playTrack(track, contextQueue)}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = '#15151f' }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '15px' }}>
                        <img src={track.cover} alt={track.title} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#9B51E0' : '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                {track.title}
                            </span>
                            <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                {track.artist}
                            </span>
                        </div>
                    </div>

                    <button
                        style={{ width: '40px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track);
                        }}
                    >
                        <Heart size={20} fill={isLiked ? '#FF2A54' : 'none'} color={isLiked ? '#FF2A54' : '#888'} />
                    </button>
                </div>
            );
        });
    };

    return (
        <div style={containerStyle}>
            {selectedPlaylist ? (
                // --- ПРОСМОТР ВЫБРАННОГО ПЛЕЙЛИСТА ---
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <button
                            onClick={() => setSelectedPlaylist(null)}
                            style={{ background: '#1a1a24', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <h2 style={{ margin: 0, fontSize: '28px' }}>{selectedPlaylist.name}</h2>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {renderTrackList(selectedPlaylist.tracks, selectedPlaylist.tracks)}
                    </div>
                </div>
            ) : (
                // --- ГЛАВНЫЙ ЭКРАН МЕДИАТЕКИ ---
                <>
                    <div style={headerStyle}>
                        <button style={tabStyle(activeTab === 'liked')} onClick={() => setActiveTab('liked')}>
                            Любимые треки
                        </button>
                        <button style={tabStyle(activeTab === 'playlists')} onClick={() => setActiveTab('playlists')}>
                            Мои плейлисты
                        </button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {activeTab === 'liked' && renderTrackList(likedTracks, likedTracks)}

                        {activeTab === 'playlists' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <form onSubmit={handleCreatePlaylist} style={formStyle}>
                                    <input
                                        type="text"
                                        placeholder="Название нового плейлиста..."
                                        value={newPlaylistName}
                                        onChange={(e) => setNewPlaylistName(e.target.value)}
                                        style={inputStyle}
                                    />
                                    <button type="submit" style={buttonStyle}>
                                        <Plus size={20} /> <span style={{ display: isMobile ? 'none' : 'inline' }}>Создать</span>
                                    </button>
                                </form>

                                <div style={gridStyle}>
                                    {myPlaylists.map(playlist => (
                                        <div
                                            key={playlist.id}
                                            style={playlistCardStyle}
                                            onClick={() => setSelectedPlaylist(playlist)}
                                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                        >
                                            <div style={{
                                                width: '100%',
                                                aspectRatio: '1',
                                                backgroundColor: '#2a2a35',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: 'linear-gradient(135deg, #2a2a35, #1a1a24)'
                                            }}>
                                                <Music size={40} color="#888" />
                                            </div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                {playlist.name}
                                            </div>
                                            <div style={{ color: '#888', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {playlist.tracks.length} треков
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deletePlaylist(playlist.id);
                                                    }}
                                                    style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '5px' }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}