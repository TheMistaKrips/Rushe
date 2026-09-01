import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

            // Общее состояние плеера для синхронизации
            currentTime: 0,
            duration: 0,
            playerInstance: null, // Ссылка на YouTube плеер
            isPlayerReady: false,

            // Установка плеера (вызывается из компонента)
            setPlayerInstance: (player) => set({ playerInstance: player, isPlayerReady: true }),

            // Обновление времени (вызывается из плеера)
            updateTime: (time, duration) => set({ currentTime: time, duration: duration }),

            playTrack: (track, queue = []) => {
                console.log('▶️ Playing track:', track.title);
                set({
                    currentTrack: track,
                    queue: queue.length > 0 ? queue : [track],
                    isPlaying: true,
                    isFullscreenPlayerOpen: true,
                    currentTime: 0,
                    duration: 0
                });
            },

            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setVolume: (volume) => set({ volume }),
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
                    set({ currentTrack: nextTrack, isPlaying: true, currentTime: 0 });
                } else {
                    const sameArtistTracks = queue.filter(t =>
                        t.artist === currentTrack.artist && t.id !== currentTrack.id
                    );
                    if (sameArtistTracks.length > 0) {
                        const randomTrack = sameArtistTracks[Math.floor(Math.random() * sameArtistTracks.length)];
                        set({ currentTrack: randomTrack, isPlaying: true, currentTime: 0 });
                    } else if (queue.length > 0) {
                        set({ currentTrack: queue[0], isPlaying: true, currentTime: 0 });
                    }
                }
            },

            playPrevious: () => {
                const { currentTrack, queue } = get();
                if (!currentTrack || queue.length <= 1) return;
                const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
                if (currentIndex - 1 >= 0) {
                    set({ currentTrack: queue[currentIndex - 1], isPlaying: true, currentTime: 0 });
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