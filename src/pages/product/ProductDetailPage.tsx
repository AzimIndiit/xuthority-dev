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

export default function ProductDetailPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const { data, isLoading, isError } = useProductBySlug(productSlug || "");
  const product : Product = data?.data;

  // Optionally, handle loading and error states
  if (isLoading) {
    return <div className="text-center py-12">Loading product...</div>;
  }
  if (isError || !product) {
    return <div className="text-center py-12 text-red-500">Product not found.</div>;
  }



  // Get minimum price from pricing array and format as currency
  const minPrice = Array.isArray(product.pricing) && product.pricing.length > 0
    ? Math.min(...product.pricing.map(p => Number(p.price) || 0))
    : null;

  // Map API product to ProductDetailHeader type
  const headerProduct = {
    name: product.name,
    rating: product.avgRating ?? 0,
    reviewCount: product.totalReviews ?? 0,
    logoUrl: product.logoUrl || '',
    bannerUrl: product.mediaUrls[0] || 'https://placehold.co/1200x300/6d28d9/ffffff?text=Banner',
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
      <ProductDetailHeader product={headerProduct}  productOwner={product.userId}/>
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

      {product.pricing.length > 0 &&      <ProductPricing pricing={product.pricing} />}
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
