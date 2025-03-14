/**
 * LandingPage.jsx
 * The landing page component.
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";

export const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div>
        <header className="w-full border-b border-solid border-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[60px] flex justify-between items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/assets/images/logo.png" 
                  alt="Logo" 
                  className="w-6 h-6 bg-[#d9d9d9]"
                />
              </Link>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="w-6 h-6 bg-[#d9d9d9] flex items-center justify-center"
              >
                <span className="text-[10px]">Menu</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isMenuOpen && (
            <div className="w-full border border-solid border-black bg-[#d9d9d9] mt-0">
              <div className="flex flex-col items-center py-4 space-y-4">
                <Link 
                  to="/home" 
                  className="text-[10px] hover:text-blue-600 transition-colors"
                >
                  Home
                </Link>
                <Link 
                  to="/blogs" 
                  className="text-[10px] hover:text-blue-600 transition-colors"
                >
                  Blogs
                </Link>
                <Link 
                  to="/admin" 
                  className="text-[10px] hover:text-blue-600 transition-colors"
                >
                  Admin
                </Link>
                <Link 
                  to="/about" 
                  className="text-[10px] hover:text-blue-600 transition-colors"
                >
                  About
                </Link>
              </div>
            </div>
          )}

          <main className="mt-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Welcome Message
              </h1>
            </div>

            <div className="w-full aspect-video bg-[#d9d9d9] rounded-lg shadow-lg mb-8 flex items-center justify-center">
              <span className="text-sm">Hero Image</span>
            </div>

            <div className="flex justify-center mb-8">
              <Link to="/home">
                <button className="px-8 py-3 bg-[#d9d9d9] hover:bg-gray-300 transition-colors duration-200 rounded">
                  <span className="text-sm">Get Started</span>
                </button>
              </Link>
            </div>

            <div className="w-full bg-[#d9d9d9] rounded-lg p-6 mb-8">
              <div className="text-center">
                <span className="text-sm">Featured Post Preview</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      <footer className="w-full py-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <p className="text-xs">© 2025 Bambi Cloud Podcast</p>
            </div>

            <div className="text-center">
              <p className="text-xs">Do you pray at the altar of chaos?</p>
            </div>

            <div className="flex justify-center md:justify-end space-x-4">
              <div className="w-8 h-8 bg-[#d9d9d9] flex items-center justify-center">
                <span className="text-xs">X</span>
              </div>
              <div className="w-8 h-8 bg-[#d9d9d9] flex items-center justify-center">
                <span className="text-xs">Insta</span>
              </div>
              <div className="w-8 h-8 bg-[#d9d9d9] flex items-center justify-center">
                <span className="text-xs">YT</span>
              </div>
              <div className="w-8 h-8 bg-[#d9d9d9] flex items-center justify-center">
                <span className="text-xs">Pat</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};