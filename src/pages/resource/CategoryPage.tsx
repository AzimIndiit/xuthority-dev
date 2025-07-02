import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResourceCategories, useBlogsByCategory } from '@/hooks/useResources';
import BlogCard from '@/components/resource/BlogCard';
import { Blog } from '@/types/resource';

export const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  // Fetch the category info
  const { data: categories } = useResourceCategories();
  const currentCategory = categories?.find(cat => cat._id === categoryId);

  // Fetch all blogs for this category
  const { 
    data: blogs, 
    isLoading, 
    error 
  } = useBlogsByCategory(categoryId || '', !!categoryId);

  const handleBlogClick = (blog: Blog) => {
    if (blog.watchUrl) {
      window.open(blog.watchUrl, '_blank');
    } else {
      navigate(`/resources/blog/${blog.slug}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category not found</h1>
          <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/resources')}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Resources
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <button
              onClick={() => navigate('/resources')}
              className="hover:text-red-600 transition-colors"
            >
              Resources
            </button>
            <span>•</span>
            <span className="text-gray-900 font-medium">{currentCategory.name}</span>
          </nav>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentCategory.name}
          </h1>
          <p className="text-gray-600">
            Explore all resources in the {currentCategory.name.toLowerCase()} category
          </p>
        </div>

        {/* Results Count */}
        {blogs && blogs.length > 0 && (
          <div className="mb-6">
            <p className="text-gray-600">
              {blogs.length} {blogs.length === 1 ? 'resource' : 'resources'} found
            </p>
          </div>
        )}

        {/* Blogs Grid */}
        {blogs && blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                onClick={() => handleBlogClick(blog)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources found</h3>
            <p className="text-gray-600 mb-6">
              There are no resources in this category yet.
            </p>
            <button
              onClick={() => navigate('/resources')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse All Resources
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 