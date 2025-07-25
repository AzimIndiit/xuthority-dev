import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import SoftwareCard from "./home/SoftwareCard";
import { useSoftwareOptions } from "@/hooks/useSoftwareOptions";
import { useProductsByCategory } from "@/hooks/useProducts";
import LottieLoader from "@/components/LottieLoader";
import { useNavigate } from "react-router-dom";
import SecondaryLoader from "./ui/SecondaryLoader";

const DUMMY_LOGO = "https://placehold.co/48x48/png";

const categories = [
  "Project Management",
  "Video Conferencing",
  "E-Commerce Platforms",
  "Marketing Automation",
  "Accounting",
  "Expense Management",
  "CRM Tools",
  "Online Backup",
  "AI Chatbots",
  "Social Media Analytics",
];

const softwareData = [
  {
    name: "monday Work Management",
    logo: 'https://placehold.co/64x64?text=M',
    rating: 4.5,
    reviewCount: 2306,
    logoBackground: "bg-red-50"
  },
  {
    name: "Smartsheet",
    logo: 'https://placehold.co/64x64?text=S',
    rating: 4.5,
    reviewCount: 4026,
    logoBackground: "bg-blue-50"
  },
  {
    name: "Notion",
    logo: 'https://placehold.co/64x64?text=N',
    rating: 4.5,
    reviewCount: 2306,
    logoBackground: "bg-gray-100"
  },
  {
    name: "Asana",
    logo: 'https://placehold.co/64x64?text=A',
    rating: 4.5,
    reviewCount: 3026,
    logoBackground: "bg-pink-50"
  },
  {
    name: "Slack",
    logo: 'https://placehold.co/64x64?text=S',
    rating: 4.5,
    reviewCount: 6524,
    logoBackground: "bg-purple-50"
  },
  {
    name: "Airtable",
    logo: 'https://placehold.co/64x64?text=A',
    rating: 4.5,
    reviewCount: 6523,
    logoBackground: "bg-green-50"
  },
  {
    name: "Trello",
    logo: 'https://placehold.co/64x64?text=T',
    rating: 4.5,
    reviewCount: 6523,
    logoBackground: "bg-blue-50"
  },
  {
    name: "Wrike",
    logo: 'https://placehold.co/64x64?text=W',
    rating: 4.5,
    reviewCount: 4513,
    logoBackground: "bg-green-50"
  }
];

function ProductSkeleton() {
  return (
    <div className="animate-pulse flex flex-col items-center bg-white rounded-xl border p-4 min-h-[180px]">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
      <div className="h-3 w-16 bg-gray-100 rounded" />
    </div>
  );
}



// Skeleton component for the software grid
const SoftwareGridSkeleton = () => (
   
   <div className="flex-1 w-full">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 !gap-y-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
);

export default function SoftwareGrid() {
  const {options:softwareOptions,isLoading:softwareLoading}=useSoftwareOptions(1,10)
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState(softwareOptions[0]?.slug);

  useEffect(() => {
    setActiveCategory(softwareOptions[0]?.slug)
  }, [softwareOptions])
  const {
    data: productsResult,
    isLoading,
    isFetching,
    isError,
    error
  } = useProductsByCategory(
    'software',
    activeCategory || '',
    "",
    1,
    8,
    {}
  );
  const products=Array.isArray(productsResult?.data) ? productsResult?.data : []

  // Show full skeleton loader when software options are loading
  if (softwareLoading) {
    return (
      <section className="py-8 px-2 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-red-100/50 via-white to-red-100/50">
        <div className="w-full lg:max-w-screen-xl mx-auto">
          {/* Title skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-8 sm:h-10 w-96 bg-gray-200 rounded animate-pulse" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 lg:gap-8 items-start">
            {/* Mobile skeleton */}
            <div className="flex flex-col sm:hidden w-full">
              <div className="flex items-center justify-between mb-3">
                <div className="h-7 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-32 bg-gray-200 rounded-xl animate-pulse flex-shrink-0" />
                ))}
              </div>
            </div>

            {/* Desktop sidebar skeleton */}
            <aside className="hidden sm:block w-48 lg:w-64 flex-shrink-0 mb-4 md:mb-0 space-y-4">
              <div className="bg-white border border-gray-200 rounded-xl">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-14 bg-gray-200 animate-pulse border-b border-gray-100 last:border-b-0" />
                ))}
              </div>
              <div className="h-12 bg-gray-200 rounded animate-pulse" />
            </aside>

            {/* Software cards grid skeleton */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 !gap-y-12">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-2 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-red-100/50 via-white to-red-100/50" >
      <div className="w-full lg:max-w-screen-xl mx-auto">
        <h2 className="text-2xl sm:text-5xl font-bold text-center max-w-3xl mx-auto mb-8 text-gray-900">
          The Most Widely Used Software Categories.
        </h2>
        <div className="flex flex-col sm:flex-row  gap-4 lg:gap-8 items-start">
          {/* Mobile: horizontal scrollable pills */}
          <div className="flex flex-col sm:hidden w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Softwares</h2>
              <button
                className="text-red-600 font-semibold text-sm flex items-center gap-1 hover:underline"
                onClick={() => {
                  navigate  (`/software`)
                }}
              >
                See All Softwares <span aria-hidden>→</span>
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {softwareOptions.map((cat) => (
                <button
                  key={cat.slug}
                  className={`px-5 py-2 rounded-xl text-sm  whitespace-nowrap font-medium transition-colors ${
                    cat.slug === activeCategory
                      ? "bg-red-600 text-white"
                      : "bg-white border border-gray-200 text-black"
                  }`}
                  onClick={() => setActiveCategory(cat.slug)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: sidebar as before */}
          <aside className="hidden sm:block w-48 lg:w-64 flex-shrink-0 mb-4 md:mb-0 space-y-4 rounded-t-xl overflow-hidden md:static lg:sticky lg:top-10">
            <nav className="bg-white border border-gray-200 rounded-xl  ">
              <ul className="divide-y divide-gray-200">
                  {softwareOptions.map((cat) => (
                  <li key={cat.slug} className="">
                    <Button
                      variant={cat.slug === activeCategory ? "default" : "ghost"}
                      className={`w-full justify-start rounded-none px-6 py-8 text-left transition-colors font-medium text-sm sm:text-sm md:text-sm lg:text-base h-10 ${
                        cat.slug === activeCategory
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveCategory(cat.slug)}
                    >
                      <span
                        className={`break-words ${
                          cat.label.length > 18 ? "block" : "inline"
                        }`}
                        style={
                          cat.label.length > 18
                            ? { wordBreak: "break-word", whiteSpace: "normal" }
                            : {}
                        }
                      >
                        {cat.label}
                      </span>
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="">
              <Button
                onClick={() => {
                  navigate  (`/software`)
                }}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold flex items-center justify-center gap-2 "
              >
                See All Softwares
                <span aria-hidden className="ml-1">→</span>
              </Button>
            </div>
          </aside>

          {/* Software Cards Grid */}
          <div className="flex-1 w-full min-h-[30vh] sm:min-h-[40vh] mt-10">
            {/* Show skeleton when products are loading or fetching */}
            {isLoading || isFetching ? (
              <SoftwareGridSkeleton />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px]">
                <img src="/svg/no_data.svg" alt="No products" className="w-32 h-32 sm:w-64 sm:h-64 mb-4" />
                <div className="text-gray-500 text-sm sm:text-lg font-medium">No products found in this category.</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 !gap-y-12">
                {products.map((product) => (
                  <SoftwareCard
                    id={product._id}
                    slug={product.slug}
                    key={product._id}
                    name={product.name}
                    logo={product.logoUrl}
                    rating={product.avgRating || 0}
                    reviewCount={product.totalReviews || 0}
                    logoBackground={product.brandColors || "bg-white"}
                    hasUserReviewed={product.hasUserReviewed}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 