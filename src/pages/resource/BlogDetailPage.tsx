import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import BlogCard from '@/components/resource/BlogCard';
import { useBlogBySlug, useBlogsByCategory } from '@/hooks/useResources';
import { Blog } from '@/types/resource';
import { Button } from '@/components/ui/button';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Fetch the main blog
  const { 
    data: blog, 
    isLoading: blogLoading, 
    error: blogError 
  } = useBlogBySlug(slug || '', !!slug);
console.log(blog);
  // Fetch related blogs from the same category
  const { 
    data: relatedBlogs, 
    isLoading: relatedLoading 
  } = useBlogsByCategory(
    blog?.resourceCategoryId?._id || '', 
    !!blog?.resourceCategoryId?._id
  );

  // Filter out current blog from related blogs and limit to 3
  const filteredRelatedBlogs = relatedBlogs?.filter(
    relatedBlog => relatedBlog._id !== blog?._id
  ).slice(0, 3) || [];

  const handleBlogClick = (clickedBlog: Blog) => {
    if (clickedBlog.watchUrl) {
      window.open(clickedBlog.watchUrl, '_blank');
    } else {
      navigate(`/resources/${clickedBlog.slug}`);
    }
  };

  const handleWatchNow = () => {
    if (blog?.watchUrl) {
      window.open(blog.watchUrl, '_blank');
    }
  };

  const handleViewAllRelated = () => {
    navigate(`/resources/category/${blog?.resourceCategoryId?._id}`);
  };

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

  if (blogError || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <p className="text-gray-600 mb-6">The blog you're looking for doesn't exist.</p>
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
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden h-48 sm:h-[500px]" 
        style={{ 
          backgroundImage: `url(${blog.mediaUrl})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'top',
        }}
      />
      
      {/* Main Content Section */}
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="inline-flex">
              <div className="text-red-600 py-1 text-md font-semibold rounded">
                On Demand
              </div>
          </div>

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
                  <Button
                    onClick={handleWatchNow}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Watch Now
                  </Button>
                </div>
          </div>
        </div>
      </div>

      {/* Related Posts Section */}
      {filteredRelatedBlogs.length > 0 && (
        <div className="mb-16">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 ">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Recommended Posts</h2>
              {/* <button
                onClick={handleViewAllRelated}
                className="text-red-600 hover:text-red-700 font-semibold transition-colors"
              >
                View All
              </button> */}
            </div>

            {/* Related Blogs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRelatedBlogs.map((relatedBlog) => (
                <BlogCard
                  key={relatedBlog._id}
                  blog={relatedBlog}
                  onClick={() => handleBlogClick(relatedBlog)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 