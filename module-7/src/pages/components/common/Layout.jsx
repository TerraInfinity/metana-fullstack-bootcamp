import React from 'react';
import Header from './Header'; // Adjust the import path if necessary
import Footer from './Footer'; // Adjust the import path if necessary
import AdBanner from './AdBanner'; // Adjust the import path if necessary
import PageTitle from './PageTitle'; // Import the PageTitle component

const Layout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 lg:px-8">
      <Header />
      <PageTitle title={title} /> {/* PageTitle is passed as a prop */}
      <main className="max-w-full overflow-x-auto">{children}</main> {/* Prevent overflow */}
      <AdBanner />
      <Footer />
    </div>
  );
};

export default Layout;
