import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
    persist(
        (set, get) => ({
            // --- ОНБОРДИНГ И ПРОФИЛЬ ---
            hasCompletedOnboarding: false,
            favoriteGenres: [],
            completeOnboarding: (genres) => set({
                hasCompletedOnboarding: true,
                favoriteGenres: genres
            }),

            // --- ПЛЕЕР ---
            currentTrack: null,     // Текущий играющий трек { id, title, artist, cover, videoId }
            queue: [],              // Очередь воспроизведения
            isPlaying: false,       // Состояние пауза/плей
            volume: 0.8,            // Громкость (от 0 до 1)

            playTrack: (track, queue = []) => set({
                currentTrack: track,
                queue: queue.length > 0 ? queue : [track],
                isPlaying: true
            }),

            setIsPlaying: (isPlaying) => set({ isPlaying }),

            setVolume: (volume) => set({ volume }),

            playNext: () => {
                const { currentTrack, queue } = get();
                if (!currentTrack || queue.length <= 1) return;

                const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
                const nextIndex = currentIndex + 1;

                if (nextIndex < queue.length) {
                    set({ currentTrack: queue[nextIndex], isPlaying: true });
                }
            },

            playPrevious: () => {
                const { currentTrack, queue } = get();
                if (!currentTrack || queue.length <= 1) return;

                const currentIndex = queue.findIndex(t => t.id === currentTrack.id);
                const prevIndex = currentIndex - 1;

                if (prevIndex >= 0) {
                    set({ currentTrack: queue[prevIndex], isPlaying: true });
                }
            },

            // --- БИБЛИОТЕКА (ЛАЙКИ И ПЛЕЙЛИСТЫ) ---
            likedTracks: [],
            myPlaylists: [
                { id: '1', name: 'Мой первый плейлист', tracks: [] } // Дефолтный плейлист
            ],

            toggleLike: (track) => {
                const { likedTracks } = get();
                const exists = likedTracks.find(t => t.id === track.id);
                if (exists) {
                    // Если трек уже лайкнут — удаляем
                    set({ likedTracks: likedTracks.filter(t => t.id !== track.id) });
                } else {
                    // Иначе добавляем
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
                    if (pl.id === playlistId) {
                        // Проверка, чтобы не добавлять дубликаты
                        const trackExists = pl.tracks.find(t => t.id === track.id);
                        if (trackExists) return pl;
                        return { ...pl, tracks: [...pl.tracks, track] };
                    }
                    return pl;
                })
            }))
        }),
        {
            name: 'rushe-storage', // Ключ, по которому данные сохраняются в localStorage браузера
        }
    )
);