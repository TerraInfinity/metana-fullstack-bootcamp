import React, { useState, useEffect } from 'react';
import { FaComments } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Import Link
import axios from 'axios'; // Import Axios

/**
 * BlogPostCard component displays a blog post with its details including title, author, date, and media.
 *
 * @param {Object} props - The props for the component.
 * @param {string} props.id - The unique identifier for the blog post.
 * @param {string} [props.category=''] - The category of the blog post.
 * @param {string} [props.title='Untitled'] - The title of the blog post.
 * @param {Object} [props.author={ name: 'Unknown Author' }] - The author of the blog post, including their name and logo.
 * @param {string|null} [props.date=null] - The publication date of the blog post, formatted as a string.
 * @param {string|null} [props.imageUrl=null] - The URL of the blog post image, used as a fallback if no video is available.
 * @param {boolean} [props.isAgeRestricted=false] - Indicates if the content is age-restricted (true/false).
 * @param {string|null} [props.videoUrl=null] - The URL of the video associated with the blog post, if any.
 * @param {string|null} [props.audioUrl=null] - The URL of the audio associated with the blog post, if any.
 * @param {string} [props.blogSummary=''] - A brief summary of the blog post content.
 * @param {Object|null} [props.pathId=null] - An object containing path information, used for navigation.
 * @param {Array} [props.blogComments=[]] - An array of comments related to the blog post, used to display comment count.
 */
const BlogPostCard = ({
  id, // Accept id as a prop to uniquely identify the blog post
  category = '', // Default category is an empty string
  title = 'Untitled', // Default title if none is provided
  author = { name: 'Unknown Author' }, // Default author object with a name
  date = null, // Default date is null if not provided
  imageUrl = null, // Default image URL is null if not provided
  isAgeRestricted = false, // Default age restriction is false
  videoUrl = null, // Default video URL is null if not provided
  audioUrl = null, // Default audio URL is null if not provided
  blogSummary = '', // Default blog summary is an empty string
  pathId = null, // Default pathId is null if not provided
  blogComments = [] // Default comments array is empty
}) => {
  // Placeholder logo for the author, used if no logo is provided
  const placeholderLogo = '/assets/images/logo.png';
  
  // Determine media type based on available URLs (video or audio)
  const mediaType = videoUrl ? 'Video' : audioUrl ? 'Audio' : null;

  // State to manage image source and fetch type
  const [imgSrc, setImgSrc] = useState(null); // State for the image source
  const [fetchType, setFetchType] = useState(null); // State for the type of fetch ('youtube', 'twitter', 'other')

  // Effect to determine initial image source and fetch type based on videoUrl
  useEffect(() => {
    if (videoUrl) {
      const youtubeId = getYouTubeID(videoUrl); // Extract YouTube ID if video URL is provided
      if (youtubeId) {
        setImgSrc(`https://img.youtube.com/vi/${youtubeId}/0.jpg`); // Set image source to YouTube thumbnail
        setFetchType('youtube'); // Set fetch type to YouTube
      } else {
        setFetchType('other'); // Set fetch type to other if not a YouTube URL
      }
    } else {
      setImgSrc(imageUrl); // Use provided image URL if no video URL is available
    }
  }, [videoUrl, imageUrl]);

  // Define API URL using environment variable for fetching thumbnails
  const apiPort = process.env.REACT_APP_BACKEND_PORT; // Get backend port from environment variables
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/`; // Construct API URL
  
  // Effect to fetch thumbnails for other platforms if needed
  useEffect(() => {
    if (fetchType === 'other') {
      const fullUrl = `${apiUrl}proxy-thumbnail?url=${encodeURIComponent(videoUrl)}`; // Construct full URL for fetching thumbnail
      axios.get(fullUrl)
        .then((response) => {
          const thumbnail = response.data.thumbnail; // Get thumbnail from response
          setImgSrc(thumbnail || imageUrl); // Set image source to fetched thumbnail or fallback to imageUrl
        })
        .catch(() => {
          setImgSrc(imageUrl); // Fallback to imageUrl on error
        });
    }
  }, [fetchType, videoUrl, imageUrl, apiUrl]);

  // Handle image load failure and fallback logic
  const handleImageError = () => {
    // Log the current image source for debugging
    if (imageUrl && imgSrc !== imageUrl) {
      setImgSrc(imageUrl); // Fall back to image URL if available
    } else {
      setImgSrc(null); // Set imgSrc to null if no valid image source is available
    }
  };

  return (
    <Link to={`/blog/${id}`} className="overflow-hidden rounded-lg bg-slate-800 shadow-md" id={`blog-post-link-${id}`}>
      {/* Image Container */}
      <div className="relative h-[200px] w-full" id={`blog-media-container-${id}`}>
        {imgSrc && (
          <img
            src={imgSrc}
            alt="Blog post thumbnail"
            className="absolute inset-0 w-full h-full object-fill"
            onError={handleImageError}
            id={`blog-post-image-${id}`}
          />
        )}
        {category && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-blue-500 rounded text-white" id={`blog-category-${id}`}>
            {category}
          </div>
        )}
        {isAgeRestricted && (
          <div className="absolute top-4 right-4 text-red-500" id={`age-restricted-label-${id}`}>18+</div>
        )}
      </div>
      {/* Content Container */}
      <div className="p-4" id={`blog-content-container-${id}`}>
        {/* Blog title */}
        <h3 className="text-white text-xl font-semibold mb-2 truncate" id={`blog-title-${id}`}>{title}</h3>
        {/* Author and date information */}
        <div className="flex items-center mb-2" id={`author-info-container-${id}`}>
          <img
            src={author?.logo || placeholderLogo}
            alt="Author logo"
            className="w-10 h-10 rounded-full object-cover mr-3"
            id={`author-logo-${id}`} // ID for the author logo
          />
          <div>
            <div className="text-white truncate" id={`author-name-${id}`}>{author?.name || 'Unknown Author'}</div>
            {date && (
              <div className="text-gray-400 text-sm" id={`blog-date-${id}`}>
                {new Date(date).toLocaleDateString()} {/* Format date for display */}
              </div>
            )}
          </div>
        </div>
        {/* Blog summary */}
        {blogSummary && (
          <p className="text-gray-300 mb-2 line-clamp-2" id={`blog-summary-${id}`}>{blogSummary}</p>
        )}
        {/* Path information if available */}
        {pathId?.name && (
          <div className="text-gray-300 text-sm mb-2" id={`path-id-${id}`}>{pathId.name}</div>
        )}
        {/* Media type and comments count */}
        <div className="flex justify-between items-center text-sm" id={`blog-footer-${id}`}>
          {mediaType && (
            <div className="text-white" id={`media-type-${id}`}>{mediaType}</div>
          )}
          {blogComments?.length > 0 && (
            <div className="text-white flex items-center" id={`comments-count-${id}`}>
              <FaComments className="mr-1" /> {blogComments.length} {/* Display comment count */}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

// Helper function to extract YouTube video ID from URL
const getYouTubeID = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export default BlogPostCard;