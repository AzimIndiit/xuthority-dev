import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/resource/BlogCard';
import { useBlogBySlug, useBlogsByCategory } from '@/hooks/useResources';
import { Blog } from '@/types/resource';
import { Button } from '@/components/ui/button';
import { NotFoundPage, EmptyState } from '@/components/common';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch the main blog
  const { 
    data: blog, 
    isLoading: blogLoading, 
    error: blogError,
    refetch: refetchBlog
  } = useBlogBySlug(slug || '', !!slug);

  // Fetch related blogs from the same category
  const { 
    data: relatedBlogs, 
    isLoading: relatedLoading,
    error: relatedError,
    refetch: refetchRelated
  } = useBlogsByCategory(
    blog?.resourceCategoryId?._id || '', 
    !!blog?.resourceCategoryId?._id
  );

  // Filter out current blog from related blogs and limit to 3
  const filteredRelatedBlogs = relatedBlogs?.filter(
    relatedBlog => relatedBlog._id !== blog?._id
  ).slice(0, 3) || [];

  const handleBlogClick = (clickedBlog: Blog) => {
    try {
      // if (clickedBlog.watchUrl) {
      //   window.open(clickedBlog.watchUrl, '_blank');
      // } else {
        navigate(`/resources/${clickedBlog.slug}`);
      // }
    } catch (error) {
      console.error('Failed to navigate to blog:', error);
      // Fallback: try direct navigation
      if (clickedBlog.watchUrl) {
        window.location.href = clickedBlog.watchUrl;
      } else {
        window.location.href = `/resources/${clickedBlog.slug}`;
      }
    }
  };

  const handleWatchNow = () => {
    if (blog?.watchUrl) {
      try {
        window.open(blog.watchUrl, '_blank');
      } catch (error) {
        console.error('Failed to open watch URL:', error);
        // Fallback: try to navigate to the URL
        window.location.href = blog.watchUrl;
      }
    }
  };

  const handleViewAllRelated = () => {
    navigate(`/resources/category/${blog?.resourceCategoryId?._id}`);
  };

  // Get content type badge
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
        className={`px-3 py-1.5 text-sm font-medium rounded-md border-0 ${contentTypeVariants[blog.tag]}`}
      >
        {blog.tag}
      </Badge>
    );
  };

  // Handle missing slug parameter
  if (!slug) {
    return (
      <NotFoundPage 
        title="Blog not found"
        description="The blog URL is invalid or incomplete."
        buttonText="Browse Resources"
        navigateTo="/resources"
        containerHeight="min-h-screen"
      />
    );
  }

  // Handle blog loading error
  if (blogError) {
    return (
      <NotFoundPage 
        title="Failed to load blog"
        description="Something went wrong while loading the blog. Please try again."
        buttonText="Go Back Resources"
        navigateTo="/resources"
        containerHeight="min-h-screen"
        showBackButton={false}

      />
    );
  }

  // Handle blog not found
  if (!blogLoading && !blog) {
    return (
      <NotFoundPage 
        title="Blog not found"
        description="The blog you're looking for doesn't exist or has been removed."
        buttonText="Browse Resources"
        navigateTo="/resources"
        containerHeight="min-h-screen"
      />
    );
  }

  if (blogLoading) {
    return (
      <div className="min-h-screen">
        {/* Hero Skeleton */}
        <div className="relative bg-gradient-to-r from-blue-50 to-purple-50 py-16">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="h-80 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden h-48 sm:h-[500px]" 
        style={{ 
          backgroundImage: blog.mediaUrl ? `url(${blog.mediaUrl})` : 'none', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
        }}
      />
      
      {/* Main Content Section */}
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {/* Status Badge */}
          {getContentTypeBadge()}

          {/* Content Title */}
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {blog.title}
          </h2>

          {/* Description */}
          <div className="space-y-4 text-gray-700">
            <p className="text-lg leading-relaxed">
              {blog.description}
            </p>

          

                {/* Watch Now Button */}
                <div className="pt-4">
                  {blog.watchUrl && (
                    <Button
                      onClick={handleWatchNow}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      Watch Now
                    </Button>
                  )}
                </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      <div className="mb-16">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recommended Posts</h2>
          </div>

          {/* Related Blogs Content */}
          {relatedLoading ? (
            // Loading skeleton for related blogs
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-6">
                    <div className="h-6 bg-gray-200 rounded mb-3" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : relatedError ? (
            // Error state for related blogs
            <EmptyState
              title="Failed to load related posts"
              description="Something went wrong while loading related content."
              buttonText="Retry"
              containerHeight="min-h-[20vh]"
              onButtonClick={() => refetchRelated()}
            />
          ) : filteredRelatedBlogs.length > 0 ? (
            // Related blogs grid
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRelatedBlogs.map((relatedBlog) => (
                <BlogCard
                  key={relatedBlog._id}
                  blog={relatedBlog}
                  onClick={() => handleBlogClick(relatedBlog)}
                />
              ))}
            </div>
          ) : (
            // No related blogs found
            <EmptyState
              title="No related posts found"
              description="We couldn't find any related content for this blog."
              buttonText="Browse All Resources"
              containerHeight="min-h-[20vh]"
              onButtonClick={() => navigate('/resources')}
            />
          )}
        </div>
      </div>
    </div>
  );
}; 