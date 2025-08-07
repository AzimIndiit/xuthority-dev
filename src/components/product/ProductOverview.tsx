import React, { useState } from "react";
import { Newspaper, Globe, Users, Building2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProductFeatures from "./ProductFeatures";
import ProductIntegrations from "./ProductIntegrations";
import { ReadMoreText } from "../ui";

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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const renderDetailWithViewAll = (
    data: string, 
    sectionKey: string, 
    maxItems: number = 20
  ) => {
    if (data === 'N/A' || !data) {
      return data;
    }

    const items = data.split(',').map(item => item.trim()).filter(item => item.length > 0);
    
    if (items.length <= maxItems) {
      return  <span className="ml-1">( <span>{items.join(', ')}</span>)</span> ;
    }
    

    const isExpanded = expandedSections[sectionKey];
    const displayItems = isExpanded ? items : items.slice(0, maxItems);
    const hasMore = items.length > maxItems;
    return (
      <div className="space-y-2">
       ( <span>{displayItems.join(', ')}</span>)
        {hasMore && (
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSection(sectionKey)}
              className="!text-xs p-2 h-6 rounded-full mt-1"
            >
              {isExpanded ? 'Show Less' : `View All (+${items.length - maxItems})`}
            </Button>
          </div>
        )}
      </div>
    );
  };

  const fullText = product.description;
  const truncatedText = fullText.substring(0, 350) + "...";

  const productDetails = {
    name: product.name,
    description: product.description,
    website: product.websiteUrl ,
    languages: product.languages?.map((language: any) => language.name).join(', ') ,
    users: product.whoCanUse?.map((user: any) => user.name).join(', ') ,
    industries: product.industries?.map((industry: any) => industry.name).join(', ') ,
    marketSegment: product.marketSegment?.map((marketSegment: any) => marketSegment.name).join(', ') ,
  };

  return (
    <div className="py-4 md:py-10 ">
      <h2 className="text-2xl md:text-2xl font-bold text-gray-900">
        {productDetails.name} Overview
      </h2>
      <ReadMoreText
          content={fullText}
          maxLines={4}
          className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line"
          buttonClassName="text-blue-600 hover:text-blue-800"
        >
           {/* {fullText} */}
          </ReadMoreText>
      {/* <p className="mt-4 text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
        {fullText}
        {/* {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-blue-600 hover:underline ml-1"
          >
            See More
          </button>
        )} */}
      {/* </p> */} 

      {/* <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900">Product Description</h3>
        <p className="mt-3 text-gray-700">{productDetails.description}</p>
      </div> */}

      <div className="mt-10">
        <h3 className="text-2xl font-bold text-gray-900">Other Details</h3>
        <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-x-44">
          {/* Left Column */}
          <div>
            <DetailItem icon={Newspaper}>
              <p>
                <span className="font-semibold">Product Website</span> (
                <a
                  href={`${productDetails.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all "
                >
                  {productDetails.website.length > 30 ? productDetails.website.substring(0, 30) + "..." : productDetails.website}
                </a>
                )
              </p>
            </DetailItem>
            {  productDetails.languages &&<DetailItem icon={Globe}>
                <div>
                  <span className="font-semibold">Languages</span> 
                  {renderDetailWithViewAll(productDetails.languages, 'languages')}
                  
                </div>
              </DetailItem>}
            {productDetails.industries && <DetailItem icon={Building2}>
              <div>
                <span className="font-semibold">Industries</span> 
                {renderDetailWithViewAll(productDetails.industries, 'industries')}
                
              </div>
            </DetailItem>}
          </div>
          {/* Right Column */}
          <div>
            {productDetails.users && <DetailItem icon={Users}>
              <div>
                <span className="font-semibold">Users</span> 
                {renderDetailWithViewAll(productDetails.users, 'users')}
                
              </div>
            </DetailItem>}
            {productDetails.marketSegment && <DetailItem icon={TrendingUp}>
              <div>
                <span className="font-semibold">Market Segment</span> 
                {renderDetailWithViewAll(productDetails.marketSegment, 'marketSegment')}
                
              </div>
            </DetailItem>}
          </div>
        </div>
      </div>
      {product.features.length > 0 && <ProductFeatures features={product.features} />}
      {product.integrations.length > 0 && <ProductIntegrations integrations={product.integrations} />}
    </div>
  );
};

export default ProductOverview; 