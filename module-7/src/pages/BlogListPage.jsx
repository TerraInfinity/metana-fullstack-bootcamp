/**
 * HomePage.jsx
 * The main home page component.
 */
import React from 'react';
import Layout from './components/common/Layout'; // Import the Layout component
import FeaturedPost from './components/common/FeaturedPost';
import BlogPostGrid from './components/BlogListPage/BlogPostGrid';

export const BlogListPage = () => {
  return (
    <Layout title="The Bambi Cloud Podcast">
      <FeaturedPost  />
      <BlogPostGrid />
    </Layout>
  );
};



