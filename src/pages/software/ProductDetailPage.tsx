import React from "react";
import ProductNav from "@/components/product/ProductNav";
import ProductOverview from "@/components/product/ProductOverview";
import ProductDetailHeader from "@/components/ProductDetailHeader";
import ProductPricing from "@/components/product/ProductPricing";
import ProductMedia from "@/components/product/ProductMedia";
import ProductCompanyInfo from "@/components/product/ProductCompanyInfo";

export default function ProductDetailPage() {
  // Dummy data
  const product = {
    name: "Cloudflare Application Security & Performance",
    rating: 4.7,
    reviewCount: 1562,
    logoUrl: "https://placehold.co/128x128/fce7f3/4a044e?text=Logo", // Placeholder
    bannerUrl: "https://placehold.co/1200x300/6d28d9/ffffff?text=Banner", // Placeholder
    entryPrice: "$ Free",
  };

  return (
    <div className="bg-white min-h-[100vh]">
      <ProductDetailHeader product={product} />
      <ProductNav />
      <main className="w-full">
        <section id="product-overview" className="bg-[#F7F7F7]">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <ProductOverview />
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

            <ProductPricing />
          </div>
        </section>
        <section id="media">
          <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
            <ProductMedia />
          </div>
        </section>
        <section id="company-info">
            <ProductCompanyInfo />
        </section>
        {/* You can add more sections here for other tabs */}
      </main>
    </div>
  );
}
