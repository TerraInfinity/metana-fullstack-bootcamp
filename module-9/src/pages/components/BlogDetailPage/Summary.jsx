/**
 * Summary component
 * 
 * This component displays a brief summary of the blog post content.
 * It includes functionality to expand or collapse the summary text.
 * 
 * Props:
 * @param {string} summary - The summary text to display. If not provided, a default message will be shown.
 * 
 * Usage:
 * <Summary summary="Your summary text here" />
 * 
 * File: Summary.jsx
 */
import React from 'react';

function Summary({ summary }) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold">Summary</h2>
      <div className={`overflow-hidden transition-all duration-300 max-h-full`}>
        <p className="leading-relaxed text-white text-opacity-80">
          {summary || 'AI summary goes here'}
        </p>
      </div>
    </section>
  );
}

export default Summary;