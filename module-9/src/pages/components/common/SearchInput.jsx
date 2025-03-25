/**
 * SearchInput.jsx
 * A functional component that renders a search input field.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {string} props.id - A unique identifier for the input field, used for accessibility.
 * @returns {JSX.Element} A form containing the search input field.
 */
import React from 'react';

const SearchInput = ({ id }) => {
  // Prevent the default form submission behavior
  return (
    <form id={`${id}-form`} onSubmit={(e) => e.preventDefault()}>
      <label htmlFor={id} className="sr-only">Search</label>
      <input
        type="text"
        id={id}
        placeholder="Search"
        className="px-4 py-2 text-white rounded bg-white bg-opacity-10 border-none"
      />
    </form>
  );
};

export default SearchInput;