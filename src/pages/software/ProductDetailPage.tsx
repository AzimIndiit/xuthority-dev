import React from "react";
import ProductNav from "@/components/product/ProductNav";
import ProductOverview from "@/components/product/ProductOverview";
import ProductDetailHeader from "@/components/ProductDetailHeader";
import ProductPricing from "@/components/product/ProductPricing";
import ProductMedia from "@/components/product/ProductMedia";
import ProductCompanyInfo from "@/components/product/ProductCompanyInfo";
import ProductReviews from "@/components/product/ProductReviews";
import { Review } from '@/types/review';

export default function ProductDetailPage() {
  // Dummy data
  const product = {
    name: "Cloudflare Application Security & Performance",
    rating: 4.7,
    reviewCount: 2306,
    logoUrl: "https://placehold.co/128x128/fce7f3/4a044e?text=Logo", // Placeholder
    bannerUrl: "https://placehold.co/1200x300/6d28d9/ffffff?text=Banner", // Placeholder
    entryPrice: "$ Free",
  };

  const reviewData = {
    productName: "Cloudflare Application Security and Performance",
    rating: 4.7,
    reviewCount: 2306,
    ratingDistribution: [
      { stars: 5, count: 987, percentage: 50 },
      { stars: 4, count: 786, percentage: 35 },
      { stars: 3, count: 655, percentage: 10 },
      { stars: 2, count: 235, percentage: 5 },
      { stars: 1, count: 12, percentage: 2 },
    ],
    popularMentions: [
      'All Reviews', 'Automations', 'Team', 'Team Members', 'Time Tracking',
      'Communication', 'Difference', 'Features', 'Organization', 'Platform',
      'Project Board', 'Projects', 'Task Lists', 'Task', 'Time Zones', 'Track',
    ],
  };

  const reviews: Review[] = [
    {
      id: '1',
      title: 'Reliable Security with Seamless Performance',
      rating: 4,
      date: 'Jan 18, 2025',
      content: 'Cloudflare delivers a powerful combination of security and performance, ensuring that web applications remain protected from cyber threats without compromising speed. With an advanced firewall, real-time DDoS mitigation, and a global CDN, Cloudflare helps businesses safeguard sensitive data, prevent downtime, and enhance user experience.',
      author: {
        name: 'Calista Mayasari',
        avatarUrl: 'https://i.pravatar.cc/48?u=1',
        title: 'Senior Payroll Administrator, Enterprise(> 1000 emp.)',
        verified: true,
      },
      tags: ['Validated Reviewer', 'Review source: Seller invite', 'Incentivized Review'],
    },
    {
      id: '2',
      title: 'Great for Speed, But Pricing Could Be Better',
      rating: 3,
      date: 'Jan 16, 2025',
      content: 'Cloudflare excels in accelerating website performance and fortifying security with its intelligent caching, load balancing, and threat detection features. Websites experience reduced latency and improved uptime, making it a great tool for businesses looking to enhance their digital presence. However, some of the premium features, such as advanced bot management and enterprise-level security controls.',
      author: {
        name: 'Carolyn Wilson',
        avatarUrl: 'https://i.pravatar.cc/48?u=2',
        title: 'Facilities Manager, Mid-Market(51-1000 emp.)',
        verified: true,
      },
      tags: ['Validated Reviewer', 'Review source: Seller invite', 'Incentivized Review'],
    },
    {
        id: '3',
        title: 'Comprehensive Protection, But Learning Curve Exists',
        rating: 4,
        date: 'Jan 15, 2025',
        content: "Cloudflare provides an extensive suite of security and performance tools, from web application firewalls to advanced traffic management, ensuring that businesses can protect and optimize their online assets. While the platform offers powerful capabilities, configuring its advanced settings and custom rules may be challenging for users unfamiliar with web security.",
        author: {
          name: 'Diego Díaz',
          avatarUrl: 'https://i.pravatar.cc/48?u=3',
          title: 'Co-CEO, Small-Business(50 or fewer emp.)',
          verified: true,
        },
        tags: ['Validated Reviewer', 'Review source: Seller invite', 'Incentivized Review'],
      },
  ];

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
        <section id="reviews">
            <ProductReviews
              {...reviewData}
              reviews={reviews}
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
            />
        </section>
        {/* You can add more sections here for other tabs */}
      </main>
    </div>
  );
}
