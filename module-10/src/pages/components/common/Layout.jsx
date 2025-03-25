import React from 'react';
import Header from './Header'; // Adjust the import path if necessary
import Footer from './Footer'; // Adjust the import path if necessary
import AdBanner from './AdBanner'; // Adjust the import path if necessary
import PageTitle from './PageTitle'; // Import the PageTitle component

/**
 * Layout component that serves as a wrapper for the main content of the page.
 * It includes a header, a title, a main content area, an advertisement banner, 
 * and a footer, providing a consistent structure across different pages.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title displayed in the PageTitle component, 
 *                               which provides context for the page's content.
 * @param {React.ReactNode} props.children - The content to be rendered within 
 *                                           the main area, allowing for flexible 
 *                                           composition of page content.
 */
const Layout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
      <Header />
      <PageTitle title={title} /> {/* Renders the PageTitle component with the provided title prop */}
      <main id="main-content" className="max-w-full overflow-x-hidden">{children}</main> {/* Main content area, prevents horizontal overflow */}
      <AdBanner />
      <Footer className="max-w-full" /> {/* Renders the Footer component, ensuring it does not exceed full width */}
    </div>
  );
};

export default Layout;
