import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set, get) => ({
            userProfile: { name: '', avatar: '', email: '' },
            hasCompletedOnboarding: false,
            favoriteGenres: [],
            searchQuery: '',

            setSearchQuery: (query) => set({ searchQuery: query }),

            completeOnboarding: (name, avatar, genres, email = '') => set({
                userProfile: { name, avatar, email },
                hasCompletedOnboarding: true,
                favoriteGenres: genres
            }),

            currentTrack: null,
            queue: [],
            isPlaying: false,
            volume: 0.8,

            playTrack: (track, queue = []) => {
                console.log('Playing track:', track);
                set({
                    currentTrack: track,
                    queue: queue.length > 0 ? queue : [track],
                    isPlaying: true
                });
            },

            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setVolume: (volume) => set({ volume }),

            playNext: () => {
                const { currentTrack, queue } = get();
                if (!currentTrack || queue.length <= 1) return;
                const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
                if (currentIndex + 1 < queue.length) {
                    set({ currentTrack: queue[currentIndex + 1], isPlaying: true });
                }
            },

            playPrevious: () => {
                const { currentTrack, queue } = get();
                if (!currentTrack || queue.length <= 1) return;
                const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
                if (currentIndex - 1 >= 0) {
                    set({ currentTrack: queue[currentIndex - 1], isPlaying: true });
                }
            },

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
                myPlaylists: [...state.myPlaylists, { id: Date.now().toString(), name, tracks: [] }]
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
            }))
        }),
        { name: 'rushe-storage' }
    )
);