// Конфигурация YouTube API
export const YOUTUBE_API_KEY =
    import.meta.env.VITE_YOUTUBE_API_KEY ||
    import.meta.env.YOUTUBE_API_KEY ||
    '';

export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Кэш для треков
const cache = new Map();

export async function searchYouTubeTracks(query, maxResults = 30) {
    const cacheKey = `${query}_${maxResults}`;

    // Проверяем кэш
    if (cache.has(cacheKey)) {
        console.log('📦 Из кэша:', query);
        return cache.get(cacheKey);
    }

    console.log('🔑 API Key:', YOUTUBE_API_KEY ? '✅ Найден' : '❌ НЕ НАЙДЕН');
    console.log('🔍 Поиск:', query);

    if (!YOUTUBE_API_KEY) {
        console.error('❌ YouTube API key не найден!');
        return DEMO_TRACKS;
    }

    try {
        const response = await fetch(
            `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ YouTube API Error:', errorData);
            return DEMO_TRACKS;
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            console.log('😕 Ничего не найдено');
            return [];
        }

        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const videoDetails = await getVideoDetails(videoIds);

        const tracks = data.items.map((item, index) => {
            const details = videoDetails[index] || {};
            return {
                id: item.id.videoId,
                title: item.snippet.title,
                artist: item.snippet.channelTitle,
                description: item.snippet.description,
                cover: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
                videoId: item.id.videoId,
                duration: details.duration || 0,
                time: formatDuration(details.duration || 0),
                audioUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                embedUrl: `https://www.youtube.com/embed/${item.id.videoId}`
            };
        });

        // Сохраняем в кэш
        cache.set(cacheKey, tracks);
        console.log(`✅ Найдено ${tracks.length} треков`);
        return tracks;
    } catch (error) {
        console.error('❌ YouTube search error:', error);
        return DEMO_TRACKS;
    }
}

async function getVideoDetails(videoIds) {
    try {
        const response = await fetch(
            `${YOUTUBE_API_BASE}/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) return [];
        const data = await response.json();

        return data.items.map(item => ({
            duration: parseDuration(item.contentDetails.duration)
        }));
    } catch (error) {
        console.error('Error fetching video details:', error);
        return [];
    }
}

function parseDuration(duration) {
    if (!duration) return 0;
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 3600 + minutes * 60 + seconds;
}

export function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

export const DEMO_TRACKS = [
    { id: 'demo1', title: 'Midnight City', artist: 'M83', time: '4:03', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: 243, isDemo: true },
    { id: 'demo2', title: 'Starboy', artist: 'The Weeknd', time: '3:50', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=100&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: 230, isDemo: true },
    { id: 'demo3', title: 'Blinding Lights', artist: 'The Weeknd', time: '3:20', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: 200, isDemo: true },
    { id: 'demo4', title: 'Believer', artist: 'Imagine Dragons', time: '3:24', cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', duration: 204, isDemo: true },
    { id: 'demo5', title: 'Radioactive', artist: 'Imagine Dragons', time: '3:06', cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=100&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', duration: 186, isDemo: true },
];

// Популярные чарты для главной
export const CHARTS = [
    { id: 'chart1', title: '🔥 Топ 100 мира', icon: '🌍' },
    { id: 'chart2', title: '🎵 Поп-хиты', icon: '🎤' },
    { id: 'chart3', title: '💃 Танцевальные', icon: '🕺' },
    { id: 'chart4', title: '🎸 Рок легенды', icon: '🎸' },
    { id: 'chart5', title: '🎹 Инструментал', icon: '🎹' },
];

// Популярные плейлисты для главной
export const PLAYLISTS = [
    { id: 'pl1', title: 'Утренний кофе', cover: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tracks: 45 },
    { id: 'pl2', title: 'Вечерний релакс', cover: 'https://images.unsplash.com/photo-1471180625745-944903837c22?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tracks: 32 },
    { id: 'pl3', title: 'Для тренировок', cover: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tracks: 28 },
    { id: 'pl4', title: 'Романтический', cover: 'https://images.unsplash.com/reserve/Af0sF2OS5S5gatqrKzVP_Silhoutte.jpg?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tracks: 19 },
];