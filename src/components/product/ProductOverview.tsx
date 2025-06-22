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

const ProductOverview = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const fullText =
    `Cloudflare is the cloud for the "everywhere world". At Cloudflare, we have our eyes set on an ambitious goal -- to help build a better Internet. Today, everything needs to be connected to everything everywhere, all the time. This hyperconnectivity creates new challenges related to security, performance, resilience and privacy. As the world's first connectivity cloud, Cloudflare helps connect and protect millions of customers globally. Everyone from individuals to the world's largest enterprises use our unified platform of networking, security, and developer services to succeed in the ever-evolving digital landscape.`;
  const truncatedText = fullText.substring(0, 350) + "...";

  const productDetails = {
    name: "Cloudflare Application Security and Performance",
    description:
      "Cloudflare Application Security and Performance solutions provide performance, reliability, and security for all of your web applications and APIs, wherever they are hosted and wherever your users are.",
    website: "www.cloudflare.com",
    languages:
      "German, English, French, Italian, Japanese, Korean, Dutch, Polish, Portuguese, Russian, Spanish, Swedish, Turkish, Chinese (Traditional)",
    users: "Web Developer, Software Engineer",
    industries: "Marketing & Advertising, IT and Services",
    marketSegment: "63% Small-Business, 29% Mid-Market",
  };

  return (
    <div className="py-4 md:py-8 ">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
        {productDetails.name} Overview
      </h2>
      <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base">
        {isExpanded ? fullText : truncatedText}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:underline ml-1"
          >
            See More
          </button>
        )}
      </p>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900">Product Description</h3>
        <p className="mt-3 text-gray-700">{productDetails.description}</p>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900">Other Details</h3>
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
                  className="text-blue-600 hover:underline"
                >
                  {productDetails.website}
                </a>
                )
              </p>
            </DetailItem>
            <DetailItem icon={Globe} >
              <p className="font-semibold">Languages</p>
              <p className="text-gray-600">{productDetails.languages}</p>
            </DetailItem>
          </div>
          {/* Right Column */}
          <div>
            <DetailItem icon={Users}>
              <p>
                <span className="font-semibold">Users</span> (
                {productDetails.users})
              </p>
            </DetailItem>
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
      <ProductFeatures />
      <ProductIntegrations />
    </div>
  );
};

export default ProductOverview; 