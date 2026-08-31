import React, { useState, useEffect } from 'react';
import { Heart, Music, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Library() {
    const { likedTracks, myPlaylists, createPlaylist, deletePlaylist } = useStore();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showCreate, setShowCreate] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleCreatePlaylist = () => {
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName.trim());
            setNewPlaylistName('');
            setShowCreate(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', height: '100%', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Медиатека</h1>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#9B51E0',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <Plus size={18} />
                    Создать
                </button>
            </div>

            {showCreate && (
                <div style={{
                    display: 'flex',
                    gap: '10px',
                    backgroundColor: '#1a1a24',
                    padding: '16px',
                    borderRadius: '12px',
                    alignItems: 'center'
                }}>
                    <input
                        type="text"
                        placeholder="Название плейлиста"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '10px 15px',
                            backgroundColor: '#0d0d12',
                            border: '1px solid #2a2a35',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                    <button
                        onClick={handleCreatePlaylist}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#9B51E0',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        Создать
                    </button>
                    <button
                        onClick={() => setShowCreate(false)}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: 'transparent',
                            border: '1px solid #2a2a35',
                            borderRadius: '8px',
                            color: '#888',
                            cursor: 'pointer'
                        }}
                    >
                        Отмена
                    </button>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                <div style={{
                    backgroundColor: '#1a1a24',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #2a2a35'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <Heart size={24} color="#FF2A54" fill="#FF2A54" />
                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Любимые треки</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#888' }}>{likedTracks.length} треков</div>
                </div>

                {myPlaylists.map((playlist) => (
                    <div
                        key={playlist.id}
                        style={{
                            backgroundColor: '#1a1a24',
                            borderRadius: '16px',
                            padding: '20px',
                            border: '1px solid #2a2a35',
                            position: 'relative'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <Music size={24} color="#9B51E0" />
                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{playlist.name}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#888' }}>{playlist.tracks?.length || 0} треков</div>
                        <button
                            onClick={() => deletePlaylist(playlist.id)}
                            style={{
                                position: 'absolute',
                                top: '12px',
                                right: '12px',
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer',
                                padding: '5px'
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}