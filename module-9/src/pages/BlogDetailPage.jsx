/**
 * BlogDetailPage component
 * 
 * This component serves as the main page for displaying a blog post.
 * It includes the header, page title, blog content, feedback section,
 * advertisement banner, and footer.
 * 
 * @component
 * @returns {JSX.Element} The rendered blog detail page.
 * 
 * @state {Object} blog - The blog post data fetched from the API.
 * @state {boolean} loading - Indicates if the blog post is still loading.
 * @state {string|null} error - Error message if fetching the blog fails.
 * @state {boolean} isLoggedIn - Indicates if the user is logged in.
 * @state {Array} comments - List of comments associated with the blog post.
 * @state {boolean} audioVisible - Controls visibility of audio content.
 * @state {boolean} videoVisible - Controls visibility of video content.
 * @state {string|null} userRole - Role of the user (e.g., 'admin', 'user').
 * @state {boolean} isEditMode - Indicates if the component is in edit mode.
 * @state {Object|null} editedBlog - Holds the blog data being edited.
 * 
 * @context {Object} AuthContext - Provides authentication status and user role.
 */
import React, { useState, useEffect, useContext } from 'react';
import Layout from './components/common/Layout'; // Import the Layout component
import BlogContent from './components/BlogDetailPage/BlogContent';
import FeedbackSection from './components/BlogDetailPage/FeedbackSection';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import axios from 'axios'; // Import axios

export function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [comments, setComments] = useState([]);
  const [audioVisible, setAudioVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(true);
  const { isAuthenticated } = useContext(AuthContext); // Get isAuthenticated from context
  const [userRole, setUserRole] = useState(null); // New state for user role
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBlog, setEditedBlog] = useState(null); // New state for editable blog

  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const baseAPIUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}`;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const fetchBlogAPIRoute = `${baseAPIUrl}/api/blogs/${id}`;
        const response = await axios.get(fetchBlogAPIRoute); // Use axios to fetch blog
        setBlog(response.data);
        setEditedBlog(response.data); // Initialize editable blog
        setComments(response.data.BlogComments || []); // Update to match the API response structure
        
        document.title = response.data.title;
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

    const fetchUserRole = async () => { // New function to fetch user role
      console.log('Fetching user role...'); // Debug log before fetching
      try {
        const response = await axios.get(`${baseAPIUrl}/api/users/role`, { // Updated to use baseAPIUrl
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        console.log('User role fetched successfully:', response.data.role); // Debug log on success
        setUserRole(response.data.role); // Expecting 'admin', 'user', etc.
      } catch (e) {
        console.error('Error fetching user role:', e); // Debug log on error
      }
      console.log('Finished fetching user role.'); // Debug log after fetching
    };

    fetchBlog();
    checkLoginStatus();
    if (isAuthenticated) fetchUserRole(); // Fetch user role if authenticated
  }, [isAuthenticated, id, baseAPIUrl]);

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

  const handleSave = async () => {
    try {
      const response = await axios.put(`${baseAPIUrl}/api/blogs/update/${id}`, {
        ...editedBlog, // Ensure all fields including blogSummary are sent
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.status !== 200) throw new Error('Failed to update blog');
      setBlog(editedBlog); // Update displayed blog
      setIsEditMode(false); // Exit edit mode
    } catch (e) {
      console.error('Error saving blog:', e);
      alert('Failed to save changes');
    }
  };

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
      {userRole === 'admin' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              aria-label="Toggle Edit Mode"
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>
            {isEditMode && (
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                aria-label="Save Changes"
              >
                Save
              </button>
            )}
          </div>
        </div>
      )}
      {isEditMode ? (
        <div className="mb-12 px-4 sm:px-6 lg:px-8">
          <input
            type="text"
            value={editedBlog.title}
            onChange={(e) => setEditedBlog({ ...editedBlog, title: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Blog Title"
          />
          <textarea
            value={editedBlog.blogSummary || ''}
            onChange={(e) => setEditedBlog({ ...editedBlog, blogSummary: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Summary"
            rows="3"
          />
          <textarea
            value={editedBlog.content}
            onChange={(e) => setEditedBlog({ ...editedBlog, content: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Content"
            rows="10"
          />
          <input
            type="url"
            value={editedBlog.audioUrl}
            onChange={(e) => setEditedBlog({ ...editedBlog, audioUrl: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Audio URL (optional)"
          />
          <input
            type="url"
            value={editedBlog.videoUrl}
            onChange={(e) => setEditedBlog({ ...editedBlog, videoUrl: e.target.value })}
            className="w-full mb-4 p-2 text-black rounded"
            placeholder="Video URL (optional)"
          />
        </div>
      ) : (
        <BlogContent blog={{ ...blog, summary: blog.blogSummary }} />
      )}
      <FeedbackSection isLoggedIn={isAuthenticated} comments={comments} blogId={blog.id} />
    </Layout>
  );
}
