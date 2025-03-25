/**
 * BlogPostGrid.jsx
 * 
 * This component renders a responsive grid layout of blog posts using the data provided via the `blogs` prop.
 * It is designed to display the latest blog posts and does not handle data fetching or featured posts,
 * as these functionalities are managed by the HomePage component.
 * 
 * Props:
 * - blogs (Array): An array of blog post objects, where each object contains details about a blog post.
 * 
 * Each blog post object should have the following structure:
 * - id (string): Unique identifier for the blog post.
 * - category (string): The category of the blog post.
 * - title (string): The title of the blog post.
 * - author (Object): An object containing author details.
 *   - name (string): The name of the author.
 *   - logo (string): URL to the author's logo.
 * - createdAt (string): The date the blog post was created in ISO format.
 * - blogImage (string): URL to the blog post's image.
 * - isAgeRestricted (boolean): Indicates if the content is age-restricted.
 * - videoUrl (string): URL to a video associated with the blog post, if available.
 * - audioUrl (string): URL to an audio file associated with the blog post, if available.
 * - blogSummary (string): A brief summary of the blog post.
 * - pathId (string): Identifier for the blog post's path, used for routing.
 * - blogComments (Array): An array of comments related to the blog post.
 * 
 * @component
 * @example
 * const blogs = [
 *   {
 *     id: '1',
 *     category: 'Tech',
 *     title: 'Latest in Tech',
 *     author: { name: 'John Doe', logo: 'url_to_logo' },
 *     createdAt: '2023-02-20T12:00:00Z',
 *     blogImage: 'url_to_image',
 *     isAgeRestricted: false,
 *     videoUrl: 'url_to_video',
 *     audioUrl: 'url_to_audio',
 *     blogSummary: 'A brief summary of the blog post.',
 *     pathId: 'latest-in-tech',
 *     blogComments: []
 *   }
 * ];
 * 
 * <BlogPostGrid blogs={blogs} />
 * 
 * @author Bad Wolf
 * @version 1.3
 * @since 2025-03-22
 */
import React from 'react';
import BlogPostCard from './BlogPostCard';

const BlogPostGrid = ({ blogs = [] }) => {
  return (
    <div className="px-20 py-0 max-md:px-10 max-md:py-0 max-sm:px-5 max-sm:py-0" id="blog-post-grid-container">
      <h2 className="mb-8 text-2xl text-white" id="latest-posts-title">Latest Posts</h2>
      <div className="grid gap-6 mb-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" id="blog-posts-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <BlogPostCard 
              key={blog.id} 
              id={blog.id}
              category={blog.category}
              title={blog.title}
              author={{ name: blog.author?.name, logo: blog.authorLogo }}
              date={blog.createdAt}
              imageUrl={blog.blogImage}
              isAgeRestricted={blog.isAgeRestricted}
              videoUrl={blog.videoUrl}
              audioUrl={blog.audioUrl}
              blogSummary={blog.blogSummary}
              pathId={blog.pathId}
              blogComments={blog.blogComments}
              data-testid={`blog-post-${blog.id}`}
            />
          ))
        ) : (
          <div className="text-white col-span-3" id="no-posts-message">No blog posts available</div>
        )}
      </div>
      <button id="view-all-posts-button" className="mb-10 text-center text-blue-500 cursor-pointer hover:text-blue-600">
        View All Posts
      </button>
    </div>
  );
};

export default BlogPostGrid;