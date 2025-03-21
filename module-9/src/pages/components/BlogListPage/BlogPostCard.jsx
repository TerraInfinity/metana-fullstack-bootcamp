import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link
import axios from 'axios'; // Import Axios


// Helper function to extract YouTube video ID from URL
const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Helper function to fetch Twitter thumbnail using oEmbed API
const fetchTwitterThumbnail = async (tweetUrl) => {
  try {
    const response = await fetch(`https://publish.twitter.com/oembed?url=${tweetUrl}`);
    const data = await response.json();
    return data.thumbnail_url || null; // Returns thumbnail URL or null if unavailable
  } catch (error) {
    console.error('Error fetching Twitter thumbnail:', error);
    return null;
  }
};

// Helper function to determine the initial image source or platform type
const getInitialImageSource = (videoUrl, imageUrl) => {
  if (videoUrl) {
    // YouTube
    const youtubeId = getYouTubeID(videoUrl);
    if (youtubeId) {
      const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
      console.log(`Detected YouTube video thumbnail: ${thumbnailUrl}`);
      return thumbnailUrl;
    }
    // Twitter
    if (videoUrl.includes('twitter.com') || videoUrl.includes('x.com')) {
      console.log(`Detected Twitter URL: ${videoUrl}`);
      return 'twitter'; // Placeholder to trigger async fetch
    }
    // Other platforms (e.g., Omniflix)
    console.log(`Using video URL directly for other platform: ${videoUrl}`);
    return videoUrl;
  }
  // Fallback to imageUrl if no videoUrl
  console.log(`No video URL provided, using image URL: ${imageUrl}`);
  return imageUrl;
};

// Helper function to extract pic.twitter.com URL from HTML
const extractTwitterImageUrl = (html) => {
  const match = html.match(/pic\.twitter\.com\/[a-zA-Z0-9]+/);
  return match ? `https://${match[0]}` : null;
};

const BlogPostCard = ({
  id, // Accept id as a prop
  category = '',
  title = 'Untitled',
  author = { name: 'Unknown Author' },
  date = null,
  imageUrl = null,
  isAgeRestricted = false,
  videoUrl = null,
  audioUrl = null,
  blogSummary = '',
  pathId = null,
  blogComments = []
}) => {
  const placeholderLogo = '/assets/images/logo.png';
  const mediaType = videoUrl ? 'Video' : audioUrl ? 'Audio' : null;
  
  const [imgSrc, setImgSrc] = useState(null);
  const [fetchType, setFetchType] = useState(null); // 'youtube', 'twitter', 'other'

  // Determine initial image source and fetch type
  useEffect(() => {
    if (videoUrl) {
      const youtubeId = getYouTubeID(videoUrl);
      if (youtubeId) {
        setImgSrc(`https://img.youtube.com/vi/${youtubeId}/0.jpg`);
        setFetchType('youtube');
        //console.log(`Detected YouTube video thumbnail: https://img.youtube.com/vi/${youtubeId}/0.jpg`);
      } else {
        setFetchType('other');
        //console.log(`Detected other platform URL: ${videoUrl}`);
      }
    } else {
      setImgSrc(imageUrl);
      console.log(`No video URL provided, using image URL: ${imageUrl}`);
    }
  }, [videoUrl, imageUrl]);

  // Define API URL using environment variable
  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/`;
  
  // Fetch thumbnails for other platforms
  useEffect(() => {
    if (fetchType === 'other') {
      const fullUrl = `${apiUrl}proxy-thumbnail?url=${encodeURIComponent(videoUrl)}`;
      axios.get(fullUrl)
        .then((response) => {
          const thumbnail = response.data.thumbnail;
          setImgSrc(thumbnail || imageUrl);
        })
        .catch(() => {
          // Handle error gracefully without logging to console
          // Default back to imageUrl on error
          setImgSrc(imageUrl);
        });
    }
  }, [fetchType, videoUrl, imageUrl, apiUrl]);

  // Handle image load failure
  const handleImageError = () => {
    console.log(`Image failed to load. Current source: ${imgSrc}`);
    // If videoUrl fails and imageUrl is available, fall back to imageUrl
    if (imageUrl && imgSrc !== imageUrl) {
      console.log(`Falling back to image URL: ${imageUrl}`);
      setImgSrc(imageUrl);
    } else {
      // If imageUrl is also unavailable or fails, set to null (no image)
      console.log(`No valid image source available, setting imgSrc to null.`);
      setImgSrc(null);
    }
  };

  return (
    <Link to={`/blog/${id}`} className="overflow-hidden rounded-lg bg-slate-800 shadow-md"> {/* Wrap in Link */}
      {/* Image Container */}
      <div className="relative h-[200px] w-full">
        {imgSrc && (
          <img
            src={imgSrc}
            alt="Blog post thumbnail"
            className="absolute inset-0 w-full h-full object-fill"
            onError={handleImageError}
          />
        )}
        {category && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-blue-500 rounded text-white">
            {category}
          </div>
        )}
        {isAgeRestricted && (
          <div className="absolute top-4 right-4 text-red-500">18+</div>
        )}
      </div>
      {/* Content Container */}
      <div className="p-4">
        <h3 className="text-white text-xl font-semibold mb-2 truncate">{title}</h3>
        <div className="flex items-center mb-2">
          <img
            src={author?.logo || placeholderLogo}
            alt="Author logo"
            className="w-10 h-10 rounded-full object-cover mr-3"
          />
          <div>
            <div className="text-white truncate">{author?.name || 'Unknown Author'}</div>
            {date && (
              <div className="text-gray-400 text-sm">
                {new Date(date).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        {blogSummary && (
          <p className="text-gray-300 mb-2 line-clamp-2">{blogSummary}</p>
        )}
        {pathId?.name && (
          <div className="text-gray-300 text-sm mb-2">{pathId.name}</div>
        )}
        <div className="flex justify-between items-center text-sm">
          {mediaType && (
            <div className="text-white">{mediaType}</div>
          )}
          {blogComments?.length > 0 && (
            <div className="text-white flex items-center">
              <FaComments className="mr-1" /> {blogComments.length}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BlogPostCard;