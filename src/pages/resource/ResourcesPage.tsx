import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ResourceTab, Blog } from '@/types/resource';
import { ResourceTabs, CategorySection } from '@/components/resource';
import { useBlogsGroupedByCategory } from '@/hooks/useResources';

export const ResourcesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ResourceTab>('');

  // Fetch all blogs grouped by categories (6 per category)
  const { 
    data: groupedData, 
    isLoading, 
    isFetching,
    error
  } = useBlogsGroupedByCategory(6);

  // Create tabs from available categories that have blogs
  const tabs = groupedData?.map(group => ({
    id: group.category._id,
    label: group.category.name,
    slug: group.category.slug
  })) || [];

  // Initialize tab from URL params or set first category as default
  useEffect(() => {
    if (groupedData && groupedData.length > 0) {
      const tabParam = searchParams.get('tab') as ResourceTab;
      if (tabParam && groupedData.some(group => group.category.slug === tabParam)) {
        setActiveTab(tabParam);
      } else if (!activeTab) {
        // Set first category as default if no tab is selected
        setActiveTab(groupedData[0].category.slug);
        setSearchParams({ tab: groupedData[0].category.slug });
      }
    }
  }, [groupedData, searchParams, activeTab, setSearchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    
    // Scroll to the specific section
    const element = document.getElementById(tab);
    if (element) {
      const navHeight = 80; // Approximate navbar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleBlogClick = (blog: Blog) => {
    // Navigate to blog detail page or open blog URL
    if (blog.watchUrl) {
      window.open(blog.watchUrl, '_blank');
    } else {
      navigate(`/resources/${blog.slug}`);
    }
  };

  const handleViewAll = (categoryId: string) => {
    // Navigate to category-specific page or implement modal/filter
    navigate(`/resources/category/${categoryId}`);
  };

  // Loading state
  if (isLoading || isFetching) {
    return (
      <section className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading skeleton for tabs */}
        <div className="mb-8">
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>

        {/* Loading skeleton for content */}
        <div className="space-y-16">
          {[1, 2, 3].map((section) => (
            <div key={section}>
              <div className="flex justify-between items-center mb-8">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((card) => (
                  <div key={card} className="h-64 bg-gray-200 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }


  // Empty state
  if (!groupedData || groupedData.length === 0) {
    return (
      <section className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No resources available</h3>
          <p className="text-gray-600 max-w-md">
            There are no resources available at the moment. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Resources</h1>
      </div>

      {/* Resource Tabs */}
      <div className=" ">
        <ResourceTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      {/* Category Sections */}
      <div className="space-y-16">
        {groupedData.map((group) => (
          <CategorySection
            key={group.category.slug}
            category={group.category}
            blogs={group.blogs}
            onBlogClick={handleBlogClick}
            onViewAll={() => handleViewAll(group.category._id)}
          />
        ))}
      </div>
    </section>
  );
}; 