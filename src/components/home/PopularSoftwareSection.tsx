import { StyledAccordion } from "@/components/ui/StyledAccordion";

const categories = [
  {
    title: "CAD Software",
    items: [
      "GIS Software",
      "Computer-Aided Manufacturing (CAM) Software",
      "Product Data Management (PDM) Software",
      "PCB Design Software",
    ],
  },
  {
    title: "Deep Learning Software",
    items: [
      "GIS Software",
      "Computer-Aided Manufacturing (CAM) Software",
      "Product Data Management (PDM) Software",
      "PCB Design Software",
    ],
  },
  {
    title: "IT Infrastructure Software",
    items: [
      "Operating System",
      "Server Virtualization Software",
      "Application Server Software",
      "Infrastructure as a Service (IaaS) Providers",
    ],
  },
  {
    title: "3D Design Software",
    items: [],
  },
  {
    title: "Endpoint Security Solutions",
    items: [],
  },
  {
    title: "Blockchain Software",
    items: [],
  },
  {
    title: "Deep Learning Software",
    items: [],
  },
  {
    title: "UTM Solutions",
    items: [],
  },
  {
    title: "CASB Solutions",
    items: [],
  },
  {
    title: "Network Security Solutions",
    items: [],
  },
  {
    title: "Project Management",
    items: [],
  },
];

const PopularSoftwareSection = () => {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Popular Software Categories
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center max-w-3xl mx-auto">
          Explore our most popular software categories to find the right solution
          for your business needs.
        </p>
      </div>

      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 mt-12">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <StyledAccordion
              key={cat.title + idx}
              title={cat.title}
              items={cat.items}
              isOpenByDefault={idx < 3}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularSoftwareSection; 