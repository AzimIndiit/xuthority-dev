import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ChevronRight, Loader2 } from "lucide-react";
import { useSoftwareCategories, useSolutionCategories } from "@/hooks/useCategoryOptions";

// Skeleton loader component for category cards
const CategorySkeleton = ({ index }: { index: number }) => {
  // Vary the width of skeleton text for more realistic appearance
  const widthVariants = ['w-3/4', 'w-2/3', 'w-4/5', 'w-1/2', 'w-5/6'];
  const widthClass = widthVariants[index % widthVariants.length];
  
  return (
    <div 
      className="group flex items-center justify-between rounded-lg bg-gray-100 p-4 animate-pulse"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={`h-4 bg-gray-300 rounded ${widthClass}`}></div>
      <div className="h-5 w-5 bg-gray-300 rounded"></div>
    </div>
  );
};

// Skeleton loader for the entire page
const PageSkeleton = () => {
  return (
    <section className="flex justify-center items-center py-8">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <div>
          <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>
        <div className="sm:min-h-[48vh]">
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, index) => (
              <CategorySkeleton key={index} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const SoftwareCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [viewAll, setViewAll] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isViewAllLoading, setIsViewAllLoading] = useState(false);
  const page = 1;
  const limit = viewAll ? 1000 : 12; // Load all if viewAll is true
  
  // Validate category parameter and redirect if invalid
  useEffect(() => {
    if (category && !['software', 'solutions'].includes(category.toLowerCase())) {
      navigate('/', { replace: true });
    }
  }, [category, navigate]);
  console.log('category', category)

  let subCategories: { name: string; slug: string; id: string }[] = [];
  let isSoftwareLoading = false;
  let isSoftwareError = false;
  let isSolutionLoading = false;
  let isSolutionError = false;
  let pagination: any = null;
  
  if (category.toLowerCase() === "software") {
    const {
      data: softwareResultRaw = [] as any,
      isLoading: isSoftwareLoading = true,
      isError: isSoftwareError = true,
    } = useSoftwareCategories(page, limit);
    // Get unique categories from software list
    const softwareResult = softwareResultRaw as { data: string[]; pagination: any } | undefined 
    pagination = softwareResult?.pagination;

    const allCategories = (softwareResult?.data || [])
      .map((item: any) => ({ name: item.name, slug: item.slug ,id: item.id }))
      .filter((item: any) => item.name && item.slug);
    subCategories = Array.from(new Set(allCategories.map(item => JSON.stringify(item))))
      .map(item => JSON.parse(item));
  } else if (category.toLowerCase() === "solutions") {
    const {
      data: solutionResultRaw = [] as any,
      isLoading: isSolutionLoading = true,
      isError: isSolutionError = false,
    } = useSolutionCategories(page, limit);
    // Get unique categories from solution list
    const solutionResult = solutionResultRaw as { data: string[]; pagination: any } | undefined;
    pagination = solutionResult?.pagination;
    console.log('subCategories', solutionResult)
    const allCategories = (solutionResult?.data || [])
      .map((item: any) => ({ name: item.name, slug: item.slug ,id: item.id }))
      .filter((item: any) => item.name && item.slug);
    subCategories = Array.from(new Set(allCategories.map(item => JSON.stringify(item))))
      .map(item => JSON.parse(item));
  }
  const toUrlSlug = (text: string) => {
    return text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  };

  // Check if there are more items to load based on pagination
  const hasMoreItems = () => {
    if (!pagination) return false;
    console.log('Pagination data:', pagination);
    console.log('Current limit:', limit);
    console.log('ViewAll state:', viewAll);
    
    return pagination.hasNextPage === true || 
           (pagination.totalItems > pagination.itemsPerPage && !viewAll);
  };

  const handleCategorySelect = (e: React.MouseEvent, categoryId: string, categorySlug: string) => {
    e.preventDefault(); // Prevent immediate navigation
    setSelectedCategoryId(categoryId);
      navigate(`/${category}/${categorySlug}`);
  };

  const handleViewAllClick = () => {
    setIsViewAllLoading(true);
    // Add a longer delay to show the loader before state changes
    setTimeout(() => {
      setViewAll(true);
      setIsViewAllLoading(false);
    }, 1000);
  };
  if (subCategories.length === 0) {
    return <PageSkeleton />;
  }
  if (isSoftwareError || isSolutionError) {
    return <div className="text-center py-8 text-red-500">Failed to load categories.</div>;
  }

  return (
    <section className="flex justify-center items-center py-8">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 ">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          {/* <div className="mt-6 border-t border-yellow-400 w-24 mx-auto sm:mx-0" /> */}
        </div>

<div className="sm:min-h-[40vh]">
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3  ">
          {subCategories.map((subCategory: any) => {
            console.log('subCategory', subCategory)
            const isSelected = selectedCategoryId === subCategory.id;
            return (
              <Link
                key={subCategory.id}
                to={`/${category}/${subCategory.slug}`}
                onClick={(e) => handleCategorySelect(e, subCategory.id, subCategory.slug)}
                className={`group flex items-center justify-between rounded-lg bg-blue-50 p-4 transition-all hover:bg-blue-100 hover:shadow-md ${
                  isSelected ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                <span className="font-semibold text-gray-800">{subCategory.name}</span>
               
                  <ChevronRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-1" />
                
              </Link>
            )
          })}
        </div>

        {subCategories.length > 0 && hasMoreItems() && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full border-red-400 px-8 py-2 text-base font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={handleViewAllClick}
              disabled={isViewAllLoading}
            loading={isViewAllLoading}
            >
              View All Categories
            </Button>
          </div>
        )}
</div>
      
      </div>
    </section>
  );
};

export default SoftwareCategoryPage; 