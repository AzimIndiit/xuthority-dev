import React from 'react';
import { Blog, ResourceCategory } from '@/types/resource';
import BlogCard from './BlogCard';

interface CategorySectionProps {
  category: ResourceCategory;
  blogs: Blog[];
  onBlogClick: (blog: Blog) => void;
  onViewAll?: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  blogs,
  onBlogClick,
  onViewAll
}) => {
  return (
    <div id={category.slug} className="mb-16 scroll-mt-24">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          {category.name}
        </h2>
        {/* {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
          >
            View All
          </button>
        )} */}
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.slice(0, 6).map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onClick={() => onBlogClick(blog)}
          />
        ))}
      </div>

      {/* Show more indication if there are more than 6 blogs */}
      {blogs.length > 6 && (
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Showing 6 of {blogs.length} {category.name.toLowerCase()}
          </p>
        </div>
      )}
    </div>
  );
}; 