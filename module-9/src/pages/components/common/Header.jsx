/**
 * Header.jsx
 * A functional component that renders the website header, including navigation links and a search input.
 * 
 * This component manages the state of a mobile menu, allowing users to toggle its visibility.
 * 
 * @component
 * @example
 * return (
 *   <Header />
 * )
 * 
 * @returns {JSX.Element} The rendered header component.
 */
import React, { useState } from 'react';
import MobileMenu from './Menu';
import SearchInput from './SearchInput';
import { Link } from 'react-router-dom';

const Header = () => {
  // State to manage the visibility of the mobile menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the mobile menu's open/closed state
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    // Main header element with styling
    <header className="bg-slate-900 text-white sticky top-0 z-50">
      <div className="flex justify-between items-center px-20 py-5 max-md:px-10 max-sm:p-5">
        <Link to="/Home" className="text-2xl font-semibold">The Bambi Cloud Podcast</Link>
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <SearchInput id="search-input-header" />
          </div>
          <button
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      <MobileMenu isOpen={isMenuOpen} />
    </header>
  );
};

export default Header;