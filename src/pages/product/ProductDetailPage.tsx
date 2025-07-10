import React from "react";
import { useParams } from "react-router-dom";
import { useProductBySlug } from "@/hooks/useProducts";
import ProductNav from "@/components/product/ProductNav";
import ProductOverview from "@/components/product/ProductOverview";
import ProductDetailHeader from "@/components/ProductDetailHeader";
import ProductPricing from "@/components/product/ProductPricing";
import ProductMedia from "@/components/product/ProductMedia";
import ProductCompanyInfo from "@/components/product/ProductCompanyInfo";
import ProductReviews from "@/components/product/ProductReviews";
import { Product } from "@/services/product";
import { formatCurrency } from '@/utils/formatCurrency';

// Skeleton component for the product detail page
const ProductDetailSkeleton = () => {
  return (
    <div className="bg-white min-h-[100vh]">
      {/* Header Skeleton */}
      <div className="relative">
        {/* Banner skeleton */}
        <div className="h-48 sm:h-64 lg:h-80 bg-gray-200 animate-pulse" />
        
        {/* Product info overlay skeleton */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6 lg:p-8">
          <div className="w-full lg:max-w-screen-xl mx-auto">
            <div className="flex items-end gap-4">
              {/* Logo skeleton */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-300 rounded-lg animate-pulse" />
              
              {/* Product info skeleton */}
              <div className="flex-1">
                <div className="h-8 bg-gray-300 rounded w-1/3 mb-2 animate-pulse" />
                <div className="flex items-center gap-4">
                  <div className="h-5 bg-gray-300 rounded w-24 animate-pulse" />
                  <div className="h-5 bg-gray-300 rounded w-32 animate-pulse" />
                </div>
              </div>
              
              {/* Price skeleton */}
              <div className="h-8 bg-gray-300 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation skeleton */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <div className="flex gap-8 py-4">
            {['Overview', 'Pricing', 'Media', 'Company', 'Reviews'].map((_, idx) => (
              <div key={idx} className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
            ))}
          </div>
        </div>
      </div>

      <main className="w-full">
        {/* Overview Section Skeleton */}
        <section className="bg-[#F7F7F7] py-12">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main content skeleton */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar skeleton */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section Skeleton */}
        <section className="py-12">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-lg p-6">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Media Section Skeleton */}
        <section className="py-12 bg-gray-50">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </section>

        {/* Company Info Section Skeleton */}
        <section className="py-12">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
              <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section Skeleton */}
        <section className="py-12 bg-gray-50">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <div className="h-8 bg-gray-200 rounded w-32 mb-8 animate-pulse" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2 animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded w-24 mb-4 animate-pulse" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default function ProductDetailPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { data, isLoading, isError } = useProductBySlug(productSlug || "");
  const product : Product = data?.data;

  // Show skeleton loader while loading
  if (isLoading) {
    return <ProductDetailSkeleton />;
  }
  
  if (isError || !product) {
    return <div className="text-center py-12 text-red-500">Product not found.</div>;
  }



  // Get minimum price from pricing array and format as currency
  const minPrice = Array.isArray(product.pricing) && product.pricing.length > 0
    ? Math.min(...product.pricing.map(p => Number(p.price) || 0))
    : null;

  // Map API product to ProductDetailHeader type
  // Helper function to detect if a URL is a video
  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v|3gp|ogv)(\?.*)?$/i.test(url);
  };

  // Filter media URLs to get only images
  const imageUrls = product.mediaUrls.filter(url => !isVideoUrl(url));
  
  const headerProduct = {
    name: product.name,
    rating: product.avgRating ?? 0,
    reviewCount: product.totalReviews ?? 0,
    logoUrl: product.logoUrl || '',
    bannerUrl: imageUrls[0] || 'https://placehold.co/1200x300/6d28d9/ffffff?text=Banner',
    entryPrice: minPrice !== null ? formatCurrency(minPrice) : 'N/A',
    brandColors: product.brandColors || '#ffffff',

  };

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic here
  };

  const handleFilterChange = (stars: number) => {
    console.log("Filter by stars:", stars);
    // Implement filter logic here
  };

  return (
    <div className="bg-white min-h-[100vh]">
      <ProductDetailHeader product={headerProduct}  productOwner={product.userId} id={product._id}/>
      <ProductNav />
      <main className="w-full">
        <section id="product-overview" className="bg-[#F7F7F7]">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <ProductOverview product={product} />
          </div>
        </section>
        <section id="pricing">
          {/* <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 z-0 h-full bg-gray-100"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 800'%3e%3cg fill-opacity='0.03' fill='gray'%3e%3cpath d='M-20.9,418.2C29.7,350.5,123.4,321,213.4,323.4c90,2.4,175.9,33.8,248.1,91.2c72.2,57.4,130.6,139.3,212,192.8c81.4,53.5,185,78.8,284.2,73.1c99.2-5.7,193.3-41.2,268.3-102.7c75-61.5,130.6-148.1,215.8-204.9c85.2-56.8,200.1-82.6,305.3-73.2c105.2,9.4,200.2,56.6,275.2,129.2l0,432.8l-1800,0L-20.9,418.2z'/%3e%3c/g%3e%3c/svg%3e")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top center",
              backgroundSize: "cover",
            }}
          /> */}
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            {/* Wavy line background */}

      {product.pricing.length > 0 &&      <ProductPricing pricing={product.pricing}  />}
          </div>
        </section>
        <section id="media">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <ProductMedia mediaUrls={product.mediaUrls || []} />
          </div>
        </section>
        <section id="company-info">
            <ProductCompanyInfo companyDescription={product.userId} />
        </section>
        <section id="reviews">
            <ProductReviews product={product} />
        </section>
        {/* You can add more sections here for other tabs */}
      </main>
    </div>
  );
}
