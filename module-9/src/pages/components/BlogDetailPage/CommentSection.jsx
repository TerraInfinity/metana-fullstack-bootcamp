/**
 * CommentSection component
 * 
 * This component displays a list of comments for a specific blog post and includes a form for adding new comments.
 * It manages user authentication and prompts for login if the user is not authenticated.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.comments - The list of comments to display for the blog post.
 * @param {string} props.blogId - The ID of the blog post for which comments are being displayed.
 * @param {boolean} props.isLoggedIn - Indicates whether the user is currently logged in.
 * @returns {JSX.Element} The rendered comment section component, including the comments and the comment form if logged in.
 */
import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm'; // Import CommentForm

/**
 * CommentSection component
 * 
 * This component displays a list of comments for a specific blog post and includes a form for adding new comments.
 * It manages user authentication and prompts for login if the user is not authenticated.
 * 
 * @param {Object} props - The component props.
 * @param {Array} props.comments - The list of comments to display for the blog post.
 * @param {string} props.blogId - The ID of the blog post for which comments are being displayed.
 * @param {boolean} props.isLoggedIn - Indicates whether the user is currently logged in.
 * @returns {JSX.Element} The rendered comment section component, including the comments and the comment form if logged in.
 */
function CommentSection({ isLoggedIn, comments, blogId }) {
  // State to hold the list of comments and the new comment input
  const [commentList, setCommentList] = useState(comments || []);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0); // State for storing the rating of the new comment

  useEffect(() => {
    // Log comments when they are loaded or if no comments are found
    if (!comments) {
      console.log('No comment data found in the API response.');
    } else {
      console.log('Loaded comments:', JSON.stringify(comments));
    }
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the new comment before adding it to the list
    if (newComment.trim() && newComment.length <= 512) {
      const comment = {
        id: commentList.length + 1,
        author: 'Current User',
        content: newComment,
        rating: rating, // Include rating in the comment object
        date: new Date().toISOString().split('T')[0], // Format date as YYYY-MM-DD
      };
      setCommentList([...commentList, comment]); // Update the comment list
      setNewComment(''); // Clear the new comment input
      setRating(0); // Reset the rating after submission
    }
  };

  const handleNewComment = (newComment) => {
    // Log previous comments and the new comment being added
    console.log('Previous comments:', commentList);
    console.log('New comment being added:', newComment);

    // Ensure the new comment has a valid userId before adding it to the list
    if (newComment.userId) {
      setCommentList((prevComments) => [...prevComments, newComment]);
    } else {
      console.error('New comment does not have a valid userId:', newComment);
    }
  };

  return (
    <div id="comment-section">
      <h3 className="mb-4 text-xl font-semibold" id="comments-title">Comments</h3>
      <ul className="space-y-4" id="comment-list">
        {commentList.map((comment) => (
          <li key={comment.id} className="bg-gray-800 p-4 rounded-lg" id={`comment-${comment.id}`}>
            <div className="flex justify-between items-baseline mb-2">
              <strong className="text-blue-400">{comment.User.name}</strong>
              <span className="text-sm text-gray-400">{comment.date}</span>
            </div>
            <p>{comment.content}</p>
            {comment.rating > 0 && (
              <p className="text-yellow-400" id={`comment-rating-${comment.id}`}>
                Rating: {'★'.repeat(comment.rating)}{'★'.repeat(5 - comment.rating)}
              </p>
            )}
          </li>
        ))}
      </ul>
      {isLoggedIn && (
        <CommentForm isLoggedIn={isLoggedIn} blogId={blogId} onNewComment={handleNewComment} />
      )}
    </div>
  );
}

export default CommentSection;