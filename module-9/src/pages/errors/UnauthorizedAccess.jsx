import React from 'react';
import Layout from '../components/common/Layout';

/**
 * UnauthorizedAccess component to display a 401 error page.
 * 
 * This component is rendered when a user attempts to access a page
 * that requires authentication but is not logged in. It provides
 * a user-friendly message prompting the user to log in.
 * 
 * @returns {JSX.Element} The rendered component.
 */
const UnauthorizedAccess = () => {
  return (
    <Layout title="401 - Unauthorized Access">
      <div className="text-center">
        <p>You need to log in to access this page.</p>
      </div>
    </Layout>
  );
};

export default UnauthorizedAccess; 