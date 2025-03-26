/**
 * HomePage.jsx
 * The main home page component that displays featured posts and a grid of blog posts.
 * It fetches blog data from the backend API and manages loading and error states.
 *
 * @component
 * @returns {JSX.Element} The rendered home page component.
 * 
 * @state {Array} blogs - The list of blog posts fetched from the API.
 * @state {boolean} loading - Indicates whether the blog data is currently being loaded.
 * @state {string|null} error - Contains error message if fetching blogs fails.
 * 
 * @example
 * // Usage of HomePage component
 * <HomePage />
 */
import React, { useState, useEffect } from 'react';
import Layout from './components/common/Layout'; // Import the Layout component
import FeaturedPost from './components/common/FeaturedPost';
import BlogPostGrid from './components/BlogListPage/BlogPostGrid';
import axios from 'axios'; // Import axios

export const HomePage = () => {
  const [blogs, setBlogs] = useState([]); // State for blogs
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const apiPort = process.env.REACT_APP_BACKEND_PORT;
        const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/blogs/`;
        
        const response = await axios.get(apiUrl);
        const data = Array.isArray(response.data) ? response.data : [];
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
        setError('Failed to load blog posts');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) return <div id="loading-message">Loading...</div>; // Handle loading state
  if (error) return <div id="error-message">{error}</div>; // Handle error state

  return (
    <Layout title="The Bambi Cloud Podcast" id="home-page-layout">
      <div id="home-page-content">
        <FeaturedPost id="featured-posts-section" blogs={blogs.filter(blog => blog.featured)} />
        <BlogPostGrid id="blog-posts-grid" blogs={blogs} />
      </div>
    </Layout>
  );
};
