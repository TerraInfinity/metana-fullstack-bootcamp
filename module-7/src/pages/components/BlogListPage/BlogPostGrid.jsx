/**
 * BlogPostGrid.jsx
 * 
 * This component displays a grid of blog posts using the blog data passed as a prop.
 * It no longer fetches data or renders featured posts, as these are handled on the HomePage.
 * 
 * @author [Your Name]
 * @version 1.2
 * @since 2023-02-20
 */
import React from 'react';
import BlogPostCard from './BlogPostCard';

const BlogPostGrid = ({ blogs = [] }) => {
  return (
    <div className="px-20 py-0 max-md:px-10 max-md:py-0 max-sm:px-5 max-sm:py-0">
      <h2 className="mb-8 text-2xl text-white">Latest Posts</h2>
      <div className="grid gap-6 mb-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
            />
          ))
        ) : (
          <div className="text-white col-span-3">No blog posts available</div>
        )}
      </div>
      <button className="mb-10 text-center text-blue-500 cursor-pointer hover:text-blue-600">
        View All Posts
      </button>
    </div>
  );
};

export default BlogPostGrid;