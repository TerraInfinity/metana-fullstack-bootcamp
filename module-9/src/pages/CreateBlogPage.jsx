import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path
import Layout from './components/common/Layout';
import axios from 'axios';

/**
 * CreateBlogPage component for creating a new blog post.
 * It handles user authentication and form submission.
 *
 * @component
 * @returns {JSX.Element} The rendered CreateBlogPage component, which includes a form for creating a new blog post.
 */
export function CreateBlogPage() {
    const { isAuthenticated, user, loading } = useContext(AuthContext);
    const navigate = useNavigate();
  
    const [newBlog, setNewBlog] = useState({
      title: '',
      blogSummary: '',
      content: '',
      audioUrl: '',
      videoUrl: '',
    });
    const [error, setError] = useState(null);
  
    const apiPort = process.env.REACT_APP_BACKEND_PORT;
    const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/blogs/create`;
    console.log('Stored token:', localStorage.getItem('authToken'));
    console.log('CreateBlogPage - Loading:', loading, 'Authenticated:', isAuthenticated, 'User:', user);
    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated || (user.role !== 'admin' && user.role !== 'creator')) {
        navigate('/403');
        return null;
    }
  
    /**
     * Handles the form submission for creating a new blog.
     * Sends a POST request to the backend API with the blog data.
     *
     * @param {React.FormEvent<HTMLFormElement>} e - The form event triggered by the submission.
     * @returns {Promise<void>} A promise that resolves when the submission is complete, or rejects with an error if the submission fails.
     */
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('Form submitted with data:', newBlog); // Debug log for form submission
      try {
        const response = await axios.post(apiUrl, newBlog, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        console.log('Response received:', response); // Debug log for response
        const blogId = Array.isArray(response.data) ? response.data[0].id : response.data.id;
        console.log('Navigating to blog with ID:', blogId); // Debug log for navigation
        navigate(`/blog/${blogId}`);
      } catch (e) {
        console.error('Error creating blog:', e);
        setError(e.response?.data?.message || e.message);
        console.log('Error message set:', e.response?.data?.message || e.message); // Debug log for error
      }
    };
  
    return (
      <Layout title="Create New Blog">
        <form onSubmit={handleSubmit} className="mb-12 px-4 sm:px-6 lg:px-8">
          <h1 className="mb-6 text-2xl font-bold text-white">Create a New Blog</h1>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <div className="mb-4">
            <input
              type="text"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Blog Title"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              value={newBlog.blogSummary}
              onChange={(e) => setNewBlog({ ...newBlog, blogSummary: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Blog Summary (optional)"
              rows="3"
            />
          </div>
          <div className="mb-4">
            <textarea
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Content"
              rows="10"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="url"
              value={newBlog.audioUrl}
              onChange={(e) => setNewBlog({ ...newBlog, audioUrl: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Audio URL (optional)"
            />
          </div>
          <div className="mb-4">
            <input
              type="url"
              value={newBlog.videoUrl}
              onChange={(e) => setNewBlog({ ...newBlog, videoUrl: e.target.value })}
              className="w-full p-2 text-black rounded"
              placeholder="Video URL (optional)"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create Blog
          </button>
        </form>
      </Layout>
    );
  }