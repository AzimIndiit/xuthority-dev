import { StyledAccordion } from "@/components/ui/StyledAccordion";

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
  return (
    <div className="py-10">
      <h2 className="text-xl font-bold text-gray-900 mb-8">
        Features
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {features.map((feature: any) => (
          <StyledAccordion
            key={feature.title}
            title={feature.title}
            items={feature.description}
            isOpenByDefault={true}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductFeatures; 