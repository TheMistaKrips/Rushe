import React, { useState } from 'react';
import { Heart, Plus, Trash2, Music } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export default function Library() {
    const { likedTracks, myPlaylists, createPlaylist, deletePlaylist, playTrack, currentTrack, toggleLike } = useStore();
    const [activeTab, setActiveTab] = useState('liked');
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [isMobile] = useState(window.innerWidth < 768);

    const handleCreatePlaylist = (e) => {
        e.preventDefault();
        if (newPlaylistName.trim()) {
            createPlaylist(newPlaylistName);
            setNewPlaylistName('');
        }
    };

    const tabStyle = (isActive) => ({
        fontSize: isMobile ? '16px' : '20px',
        fontWeight: 'bold',
        color: isActive ? '#fff' : '#666',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0 0 10px 0',
        borderBottom: isActive ? '3px solid #9B51E0' : '3px solid transparent',
        transition: 'all 0.2s ease',
        flex: isMobile ? 1 : 'none',
        textAlign: 'center'
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', borderBottom: '1px solid #1f1f2e', paddingBottom: '10px' }}>
                <button style={tabStyle(activeTab === 'liked')} onClick={() => setActiveTab('liked')}>Любимые</button>
                <button style={tabStyle(activeTab === 'playlists')} onClick={() => setActiveTab('playlists')}>Плейлисты</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '20px' }}>
                {activeTab === 'liked' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {likedTracks.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>Нет добавленных треков</div>
                        ) : (
                            likedTracks.map(track => {
                                const isActive = currentTrack?.id === track.id;
                                return (
                                    <motion.div
                                        key={track.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        style={{ display: 'flex', alignItems: 'center', padding: '12px', borderRadius: '12px', backgroundColor: isActive ? '#1a1a24' : 'transparent', cursor: 'pointer' }}
                                        onClick={() => playTrack(track, likedTracks)}
                                    >
                                        <img src={track.cover} alt={track.title} style={{ width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' }} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '15px', overflow: 'hidden' }}>
                                            <span style={{ fontWeight: isActive ? 'bold' : 'normal', color: isActive ? '#9B51E0' : '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{track.title}</span>
                                            <span style={{ fontSize: '12px', color: '#888', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{track.artist}</span>
                                        </div>
                                        <button style={{ background: 'none', border: 'none', padding: '10px', display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); toggleLike(track); }}>
                                            <Heart size={20} fill="#FF2A54" color="#FF2A54" />
                                        </button>
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <form onSubmit={handleCreatePlaylist} style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Новый плейлист..."
                                value={newPlaylistName}
                                onChange={(e) => setNewPlaylistName(e.target.value)}
                                style={{ flex: 1, height: '46px', borderRadius: '12px', backgroundColor: '#1a1a24', border: '1px solid #2a2a35', color: '#fff', padding: '0 15px', outline: 'none' }}
                            />
                            <button type="submit" style={{ height: '46px', padding: '0 20px', borderRadius: '12px', backgroundColor: '#9B51E0', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                                <Plus size={20} />
                            </button>
                        </form>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '15px' }}>
                            {myPlaylists.map(playlist => (
                                <div key={playlist.id} style={{ backgroundColor: '#1a1a24', borderRadius: '16px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #2a2a35' }}>
                                    <div style={{ width: '100%', aspectRatio: '1', backgroundColor: '#2a2a35', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Music size={32} color="#666" />
                                    </div>
                                    <div style={{ fontWeight: 'bold', fontSize: '14px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{playlist.name}</div>
                                    <div style={{ color: '#666', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>{playlist.tracks.length} треков</span>
                                        <button onClick={() => deletePlaylist(playlist.id)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '5px' }}>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}