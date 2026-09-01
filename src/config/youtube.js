// Конфигурация YouTube API
export const YOUTUBE_API_KEY =
    import.meta.env.VITE_YOUTUBE_API_KEY ||
    import.meta.env.YOUTUBE_API_KEY ||
    '';

export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Кэш для треков
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

export async function searchYouTubeTracks(query, maxResults = 30) {
    const cacheKey = `${query}_${maxResults}`;

    // Проверяем кэш
    if (cache.has(cacheKey)) {
        const cached = cache.get(cacheKey);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log('📦 Из кэша:', query);
            return cached.data;
        } else {
            cache.delete(cacheKey);
        }
    }

    if (!YOUTUBE_API_KEY) {
        console.error('❌ YouTube API key не найден!');
        return [];
    }

    try {
        const response = await fetch(
            `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ YouTube API Error:', errorData);
            return [];
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
        cache.set(cacheKey, {
            data: tracks,
            timestamp: Date.now()
        });

        console.log(`✅ Найдено ${tracks.length} треков`);
        return tracks;
    } catch (error) {
        console.error('❌ YouTube search error:', error);
        return [];
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

function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

// Чарты для главной
export const CHARTS = [
    { id: 'chart1', title: 'Топ 100 мира' },
    { id: 'chart2', title: 'Поп-хиты' },
    { id: 'chart3', title: 'Танцевальные' },
    { id: 'chart4', title: 'Рок легенды' },
    { id: 'chart5', title: 'Инструментал' },
];

// Плейлисты для главной - с правильными путями к картинкам
export const PLAYLISTS = [
    { id: 'pl1', title: 'Утренний кофе', cover: '/coffee.jpeg', tracks: 45 },
    { id: 'pl2', title: 'Вечерний релакс', cover: '/night.jpeg', tracks: 32 },
    { id: 'pl3', title: 'Для тренировок', cover: '/sport.jpeg', tracks: 28 },
    { id: 'pl4', title: 'Романтический', cover: '/love.jpeg', tracks: 19 },
];