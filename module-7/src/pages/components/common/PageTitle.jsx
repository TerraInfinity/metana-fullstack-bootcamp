/**
 * PageTitle.jsx
 * A component for displaying the page title.
 */
import React from 'react';

const PageTitle = ({ title }) => {
  return (
    <h1 className="px-0 py-10 text-5xl text-center text-white">
      {title}
    </h1>
  );
};

export default PageTitle;