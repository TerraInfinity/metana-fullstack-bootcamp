/**
 * ReviewForm component
 * 
 * This component allows logged-in users to submit a review for the blog post.
 * It includes a rating system and a text area for the review content.
 * 
 * File: ReviewForm.jsx
 */
import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls

function CommentForm({ isLoggedIn, blogId, onNewComment }) {
  const [rating, setRating] = useState(null);
  const [review, setReview] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating !== null && (rating < 1 || rating > 5)) { // Check for valid rating
        console.error('Invalid rating. Please select a rating between 1 and 5.');
        return; // Exit the function if the rating is invalid
    }
    try {
        const apiPort = process.env.REACT_APP_BACKEND_PORT; 
        const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/comments/create`;

        // Retrieve the token from local storage or context
        const token = localStorage.getItem('authToken'); // Adjust this line based on your implementation
        console.warn(blogId);
        // Submit the review to the API with the token in headers
        const response = await axios.post(apiUrl, { 
            content: review, 
            blogId, 
            ...(rating !== null && rating > 0 && { rating }) // Include rating only if it's greater than 0
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the Authorization header
            }
        });

        console.log('Comment submitted:', response.data);
        
        // Call the onNewComment callback with the new comment data from the API response
        onNewComment(response.data); // Use the response data directly

        setRating(null);
        setReview('');
    } catch (error) {
        console.error('Error submitting comment:', error);
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <h3 className="mb-4 text-xl font-semibold">Leave a Review</h3>
      <div className="mb-4">
        <label htmlFor="rating" className="block mb-2">Rating:</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400'} focus:outline-none`}
              aria-label={`Rate ${star} stars`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="review" className="block mb-2">Your Review:</label>
        <textarea
          id="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
          maxLength={512}
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Submit Review
      </button>
    </form>
  );
}

export default CommentForm;