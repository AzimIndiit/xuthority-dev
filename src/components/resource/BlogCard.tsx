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
  const getContentTypeBadge = () => {
    const contentTypeVariants: Record<string, string> = {
      'On Demand': 'text-red-600 bg-red-50',
      'Upcoming': 'text-blue-600 bg-blue-50',
      'EBook': 'text-green-600 bg-green-50',
      'Marketing': 'text-purple-600 bg-purple-50',
      'Sales': 'text-orange-600 bg-orange-50',
      'Live': 'text-green-600 bg-green-50',
      'Archived': 'text-gray-600 bg-gray-50',
      'Featured': 'text-purple-600 bg-purple-50',
      'New': 'text-yellow-600 bg-yellow-50'
    };

    // Only show badge if it's one of the valid content types
    if (!blog?.tag || !contentTypeVariants[blog.tag]) {
      return null;
    }

    return (
      <Badge 
        className={cn(
          'px-2 py-1 text-xs font-medium rounded-md border-0',
          contentTypeVariants[blog.tag]
        )}
      >
        {blog.tag}
      </Badge>
    );
  };

  return (
    <div 
      className={cn(
        'group cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1',
        className
      )}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img
          src={blog.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80'}
          alt={blog.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=500&q=80';
          }}
        />
      </div>

      {/* Content */}
      <div className="px-4 pb-4 pt-2">
        {getContentTypeBadge()}

        <h3 className="mb-4 mt-2 text-base sm:text-lg font-bold text-black leading-tight line-clamp-2" >
          {blog.title}
        </h3>
        
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed line-clamp-2">
          {blog.description}
        </p>
      </div>
    </div>
  );
};

export default BlogCard; 