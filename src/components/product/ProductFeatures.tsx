import { StyledAccordion } from "@/components/ui/StyledAccordion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const featuresData = [
  {
    title: "Content",
    items: [
      "Static Content Caching",
      "Dynamic Content Routing",
      "Cache purging",
    ],
    isOpenByDefault: true,
  },
  {
    title: "Analysis",
    items: [
      "Logging and Reporting",
      "Issue Tracking",
      "Security Monitoring",
    ],
    isOpenByDefault: true,
  },
  {
    title: "Management",
    items: ["Dashboard", "Reports", "Logs"],
    isOpenByDefault: true,
  },
  {
    title: "Security",
    items: [],
  },
  {
    title: "Integration",
    items: [],
  },
  {
    title: "Controls",
    items: [],
  },
  {
    title: "Functionality",
    items: [],
  },
];

const ProductFeatures = ({features}: {features: any}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Show 6 features initially (2 rows on large screens, 3 rows on small screens)
  const featuresPerTwoRows = 6;
  const hasMoreFeatures = features.length > featuresPerTwoRows;
  const displayedFeatures = showAll ? features : features.slice(0, featuresPerTwoRows);

  return (
    <div className="py-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {displayedFeatures.map((feature: any) => (
          <StyledAccordion
            key={feature.title}
            title={feature.title}
            items={feature.description}
            isOpenByDefault={true}
          />
        ))}
      </div>
      
      {hasMoreFeatures && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="!text-sm px-6 py-2 rounded-full"
          >
            {showAll ? 'Show Less' : `View All Features (+${features.length - featuresPerTwoRows})`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductFeatures; 