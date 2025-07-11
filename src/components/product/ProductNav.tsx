import { useState, useEffect } from "react";
import { Users, MessageSquareWarning } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";

const ProductNav = () => {
  const { category, subCategory, productSlug } = useParams();
  console.log('category', category,subCategory)
  const tabs = [
    { id: "product-overview", label: "Product Overview" },
    { id: "pricing", label: "Pricing" },
    { id: "media", label: "Media" },
    { id: "company-info", label: "Company Info" },
    { id: "reviews", label: "Reviews" },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  useEffect(() => {
    const handleScroll = () => {
      const sections = tabs.map((tab) => document.getElementById(tab.id));
      const scrollPosition = window.scrollY + 150; // Offset for nav height

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(tabs[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs]);

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tabId: string
  ) => {
    e.preventDefault();
    setActiveTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      const offset = 120; // Nav height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className=" bg-white/80 backdrop-blur-sm">
      <div className="my-3 w-full lg:max-w-screen-xl mx-auto sm:px-6">
        <div className="flex w-full flex-col items-start sm:flex-row sm:items-center sm:justify-between ">
          <div className="w-full overflow-x-auto sm:w-auto">
            <div className="inline-flex h-auto rounded-xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={(e) => handleTabClick(e, tab.id)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-4 py-4 text-xs lg:text-sm font-semibold text-gray-600 transition-colors duration-200",
                    activeTab === tab.id
                      ? "bg-[#E91515] text-white shadow-md"
                      : "hover:bg-gray-200"
                  )}
                >
                  {tab.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden flex-shrink-0 items-center gap-6 sm:flex">
            <a
              href={`/product-detail/${productSlug}/community`}
              className="flex items-center gap-1.5 text-sm font-medium text-[#0071e3] hover:underline"
            >
              <Users className="h-4 w-4" />
              Community
            </a>
            <a
              href={`/product-detail/${productSlug}/disputes`}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:underline"
            >
              <MessageSquareWarning className="h-4 w-4" />
              Disputes
            </a>
          </div>
        </div>

        <div className="flex w-full border-y sm:hidden mt-3">
          <a
            href={`/product-detail/${productSlug}/community`}
            className="flex flex-1 items-center justify-center gap-2 border-r py-3 text-sm font-medium text-[#0071e3]"
          >
            <Users className="h-5 w-5" />
            <span>Community</span>
          </a>
          <a
            href={`/product-detail/${productSlug}/disputes`}
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-red-600"
          >
            <MessageSquareWarning className="h-5 w-5" />
            <span>Disputes</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductNav;
