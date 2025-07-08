import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useSoftwareCategories, useSolutionCategories } from "@/hooks/useCategoryOptions";
import SecondaryLoader from "@/components/ui/SecondaryLoader";

const SoftwareCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [viewAll, setViewAll] = useState(false);
  const page = 1;
  const limit = viewAll ? 1000 : 12; // Load all if viewAll is true
  
  let subCategories: { name: string; slug: string; id: string }[] = [];
  let isSoftwareLoading = false;
  let isSoftwareError = false;
  let isSolutionLoading = false;
  let isSolutionError = false;
  if (category.toLowerCase() === "software") {
    const {
      data: softwareResultRaw = [] as any,
      isLoading: isSoftwareLoading = true,
      isError: isSoftwareError = true,
    } = useSoftwareCategories(page, limit);
    // Get unique categories from software list
    const softwareResult = softwareResultRaw as { data: string[]; pagination: any } | undefined 

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

  if (isSoftwareLoading || isSolutionLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <SecondaryLoader />
      </div>
    );
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

<div className="sm:min-h-[48vh]">
<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3  ">
          {subCategories.map((subCategory: any) => {
            console.log('subCategory', subCategory)
          return (
              <Link
                key={subCategory.id}
                to={`/${category}/${subCategory.slug}`}
                className="group flex items-center justify-between rounded-lg bg-blue-50 p-4 transition-all hover:bg-blue-100 hover:shadow-md"
              >
                <span className="font-semibold text-gray-800">{subCategory.name}</span>
                <ChevronRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-1" />
              </Link>
            )
          })}
        </div>

        {subCategories.length > 0 && !viewAll && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full border-red-400 px-8 py-2 text-base font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setViewAll(true)}
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