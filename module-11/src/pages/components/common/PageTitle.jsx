/**
 * PageTitle.jsx
 * A React component for displaying a page title with customizable styles.
 *
 * This component renders an <h1> element that displays the provided title prop.
 * It is designed to be used in various parts of the application where a page title is needed.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.title - The title to be displayed in the header.
 * @returns {JSX.Element} A styled header element containing the page title.
 */
import React from 'react';

// Functional component that receives a title prop
const PageTitle = ({ title }) => {
  return (
    <h1 id="page-title" className="px-0 py-10 text-5xl text-center text-white">
      {title}
    </h1>
  );
};

export default PageTitle;