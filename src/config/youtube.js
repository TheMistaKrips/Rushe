// Конфигурация YouTube API
// Получаем ключ из разных источников для совместимости с Vercel
export const YOUTUBE_API_KEY =
    import.meta.env.VITE_YOUTUBE_API_KEY ||
    import.meta.env.YOUTUBE_API_KEY ||
    import.meta.env.NEXT_PUBLIC_YOUTUBE_API_KEY ||
    '';

export const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Функция для поиска треков на YouTube
export async function searchYouTubeTracks(query, maxResults = 30) {
    if (!YOUTUBE_API_KEY) {
        console.error('YouTube API key не найден!');
        return DEMO_TRACKS;
    }

    try {
        const response = await fetch(
            `${YOUTUBE_API_BASE}/search?part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('YouTube API Error:', errorData);
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
            return [];
        }

        // Получаем дополнительные данные о видео (длительность)
        const videoIds = data.items.map(item => item.id.videoId).join(',');
        const videoDetails = await getVideoDetails(videoIds);

        return data.items.map((item, index) => {
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
    } catch (error) {
        console.error('YouTube search error:', error);
        throw error;
    }
}

// Получение деталей видео (длительность и т.д.)
async function getVideoDetails(videoIds) {
    try {
        const response = await fetch(
            `${YOUTUBE_API_BASE}/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
            return [];
        }

        const data = await response.json();

        return data.items.map(item => ({
            duration: parseDuration(item.contentDetails.duration),
            durationRaw: item.contentDetails.duration
        }));
    } catch (error) {
        console.error('Error fetching video details:', error);
        return [];
    }
}

// Парсинг длительности из формата ISO 8601 (PT1H2M3S)
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

// Демо-треки на случай ошибки API
export const DEMO_TRACKS = [
    {
        id: 'demo1',
        title: 'Midnight City',
        artist: 'M83',
        time: '4:03',
        cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=100&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: 243,
        isDemo: true
    },
    {
        id: 'demo2',
        title: 'Starboy',
        artist: 'The Weeknd',
        time: '3:50',
        cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=100&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: 230,
        isDemo: true
    },
    {
        id: 'demo3',
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        time: '3:20',
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: 200,
        isDemo: true
    },
    {
        id: 'demo4',
        title: 'Believer',
        artist: 'Imagine Dragons',
        time: '3:24',
        cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=100&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        duration: 204,
        isDemo: true
    },
    {
        id: 'demo5',
        title: 'Radioactive',
        artist: 'Imagine Dragons',
        time: '3:06',
        cover: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?w=100&q=80',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        duration: 186,
        isDemo: true
    },
];