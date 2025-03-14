/**
 * SearchInput.jsx
 * A component for the search input field.
 */
import React from 'react';

const SearchInput = ({ id }) => {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
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