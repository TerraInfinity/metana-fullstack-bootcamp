// ActivityFeed.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityFeed = ({ userId }) => {
  const [comments, setComments] = useState([]);
  const apiPort = process.env.REACT_APP_BACKEND_PORT;
  const apiUrl = `${window.location.protocol}//${window.location.hostname}:${apiPort}/api/users/profile/${userId}`;
  const navigate = useNavigate();

  console.log('ActivityFeed component rendered'); // Log to confirm component is rendered

  useEffect(() => {
    console.log('API URL:', apiUrl); // Log the API URL
    const fetchComments = async () => {
      try {
        console.log(`Fetching comments for user ID: ${userId}`);
        const response = await fetch(apiUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json(); // Get error data if response is not OK
          console.error('Failed to fetch comments:', errorData);
          return; // Exit if the response is not OK
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (data.comments) {
          console.log('Comments:', data.comments);
          setComments(data.comments);
        } else {
          console.error('No comments found in the response:', data);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    if (userId) {
      fetchComments();
    }
  }, [userId, apiUrl]);

  if (!comments || comments.length === 0) {
    return <div className="text-white">No comments available.</div>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md max-h-96 overflow-y-auto">
      {comments.map((comment) => (
        <div 
          key={comment.id} 
          className="bg-gray-700 p-4 rounded-lg mb-2 cursor-pointer"
          onClick={() => navigate(`/blog/${comment.blogId}`)}
        >
          <div className="flex justify-between items-baseline mb-2">
            <span 
              className="text-blue-400 cursor-pointer hover:underline"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${comment.userId}`);
              }}
            >
              Current User
            </span>
            <span className="text-sm text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
          </div>
          <p>{comment.content}</p>
          {comment.rating > 0 && (
            <p className="text-yellow-400">
              Rating: {'★'.repeat(comment.rating)}{'★'.repeat(5 - comment.rating)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;