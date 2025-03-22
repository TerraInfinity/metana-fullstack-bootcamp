/**
 * FeedbackSection component
 * 
 * This component renders a section for user feedback, including a comment form and a list of comments.
 * It checks user authentication status and prompts users to log in if they are not authenticated.
 * 
 * @param {Array} comments - An array of comment objects to display in the comment section.
 * @param {string} blogId - The unique identifier of the blog post for which feedback is being provided.
 * @returns {JSX.Element} A JSX element representing the feedback section of the blog post.
 */
import React, { useState, useContext } from 'react';
import CommentSection from './CommentSection';
import { AuthContext } from '../../../context/AuthContext'; // Import AuthContext for authentication status

/**
 * The FeedbackSection component is a functional component that displays a comment form and a list of comments
 * for a specific blog post. It utilizes the AuthContext to determine if the user is authenticated. If the user
 * is not authenticated, it displays a message prompting them to log in.
 * 
 * @typedef {Object} FeedbackSectionProps
 * @property {Array} comments - An array of comment objects to display in the comment section.
 * @property {string} blogId - The unique identifier of the blog post for which feedback is being provided.
 * 
 * @param {FeedbackSectionProps} props - The properties passed to the component.
 * @returns {JSX.Element} A JSX element representing the feedback section of the blog post.
 */
function FeedbackSection({ comments, blogId }) {
  const { isAuthenticated } = useContext(AuthContext); // Access the authentication status from AuthContext

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