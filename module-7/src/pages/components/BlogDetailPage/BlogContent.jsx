/**
 * BlogContent component
 * 
 * This component displays the main content of the blog post, including
 * a summary, audio player, video player, and a description section
 * that can be expanded or collapsed.
 * 
 * File: BlogContent.jsx
 */
import React, { useState, useEffect } from 'react';
import Summary from './Summary';
import AudioPlayer from './AudioPlayer';
import VideoPlayer from './VideoPlayer';

function BlogContent({ blog }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [summary, setSummary] = useState('');
  const [audioVisible, setAudioVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(true);

  useEffect(() => {
    if (blog && blog.summary) {
      setSummary(blog.summary);
    } else {
      setSummary('No summary provided.');
    }

    if (!blog?.audioUrl) {
      console.log('No audio data');
      setAudioVisible(false);
    }

    if (!blog?.videoUrl) {
      console.log('No video data');
      setVideoVisible(false);
    }
  }, [blog]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <article className="mb-12 px-4 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold sm:text-3xl lg:text-4xl text-center sm:text-left">
        {blog?.title || 'Category'}
      </h1>
      <Summary summary={summary} />
      {videoVisible && (
        <div className="my-6">
          <div className="flex justify-center">
            <div className="relative w-full max-w-3xl overflow-hidden rounded-lg shadow-lg">
              <div className="aspect-video">
                <VideoPlayer videoUrl={blog?.videoUrl} />
              </div>
            </div>
          </div>
        </div>
      )}
      {audioVisible && (
        <div className="my-6">
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <AudioPlayer audioUrl={blog?.audioUrl} />
            </div>
          </div>
        </div>
      )}
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Description</h2>
        <div
          className={`overflow-hidden transition-all duration-300 text-white text-opacity-80 ${
            isExpanded ? 'max-h-full' : 'max-h-32 sm:max-h-40'
          }`}
        >
          <p className="mb-4 leading-relaxed text-sm sm:text-base">
            {blog?.content || 'Description goes here.'}
          </p>
        </div>
        <button
          onClick={toggleExpand}
          className="mt-4 text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-sm sm:text-base"
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      </section>
    </article>
  );
}

export default BlogContent;