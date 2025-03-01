// src/components/YouTube/YouTubePreview.jsx
import React, { useState } from 'react';

const YouTubePreview = ({ video }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  if (!video || !video.videoId) {
    return null;
  }

  const handleThumbnailClick = () => {
    setShowVideo(true);
  };

  return (
    <div className="w-full rounded-lg overflow-hidden">
      {!showVideo ? (
        <div 
          className="relative cursor-pointer group"
          onClick={handleThumbnailClick}
        >
          <img 
            src={video.thumbnailUrl || `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
            alt={video.title || 'YouTube video thumbnail'}
            className="w-full h-auto object-cover rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-opacity">
            <div className="bg-red-600 rounded-full p-3 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2">
            <h4 className="text-white text-sm font-medium line-clamp-2">{video.title}</h4>
            {video.channelTitle && (
              <p className="text-gray-300 text-xs mt-1">{video.channelTitle}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="relative pb-[56.25%] h-0 overflow-hidden">
          <iframe 
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            src={`${video.getEmbedUrl ? video.getEmbedUrl() : `https://www.youtube.com/embed/${video.videoId}`}?autoplay=1`}
            title={video.title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default YouTubePreview;