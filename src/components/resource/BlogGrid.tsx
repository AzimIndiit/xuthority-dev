import React from 'react';
import { cn } from '@/lib/utils';
import { Blog } from '@/types/resource';
import BlogCard from './BlogCard';

interface BlogGridProps {
  blogs: Blog[];
  isLoading?: boolean;
  error?: string | null;
  onBlogClick?: (blog: Blog) => void;
  className?: string;
}

const BlogGrid: React.FC<BlogGridProps> = ({
  blogs,
  isLoading = false,
  error = null,
  onBlogClick,
  className
}) => {
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="aspect-video bg-gray-200"></div>
          <div className="p-6">
            <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No blogs available</h3>
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 mb-6 bg-red-100 rounded-full flex items-center justify-center">
        <svg
          className="w-12 h-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.684-.833-2.464 0L5.35 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load blogs</h3>
      <p className="text-gray-600 max-w-md mb-4">
        {error || 'Something went wrong while loading the blogs. Please try again.'}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className={cn('w-full', className)}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('w-full', className)}>
        <ErrorState />
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className={cn('w-full', className)}>
        <EmptyState />
      </div>
    );
  }

      return (
      <div className={cn('w-full', className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onClick={() => onBlogClick?.(blog)}
              className="h-full"
            />
          ))}
        </div>
      </div>
    );
};

export default BlogGrid; 