/**
 * FeedbackSection component
 * 
 * This component includes a comment form and a comment section for user feedback.
 * It also prompts users to log in if they are not authenticated.
 * 
 * @param {Array} comments - The list of comments to display.
 * @param {string} blogId - The ID of the blog post for which feedback is being provided.
 * @returns {JSX.Element} The rendered feedback section component.
 */
import React, { useState, useContext } from 'react';
import CommentSection from './CommentSection';
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext

/**
 * The FeedbackSection component is a functional component that displays a comment form and a list of comments for a blog post.
 * It uses the AuthContext to determine if the user is authenticated, and if not, prompts them to log in.
 * 
 * @typedef {Object} FeedbackSectionProps
 * @property {Array} comments - The list of comments to display.
 * @property {string} blogId - The ID of the blog post for which feedback is being provided.
 * 
 * @param {FeedbackSectionProps} props - The component props.
 * @returns {JSX.Element} The rendered feedback section component.
 */
function FeedbackSection({ comments, blogId }) {
  const { isAuthenticated } = useContext(AuthContext); // Access isAuthenticated from AuthContext


  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-semibold">Feedback</h2>
      <CommentSection isLoggedIn={isAuthenticated} comments={comments} blogId={blogId} />
      {!isAuthenticated && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-center">
          <p className="mb-4">You must be logged in to leave a comment.</p>
        </div>
      )}
    </section>
  );
}

export default FeedbackSection;