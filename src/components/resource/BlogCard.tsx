import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Blog } from '@/types/resource';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  blog: Blog;
  onClick?: () => void;
  className?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  blog, 
  onClick,
  className 
}) => {
  const getStatusBadge = () => {
    const variants = {
      'active': 'text-red-600',
      'inactive': 'text-gray-600'
    };

    const labels = {
      'active': 'On Demand',
      'inactive': 'Draft'
    };

    return (
      <div 
        className={cn(
          'py-1 text-md font-medium rounded-md',
          variants[blog.status]
        )}
      >
        {labels[blog.status]}
      </div>
    );
  };

  return (
    <div 
      className={cn(
        'group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={blog.mediaUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80'}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        {getStatusBadge()}

        <h3 className="mb-4 sm:text-2xl text-xl font-bold text-black leading-tight">
          {blog.title}
        </h3>
        
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          {blog.description}
        </p>
      </div>
    </div>
  );
};

export default BlogCard; 