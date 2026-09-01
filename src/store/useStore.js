import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// BroadcastChannel для синхронизации между вкладками
let broadcastChannel = null;

try {
    broadcastChannel = new BroadcastChannel('rushe-player');
} catch (e) {
    console.warn('BroadcastChannel not supported');
}

export const useStore = create(
    persist(
        (set, get) => ({
            // Профиль
            userProfile: { name: '', avatar: '', email: '' },
            hasCompletedOnboarding: false,
            favoriteGenres: [],
            searchQuery: '',
            searchHistory: [],

            setSearchQuery: (query) => set({ searchQuery: query }),

            addToSearchHistory: (query) => {
                const { searchHistory } = get();
                const filtered = searchHistory.filter(item => item !== query);
                set({ searchHistory: [query, ...filtered].slice(0, 10) });
            },

            completeOnboarding: (name, avatar, genres, email = '') => set({
                userProfile: { name, avatar, email },
                hasCompletedOnboarding: true,
                favoriteGenres: genres
            }),

            // Плеер
            currentTrack: null,
            queue: [],
            isPlaying: false,
            volume: 0.8,
            isFullscreenPlayerOpen: false,
            currentTime: 0,
            duration: 0,

            playTrack: (track, queue = []) => {
                const newState = {
                    currentTrack: track,
                    queue: queue.length > 0 ? queue : [track],
                    isPlaying: true,
                    isFullscreenPlayerOpen: true,
                    currentTime: 0,
                    duration: 0
                };
                set(newState);

                // Отправляем в другие вкладки
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'PLAY_TRACK',
                        data: { track, queue: newState.queue }
                    });
                }
            },

            setIsPlaying: (isPlaying) => {
                set({ isPlaying });
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'SET_PLAYING',
                        data: { isPlaying }
                    });
                }
            },

            setVolume: (volume) => {
                set({ volume });
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'SET_VOLUME',
                        data: { volume }
                    });
                }
            },

            updateTime: (currentTime, duration) => {
                set({ currentTime, duration });
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'UPDATE_TIME',
                        data: { currentTime, duration }
                    });
                }
            },

            toggleFullscreenPlayer: () => set((state) => ({
                isFullscreenPlayerOpen: !state.isFullscreenPlayerOpen
            })),

            closeFullscreenPlayer: () => set({ isFullscreenPlayerOpen: false }),

            playNext: () => {
                const { currentTrack, queue } = get();
                if (!currentTrack || queue.length <= 1) return;

                const currentIndex = queue.findIndex(t => t.id === currentTrack.id);

                if (currentIndex !== -1 && currentIndex + 1 < queue.length) {
                    const nextTrack = queue[currentIndex + 1];
                    const newState = { currentTrack: nextTrack, isPlaying: true, currentTime: 0 };
                    set(newState);
                    if (broadcastChannel) {
                        broadcastChannel.postMessage({
                            type: 'PLAY_TRACK',
                            data: { track: nextTrack, queue }
                        });
                    }
                } else {
                    const sameArtistTracks = queue.filter(t =>
                        t.artist === currentTrack.artist && t.id !== currentTrack.id
                    );
                    if (sameArtistTracks.length > 0) {
                        const randomTrack = sameArtistTracks[Math.floor(Math.random() * sameArtistTracks.length)];
                        const newState = { currentTrack: randomTrack, isPlaying: true, currentTime: 0 };
                        set(newState);
                        if (broadcastChannel) {
                            broadcastChannel.postMessage({
                                type: 'PLAY_TRACK',
                                data: { track: randomTrack, queue }
                            });
                        }
                    }
                }
            },

            // Библиотека
            likedTracks: [],
            myPlaylists: [],

            toggleLike: (track) => {
                const { likedTracks } = get();
                const exists = likedTracks.find(t => t.id === track.id);
                if (exists) {
                    set({ likedTracks: likedTracks.filter(t => t.id !== track.id) });
                } else {
                    set({ likedTracks: [...likedTracks, track] });
                }
                if (broadcastChannel) {
                    broadcastChannel.postMessage({
                        type: 'TOGGLE_LIKE',
                        data: { track, liked: !exists }
                    });
                }
            },

            createPlaylist: (name) => set((state) => ({
                myPlaylists: [...state.myPlaylists, {
                    id: Date.now().toString(),
                    name,
                    tracks: [],
                    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80'
                }]
            })),

            deletePlaylist: (playlistId) => set((state) => ({
                myPlaylists: state.myPlaylists.filter(pl => pl.id !== playlistId)
            })),

            addTrackToPlaylist: (playlistId, track) => set((state) => ({
                myPlaylists: state.myPlaylists.map(pl => {
                    if (pl.id === playlistId && !pl.tracks.find(t => t.id === track.id)) {
                        return { ...pl, tracks: [...pl.tracks, track] };
                    }
                    return pl;
                })
            })),

            removeTrackFromPlaylist: (playlistId, trackId) => set((state) => ({
                myPlaylists: state.myPlaylists.map(pl => {
                    if (pl.id === playlistId) {
                        return { ...pl, tracks: pl.tracks.filter(t => t.id !== trackId) };
                    }
                    return pl;
                })
            }))
        }),
        { name: 'rushe-storage' }
    )
);

// Синхронизация между вкладками
if (broadcastChannel) {
    broadcastChannel.onmessage = (event) => {
        const { type, data } = event.data;
        const currentState = useStore.getState();

        switch (type) {
            case 'PLAY_TRACK':
                if (data.track) {
                    useStore.setState({
                        currentTrack: data.track,
                        queue: data.queue || [data.track],
                        isPlaying: true,
                        currentTime: 0
                    });
                }
                break;

            case 'SET_PLAYING':
                useStore.setState({ isPlaying: data.isPlaying });
                break;

            case 'SET_VOLUME':
                useStore.setState({ volume: data.volume });
                break;

            case 'UPDATE_TIME':
                useStore.setState({
                    currentTime: data.currentTime,
                    duration: data.duration
                });
                break;

            case 'TOGGLE_LIKE':
                const { likedTracks } = useStore.getState();
                if (data.liked) {
                    useStore.setState({
                        likedTracks: [...likedTracks, data.track]
                    });
                } else {
                    useStore.setState({
                        likedTracks: likedTracks.filter(t => t.id !== data.track.id)
                    });
                }
                break;
        }
    };
}