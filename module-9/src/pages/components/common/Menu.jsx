/**
 * Menu.jsx
 * A component for the mobile navigation menu.
 * 
 * This component renders a navigation menu that allows users to navigate
 * to different sections of the application, including Home, About, Admin,
 * and a Random Blog. It also provides functionality for user authentication
 * with options to log in or log out.
 * 
 * Props:
 * @param {boolean} isOpen - Indicates whether the menu is currently open (true) or closed (false).
 * 
 * Functions:
 * @function fetchRandomBlog - Asynchronously fetches a random blog from the API and updates the state.
 * @function handleRandomBlogClick - Handles the click event for the Random Blog link,
 *                                    fetching a random blog and navigating to its page.
 * @function handleLogout - Logs the user out and navigates to the Home page.
 */
import React, { useEffect, useState, useContext } from 'react';
import SearchInput from './SearchInput';
import { AuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Menu = ({ isOpen }) => {
  const [blogs, setBlogs] = useState([]);
  const [randomBlogId, setRandomBlogId] = useState(null);
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Fetches a random blog from the API.
   * If successful, updates the state with the fetched blogs and sets a random blog ID.
   * @returns {Promise<number|null>} The ID of the randomly selected blog or null if fetching fails.
   */
  const fetchRandomBlog = async () => {
    try {
      const apiPort = process.env.REACT_APP_BACKEND_PORT;      
      const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/blogs`;
      console.debug(apiUrl);

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.debug(data);

      setBlogs(data);
      if (data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomBlog = data[randomIndex].id;
        setRandomBlogId(randomBlog);
        console.debug(randomBlog);
        return randomBlog;
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      // Optionally set an error state here to inform the user
    }
    return null;
  };

  /**
   * Handles the click event for the Random Blog link.
   * Prevents the default action, fetches a random blog, and navigates to its page if found.
   * @param {Event} event - The click event.
   */
  const handleRandomBlogClick = async (event) => {
    event.preventDefault();
    const randomBlog = await fetchRandomBlog();
    if (randomBlog) {
      window.location.href = `/blog/${randomBlog}`;
    }
  };

  /**
   * Logs the user out and navigates to the Home page.
   */
  const handleLogout = () => {
    logout();
    navigate('/Home');
  };

  return (
    <nav
      className={`
        ${isOpen ? 'block' : 'hidden'}
        md:absolute md:top-full md:left-0 md:right-0
        bg-slate-800 z-50
      `}
    >
      <div className="flex flex-col items-center py-4">
        <a
          href="/Home"
          className="py-2 w-full text-center text-white hover:bg-slate-700"
        >
          Home
        </a>
        <a
          href="/about"
          className="py-2 w-full text-center text-white hover:bg-slate-700"
        >
          About
        </a>
        <hr className="my-2 border-white" />
        {token && (
          <a
            href="/admin"
            className="py-2 w-full text-center text-white hover:bg-slate-700"
          >
            Admin
          </a>
        )}
        <a
          href="#"
          onClick={handleRandomBlogClick}
          className="py-2 w-full text-center text-white hover:bg-slate-700"
        >
          Random Blog
        </a>
        <a
          href="/blog/create"
          className="py-2 w-full text-center text-white hover:bg-slate-700"
        >
          Create Blog
        </a>
        <hr className="my-2 border-white" />
        {token ? (
          <button
            onClick={handleLogout}
            className="py-2 w-full text-center text-white hover:bg-slate-700 cursor-pointer"
          >
            Logout
          </button>
        ) : (
          <a
            href="/Login"
            className="py-2 w-full text-center text-white hover:bg-slate-700"
          >
            Login
          </a>
        )}
        <div className="py-2 w-full md:hidden flex justify-center">
          <SearchInput id="search-input-menu" />
        </div>
      </div>
    </nav>
  );
};

export default Menu;
