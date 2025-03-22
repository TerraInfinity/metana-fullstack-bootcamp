import React from 'react';
import Layout from '../components/common/Layout'; // Import Layout component

/**
 * ServerError component to display a 500 error page.
 * 
 * This component is used to inform users that an internal server error has occurred.
 * It provides a user-friendly message and is wrapped in a Layout component for consistent styling.
 * 
 * @returns {JSX.Element} The rendered ServerError component.
 */
const ServerError = () => {
  return (
    <Layout title="500 - Server Error">
      <div className="text-center">
        <p>Something went wrong on our end. Please try again later.</p>
      </div>
    </Layout>
  );
};

export default ServerError; 