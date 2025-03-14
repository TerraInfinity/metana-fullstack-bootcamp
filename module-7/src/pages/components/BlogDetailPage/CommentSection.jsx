import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm'; // Import CommentForm

/**
 * CommentSection component
 * 
 * This component displays a list of comments and allows logged-in users
 * to add new comments to the blog post, including a star rating.
 * 
 * File: CommentSection.jsx
 */

function CommentSection({ isLoggedIn, comments, blogId }) {
  const [commentList, setCommentList] = useState(comments || []);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0); // State for rating

  useEffect(() => {
    if (!comments) {
      console.log('No comment data found in the API response.');
    } else {
      console.log('Loaded comments:', JSON.stringify(comments)); // Log the comments when loaded
    }
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && newComment.length <= 512) { // Check character limit
      const comment = {
        id: commentList.length + 1,
        author: 'Current User',
        content: newComment,
        rating: rating, // Include rating in the comment
        date: new Date().toISOString().split('T')[0],
      };
      setCommentList([...commentList, comment]);
      setNewComment('');
      setRating(0); // Reset rating after submission
    }
  };

  const handleNewComment = (newComment) => {
    console.log('Previous comments:', commentList); // Log previous comments
    console.log('New comment being added:', newComment); // Log new comment

    // Check if User object exists before accessing name
    if (newComment.userId) { // Adjusted to check for userId instead of User object
      setCommentList((prevComments) => [...prevComments, newComment]);
    } else {
      console.error('New comment does not have a valid userId:', newComment);
    }
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-semibold">Comments</h3>
      <ul className="space-y-4">
        {commentList.map((comment) => (
          <li key={comment.id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-baseline mb-2">
              <strong className="text-blue-400">{comment.User.name}</strong>
              <span className="text-sm text-gray-400">{comment.date}</span>
            </div>
            <p>{comment.content}</p>
            {comment.rating > 0 && (
              <p className="text-yellow-400">
                Rating: {'★'.repeat(comment.rating)}{'★'.repeat(5 - comment.rating)}
              </p>
            )} {/* Display rating as stars */}
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