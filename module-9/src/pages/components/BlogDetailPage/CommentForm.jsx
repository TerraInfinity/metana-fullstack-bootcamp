/**
 * CommentForm component
 * 
 * This component allows logged-in users to submit a comment for a blog post.
 * It includes a rating system (1 to 5 stars) and a text area for the comment content.
 * 
 * Props:
 * - isLoggedIn (boolean): Indicates if the user is logged in.
 * - blogId (string): The ID of the blog post to which the comment is being submitted.
 * - onNewComment (function): Callback function to handle the new comment after submission.
 * 
 * Usage:
 * <CommentForm isLoggedIn={true} blogId="123" onNewComment={handleNewComment} />
 */
import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making API calls

function CommentForm({ isLoggedIn, blogId, onNewComment }) {
  const [rating, setRating] = useState(null); // State to hold the selected rating
  const [review, setReview] = useState(''); // State to hold the review content

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (rating !== null && (rating < 1 || rating > 5)) { // Validate the rating
        console.error('Invalid rating. Please select a rating between 1 and 5.');
        return; // Exit if the rating is invalid
    }
    try {
        const apiPort = process.env.REACT_APP_BACKEND_PORT; 
        const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/comments/create`;

        // Retrieve the token from local storage for authentication
        const token = localStorage.getItem('authToken'); // Adjust this line based on your implementation
        console.warn(blogId);
        // Submit the review to the API with the token in headers
        const response = await axios.post(apiUrl, { 
            content: review, 
            blogId, 
            ...(rating !== null && rating > 0 && { rating }) // Include rating only if it's valid
        }, {
            headers: {
                Authorization: `Bearer ${token}` // Include the token in the Authorization header
            }
        });

        console.log('Comment submitted:', response.data);
        
        // Call the onNewComment callback with the new comment data from the API response
        onNewComment(response.data); // Use the response data directly

        // Reset the form fields
        setRating(null);
        setReview('');
    } catch (error) {
        console.error('Error submitting comment:', error); // Log any errors during submission
    }
  };

  if (!isLoggedIn) {
    return null; // Do not render the form if the user is not logged in
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8" id="comment-form">
      <h3 className="mb-4 text-xl font-semibold" id="comment-form-title">Leave a Review</h3>
      <div className="mb-4">
        <label htmlFor="rating" className="block mb-2">Rating:</label>
        <div className="flex" id="rating-buttons">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)} // Set the rating when a star is clicked
              className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-400'} focus:outline-none`}
              aria-label={`Rate ${star} stars`}
              id={`rating-star-${star}`}
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
          onChange={(e) => setReview(e.target.value)} // Update review state on change
          className="w-full px-3 py-2 text-white bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="4"
          maxLength={512} // Limit the review length to 512 characters
          required
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        id="submit-review-button"
      >
        Submit Review
      </button>
    </form>
  );
}

export default CommentForm;