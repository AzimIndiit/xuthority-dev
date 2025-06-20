import React from "react";
import ProductNav from "@/components/product/ProductNav";
import ProductOverview from "@/components/product/ProductOverview";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import ProductDetailHeader from "@/components/ProductDetailHeader";

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
      <Tabs defaultValue="product-overview" className="w-full">
        <ProductNav />
        <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
          <TabsContent value="product-overview">
            <ProductOverview />
          </TabsContent>
          {/* You can add more TabsContent components here for other tabs */}
        </div>
      </Tabs>
    </div>
  );
}
