import React, { useState } from "react";
import { Newspaper, Globe, Users, Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductFeatures from "./ProductFeatures";
import ProductIntegrations from "./ProductIntegrations";

interface DetailItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  isLast?: boolean;
}

const DetailItem: React.FC<DetailItemProps> = ({
  icon: Icon,
  children,
  isLast = false,
}) => (
  <div
    className={cn(
      "flex items-start gap-3 py-4",
      !isLast && "border-b border-gray-200"
    )}
  >
    <Icon className="h-5 w-5 flex-shrink-0 text-gray-500" />
    <div className="flex-grow text-sm text-gray-800">{children}</div>
  </div>
);

const ProductOverview = ({product}: {product: any}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText = product.description;
  const truncatedText = fullText.substring(0, 350) + "...";

  const productDetails = {
    name: product.name,
    description: product.description,
    website: product.websiteUrl || 'N/A',
    languages: product.languages?.map((language: any) => language.name).join(', ')  || 'N/A',
    users: product.whoCanUse?.map((user: any) => user.name).join(', ') || 'N/A',
    industries: product.industries?.map((industry: any) => industry.name).join(', ') || 'N/A',
    marketSegment: product.marketSegment?.map((marketSegment: any) => marketSegment.name).join(', ') || 'N/A',
  };

  return (
    <div className="py-4 md:py-10 ">
      <h2 className="text-2xl md:text-2xl font-bold text-gray-900">
        {productDetails.name} Overview
      </h2>
      <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
        {fullText}
        {/* {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:underline ml-1"
          >
            See More
          </button>
        )} */}
      </p>

      {/* <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900">Product Description</h3>
        <p className="mt-3 text-gray-700">{productDetails.description}</p>
      </div> */}

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900">Other Details</h3>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
          {/* Left Column */}
          <div className="max-w-md">
            <DetailItem icon={Newspaper}>
              <p>
                <span className="font-semibold">Product Website</span> (
                <a
                  href={`https://${productDetails.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all "
                >
                  {productDetails.website.length > 30 ? productDetails.website.substring(0, 30) + "..." : productDetails.website}
                </a>
                )
              </p>
            </DetailItem>
            <DetailItem icon={Globe} >
            <p>
                <span className="font-semibold">Languages</span> (
                {productDetails.languages})
              </p>
             
            </DetailItem>
            <DetailItem icon={Users}>
              <p>
                <span className="font-semibold">Users</span> (
                {productDetails.users})
              </p>
            </DetailItem>
          </div>
          {/* Right Column */}
          <div>
          
            <DetailItem icon={Building2}>
              <p>
                <span className="font-semibold">Industries</span> (
                {productDetails.industries})
              </p>
            </DetailItem>
            <DetailItem icon={TrendingUp} >
              <p>
                <span className="font-semibold">Market Segment</span> (
                {productDetails.marketSegment})
              </p>
            </DetailItem>
          </div>
        </div>
      </div>
      {product.features.length > 0 && <ProductFeatures features={product.features} />}
      {product.integrations.length > 0 && <ProductIntegrations integrations={product.integrations} />}
    </div>
  );
};

export default ProductOverview; 