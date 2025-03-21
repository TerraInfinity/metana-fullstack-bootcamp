/**
 * BlogDetailPage component
 * 
 * This component serves as the main page for displaying a blog post.
 * It includes the header, page title, blog content, feedback section,
 * advertisement banner, and footer.
 * 
 * @returns {JSX.Element} The rendered blog detail page.
 */
import React, { useState, useEffect } from 'react';
import Layout from './components/common/Layout'; // Import the Layout component
import BlogContent from './components/BlogDetailPage/BlogContent';
import FeedbackSection from './components/BlogDetailPage/FeedbackSection';
import { useParams } from 'react-router-dom';

export function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comments, setComments] = useState([]);
  const [audioVisible, setAudioVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(true);

  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/blogs/${id}`;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBlog(data);
        setComments(data.BlogComments || []); // Update to match the API response structure
        
        document.title = data.title;
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    // Placeholder for checking login status
    const checkLoginStatus = async () => {
      // Replace with actual API call to check login status
      setIsLoggedIn(false); // Assume not logged in for now
    };

    fetchBlog();
    checkLoginStatus();
  }, [apiUrl]);

  useEffect(() => {
    if (blog) {
      if (!blog.audioUrl) {
        //console.log('No audio data');
        setAudioVisible(false);
      }
      if (!blog.videoUrl) {
        //console.log('No video data');
        setVideoVisible(false);
      }
    }
  }, [blog]);

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="text-white">Blog not found</div>;
  }


  return (
    <Layout title={blog.title}>
      <BlogContent blog={blog} />
      <FeedbackSection isLoggedIn={isLoggedIn} comments={comments} blogId={blog.id} />
    </Layout>
  );
}
