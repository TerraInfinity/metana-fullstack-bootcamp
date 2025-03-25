/**
 * Footer.jsx
 * A functional component that renders the website footer, which includes:
 * - About information
 * - Quick links to various sections of the site
 * - Categories of content
 * - A newsletter subscription form
 * 
 * This component is designed to be responsive and adapts to different screen sizes.
 * 
 * @component
 * @returns {JSX.Element} The rendered footer component containing various sections.
 */
import React from 'react';
import NewsletterForm from './NewsletterForm';

const Footer = () => {
  return (
    <footer className="px-4 sm:px-6 lg:px-20 pt-20 pb-10 bg-slate-800">
      <div className="grid gap-10 mb-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div>
          <h3 className="mb-6 text-lg text-white">About</h3>
          <p className="mb-6 text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam.
          </p>
          <div className="text-gray-400">
            <p>Email: career@terrainfinity.ca</p>
            <p>Phone: +00 123 456 789</p>
          </div>
        </div>
        <div>
          <h3 className="mb-6 text-lg text-white">Quick Link</h3>
          <nav className="grid gap-3">
            <a href="/" className="text-gray-400 cursor-pointer">Home</a>
            <a href="/blog" className="text-gray-400 cursor-pointer">Blog</a>
            <a href="/archived" className="text-gray-400 cursor-pointer">Archived</a>
            <a href="/author" className="text-gray-400 cursor-pointer">Author</a>
            <a href="/contact" className="text-gray-400 cursor-pointer">Contact</a>
            <a href="/about" className="text-gray-400 cursor-pointer">About</a>
          </nav>
        </div>
        <div>
          <h3 className="mb-6 text-lg text-white">Category</h3>
          <nav className="grid gap-3">
            <a href="/category/lifestyle" className="text-gray-400 cursor-pointer">Lifestyle</a>
            <a href="/category/technology" className="text-gray-400 cursor-pointer">Technology</a>
            <a href="/category/travel" className="text-gray-400 cursor-pointer">Travel</a>
            <a href="/category/business" className="text-gray-400 cursor-pointer">Business</a>
            <a href="/category/economy" className="text-gray-400 cursor-pointer">Economy</a>
            <a href="/category/sports" className="text-gray-400 cursor-pointer">Sports</a>
          </nav>
        </div>
        <div>
          <h3 className="mb-6 text-lg text-white">Weekly Newsletter</h3>
          <p className="mb-6 text-gray-400">
            Get blog articles and offers via email
          </p>
          <NewsletterForm id="newsletter-form" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-10 text-gray-400 border-t border-solid border-t-gray-700 max-sm:flex-col max-sm:gap-5 max-sm:text-center">
        <div>© IsTemplate 2023. All Rights Reserved.</div>
        <nav className="flex gap-6">
          <a href="/terms" className="text-gray-400 cursor-pointer">Terms of Use</a>
          <a href="/privacy" className="text-gray-400 cursor-pointer">Privacy Policy</a>
          <a href="/cookie" className="text-gray-400 cursor-pointer">Cookie Policy</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;