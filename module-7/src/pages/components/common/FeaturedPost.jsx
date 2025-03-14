import React, { useEffect, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';

/**
 * FeaturedPost Component
 * 
 * A carousel component that displays featured blog posts. It fetches thumbnails for videos,
 * handles automatic and manual navigation through the posts, and displays relevant information
 * such as the author, creation date, and media tags.
 * 
 * Props:
 * @param {Array} blogs - An array of blog objects to be displayed in the carousel.
 */
const getMediaTag = (blog) => {
  const hasVideo = blog.videoUrl && blog.videoUrl.trim() !== '';
  const hasAudio = blog.audioUrl && blog.audioUrl.trim() !== '';
  if (hasVideo && hasAudio) return 'Audio/Video';
  if (hasVideo) return 'Video';
  if (hasAudio) return 'Audio';
  return 'None';
};

const FeaturedPost = ({ blogs = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const placeholderLogo = '/assets/images/logo.png';
  const [thumbnails, setThumbnails] = useState({});
  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/`;

  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    const fetchThumbnails = async () => {
      const newThumbnails = {};
      if (!Array.isArray(blogs)) return;
      for (const blog of blogs) {
        if (blog.videoUrl) {
          const youtubeId = getYouTubeID(blog.videoUrl);
          if (youtubeId) {
            newThumbnails[blog.id] = `https://img.youtube.com/vi/${youtubeId}/0.jpg`;
          } else {
            try {
              const response = await axios.get(`${apiUrl}proxy-thumbnail?url=${encodeURIComponent(blog.videoUrl)}`);
              newThumbnails[blog.id] = response.data.thumbnail || blog.blogImage;
            } catch (error) {
              newThumbnails[blog.id] = blog.blogImage;
            }
          }
        } else {
          newThumbnails[blog.id] = blog.blogImage;
        }
      }
      if (JSON.stringify(newThumbnails) !== JSON.stringify(thumbnails)) {
        setThumbnails(newThumbnails);
      }
    };
    fetchThumbnails();
  }, [blogs, thumbnails]);

  if (!Array.isArray(blogs)) {
    console.error('FeaturedPost received invalid blogs prop:', blogs);
    return null;
  }

  blogs.forEach(blog => {
    if (!blog.id) {
      console.error('Blog is missing an id:', blog);
    }
  });

  useEffect(() => {
    if (blogs.length > 0 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [blogs, isPaused]);

  if (blogs.length === 0) {
    return null;
  }

  const currentBlog = blogs[currentIndex];
  if (!currentBlog) {
    console.error('Current blog is undefined at index:', currentIndex);
    return null;
  }

  const mediaTag = getMediaTag(currentBlog);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    setIsPaused(true); // Pause on manual interaction
  };

  return (
    <div className="relative mb-10">
      {/* Top Block: Blog Title and Summary */}
      <div className="p-4 bg-gray-800 text-white">
        <h2 className="text-3xl font-semibold">
          {currentBlog.title}
          <span className="text-gray-300"> - </span>
          <span className="text-gray-400 text-sm max-w-xs truncate" style={{ maxWidth: "calc(100% - 200px)" }}>
            {currentBlog.blogSummary}
          </span>
        </h2>
      </div>

      {/* Middle Block: Video Component */}
      <div className="w-screen">
        <img
          src={thumbnails[currentBlog.id] || currentBlog.blogImage}
          alt={currentBlog.title}
          className="w-full h-auto max-h-[35vh]"
        />
        <Link to={`/blog/${currentBlog.id}`} className="absolute inset-0">
          <span className="sr-only">Go to blog post</span>
        </Link>
        {/* Navigation Dots */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center">
          <div className="flex justify-center w-full sm:w-auto">
            <div className="p-2 rounded-lg">
              <div className="flex justify-center items-center gap-2 sm:gap-4">
                {blogs.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full cursor-pointer ${
                      index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    onClick={() => handleDotClick(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to featured post ${index + 1} of ${blogs.length}`}
                    aria-current={index === currentIndex ? 'true' : 'false'}
                    onKeyDown={(e) => e.key === 'Enter' && handleDotClick(index)}
                    style={{ touchAction: 'manipulation' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Block: Metadata Container */}
      <div className="bg-black bg-opacity-50 p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          {/* Left: Author and Metadata */}
          <div className="flex flex-wrap items-center space-x-2 min-w-0 gap-2">
            <img
              src={currentBlog.authorLogo || placeholderLogo}
              alt={currentBlog.author?.name || 'Author'}
              className="w-8 h-8 rounded-full flex-shrink-0"
            />
            <div className="max-w-fit bg-green-500 rounded p-1">
              {currentBlog.author?.name || 'Unknown Author'}
            </div>
            <div className="max-w-fit bg-blue-500 rounded p-1">
              {currentBlog.Path?.name || 'Unknown Path'}
            </div>
            {mediaTag !== 'None' && (
              <div className="px-2 py-1 bg-green-500 rounded text-white flex-shrink-0">
                {mediaTag}
              </div>
            )}
          </div>
          {/* Right: Comments, Age-Restricted, and Date */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="text-white flex items-center">
                <FaComments className="mr-1" />
                {currentBlog.blogComments?.length || 0}
              </div>
              {currentBlog.isAgeRestricted && (
                <div className="text-red-500 ml-2">18+</div>
              )}
            </div>
            <div className="text-gray-300">
              {new Date(currentBlog.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FeaturedPost.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      blogImage: PropTypes.string,
      pathId: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.shape({
        name: PropTypes.string,
        logo: PropTypes.string,
      }),
      createdAt: PropTypes.string.isRequired,
      blogSummary: PropTypes.string.isRequired,
      videoUrl: PropTypes.string,
      audioUrl: PropTypes.string,
      blogComments: PropTypes.array,
      isAgeRestricted: PropTypes.bool,
    })
  ).isRequired,
};

export default FeaturedPost;