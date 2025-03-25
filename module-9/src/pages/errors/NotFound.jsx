import React from 'react';
import Layout from '../components/common/Layout'; // Import Layout component

/**
 * NotFound component to display a 404 error page.
 * 
 * This component is rendered when a user navigates to a route that does not exist.
 * It provides a user-friendly message indicating that the requested page could not be found.
 * 
 * @component
 * @example
 * return (
 *   <NotFound />
 * )
 */
const NotFound = () => {
  return (
    <Layout title="404 - Page Not Found">
      <div className="text-center">
        <p id="not-found-message">The page you are looking for does not exist.</p>
      </div>
    </Layout>
  );
};

export default NotFound; 