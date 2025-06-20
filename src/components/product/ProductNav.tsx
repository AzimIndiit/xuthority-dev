import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MessageSquareWarning } from "lucide-react";

const ProductNav = () => {
  const tabs = [
    { value: "product-overview", label: "Product Overview" },
    { value: "pricing", label: "Pricing" },
    { value: "media", label: "Media" },
    { value: "company-info", label: "Company Info" },
    { value: "reviews", label: "Reviews" },
  ];

  return (
    <div className="my-3 w-full  lg:max-w-screen-xl mx-auto sm:px-6">
      <div className="flex w-full flex-col items-start sm:flex-row sm:items-center sm:justify-between ">
        <div className="w-full overflow-x-auto sm:w-auto">
          <Tabs defaultValue="product-overview">
            <TabsList className="inline-flex h-auto rounded-xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="whitespace-nowrap rounded-lg px-4 py-2 text-xs lg:text-sm font-semibold text-gray-600 data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        <div className="hidden flex-shrink-0 items-center gap-6 sm:flex">
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
          >
            <Users className="h-4 w-4" />
            Community
          </a>
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
          >
            <MessageSquareWarning className="h-4 w-4" />
            Disputes
          </a>
        </div>
      </div>

      <div className=" flex w-full border-y sm:hidden">
        <a
          href="#"
          className="flex flex-1 items-center justify-center gap-2 border-r py-3 text-sm font-medium text-blue-600"
        >
          <Users className="h-5 w-5" />
          <span>Community</span>
        </a>
        <a
          href="#"
          className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-red-600"
        >
          <MessageSquareWarning className="h-5 w-5" />
          <span>Disputes</span>
        </a>
      </div>
    </div>
  );
};

export default ProductNav; 