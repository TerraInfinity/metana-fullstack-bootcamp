/**
 * NewsletterForm.jsx
 * A component for the newsletter subscription form.
 */
import React from 'react';

const NewsletterForm = () => {
  return (
    <form className="flex flex-col gap-3 w-full" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="email" className="sr-only">Your Email</label>
      <input
        type="email"
        id="email"
        placeholder="Your Email"
        className="flex-1 px-4 py-2 text-white bg-gray-700 rounded border-none"
        aria-label="Your Email"
      />
      <button
        type="submit"
        className="w-full px-6 py-2 text-white bg-blue-500 rounded cursor-pointer border-none"
      >
        Subscribe
      </button>
    </form>
  );
};

export default NewsletterForm;