// src/services/YouTubeService.js
import YouTubeVideo from '../models/YouTubeVideo';
import StorageService from './StorageService';

class YouTubeService {
  constructor(apiKey) {
    // In a production app, this would be securely stored
    this.apiKey = import.meta.env.VITE_YOUTUBE_API_KEY || '';
    this.storageService = StorageService;
  }

  async getVideoInfo(videoUrl) {
    const videoId = YouTubeVideo.getVideoIdFromUrl(videoUrl);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // Check if we already have this video cached
    const cachedVideos = await this.storageService.getAll('videos');
    const existingVideo = cachedVideos.find(video => video.videoId === videoId);
    
    if (existingVideo) {
      return YouTubeVideo.fromJSON(existingVideo);
    }
    
    // If API key is not available, create a video with basic info
    if (!this.apiKey) {
      console.warn('YouTube API key not set. Using basic video info.');
      const video = new YouTubeVideo({
        videoId,
        title: 'YouTube Video',
        channelTitle: 'Unknown Channel',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        description: '',
        publishedAt: new Date()
      });
      
      return video;
    }

    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet&key=${this.apiKey}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const snippet = data.items[0].snippet;
        
        const video = new YouTubeVideo({
          videoId,
          title: snippet.title,
          channelTitle: snippet.channelTitle,
          thumbnailUrl: snippet.thumbnails.high.url,
          description: snippet.description,
          publishedAt: new Date(snippet.publishedAt)
        });
        
        return video;
      } else {
        throw new Error('Video not found');
      }
    } catch (error) {
      console.error('Error fetching YouTube video info:', error);
      
      // Fallback to basic info on error
      const video = new YouTubeVideo({
        videoId,
        title: 'YouTube Video',
        channelTitle: 'Unknown Channel',
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        description: '',
        publishedAt: new Date()
      });
      
      return video;
    }
  }

  async getVideoById(videoId) {
    try {
      const video = await this.storageService.get('videos', videoId);
      return video ? YouTubeVideo.fromJSON(video) : null;
    } catch (error) {
      console.error('Error getting video by ID:', error);
      return null;
    }
  }

  async linkVideoToRecipe(recipeId, videoData) {
    try {
      const video = new YouTubeVideo({
        ...videoData,
        recipeId
      });
      
      await this.storageService.set('videos', video.toJSON());
      return video;
    } catch (error) {
      console.error('Error linking video to recipe:', error);
      throw error;
    }
  }

  async getLinkedVideos(recipeId) {
    try {
      const allVideos = await this.storageService.getAll('videos');
      const linkedVideos = allVideos.filter(video => video.recipeId === recipeId);
      return linkedVideos.map(video => YouTubeVideo.fromJSON(video));
    } catch (error) {
      console.error('Error getting linked videos:', error);
      return [];
    }
  }

  async removeVideoFromRecipe(recipeId, videoId) {
    try {
      const video = await this.getVideoById(videoId);
      
      if (video && video.recipeId === recipeId) {
        await this.storageService.remove('videos', videoId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error removing video from recipe:', error);
      return false;
    }
  }
}

export default new YouTubeService();