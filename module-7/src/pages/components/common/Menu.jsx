/**
 * Menu.jsx
 * A component for the mobile navigation menu.
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

  const handleRandomBlogClick = async (event) => {
    event.preventDefault();
    const randomBlog = await fetchRandomBlog();
    if (randomBlog) {
      window.location.href = `/blog/${randomBlog}`;
    }
  };

  const handleLogout = () => {
    logout();
    window.location.reload();
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
          href="/single-post"
          className="py-2 w-full text-center text-white hover:bg-slate-700"
        >
          Create Blog (Coming Soon)
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
