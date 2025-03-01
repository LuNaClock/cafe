// src/models/YouTubeVideo.js
class YouTubeVideo {
  constructor(videoData = {}) {
    this.id = videoData.id || crypto.randomUUID();
    this.recipeId = videoData.recipeId || '';
    this.videoId = videoData.videoId || '';
    this.title = videoData.title || '';
    this.channelTitle = videoData.channelTitle || '';
    this.thumbnailUrl = videoData.thumbnailUrl || '';
    this.description = videoData.description || '';
    this.publishedAt = videoData.publishedAt || new Date();
  }

  toJSON() {
    return {
      id: this.id,
      recipeId: this.recipeId,
      videoId: this.videoId,
      title: this.title,
      channelTitle: this.channelTitle,
      thumbnailUrl: this.thumbnailUrl,
      description: this.description,
      publishedAt: this.publishedAt
    };
  }

  static fromJSON(json) {
    return new YouTubeVideo({
      ...json,
      publishedAt: new Date(json.publishedAt)
    });
  }

  getEmbedUrl() {
    return `https://www.youtube.com/embed/${this.videoId}`;
  }

  static getVideoIdFromUrl(url) {
    let videoId = '';
    const ytRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i;
    const match = url.match(ytRegex);
    
    if (match && match[1]) {
      videoId = match[1];
    }
    
    return videoId;
  }
}

export default YouTubeVideo;