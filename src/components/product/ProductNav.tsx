import { useState, useEffect, useRef } from "react";
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
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Function to scroll tab into view
  const scrollTabIntoView = (tabId: string) => {
    // Small delay to ensure DOM is ready and avoid conflicts
    setTimeout(() => {
      const tabElement = document.querySelector(`a[href="#${tabId}"]`) as HTMLElement;
      if (tabElement) {
        // Check if tab is already in view to avoid unnecessary scrolling
        const container = tabElement.parentElement?.parentElement;
        if (container) {
          const containerRect = container.getBoundingClientRect();
          const tabRect = tabElement.getBoundingClientRect();
          
          // Only scroll if tab is not fully visible
          if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
            tabElement.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "center"
            });
          }
        }
      }
    }, 50);
  };

  useEffect(() => {
    const handleScroll = () => {
      // Don't update activeTab if we're in the middle of a programmatic scroll
      if (isScrollingRef.current) return;

      const sections = tabs.map((tab) => document.getElementById(tab.id)).filter(Boolean);
      if (sections.length === 0) return;

      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const navOffset = 150; // Navigation height offset

      let newActiveTab = tabs[0].id; // Default to first tab

      // Find which section is most visible in the viewport
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollPosition;
        const sectionBottom = sectionTop + rect.height;

        // Check if section is in viewport or if we've scrolled past the start
        if (scrollPosition + navOffset >= sectionTop - 100) {
          newActiveTab = tabs[i].id;
        }
      }

      // Only update if the active tab actually changed
      if (newActiveTab !== activeTab) {
        setActiveTab(newActiveTab);
        // Scroll the newly active tab into view on mobile
        scrollTabIntoView(newActiveTab);
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    // Also listen for resize to recalculate on orientation change
    window.addEventListener("resize", throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      window.removeEventListener("resize", throttledScroll);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [tabs, activeTab]);

  // Initial check on mount to set correct active tab
  useEffect(() => {
    const checkInitialActiveTab = () => {
      const sections = tabs.map((tab) => document.getElementById(tab.id)).filter(Boolean);
      if (sections.length === 0) return;

      const scrollPosition = window.scrollY;
      const navOffset = 150;

      let newActiveTab = tabs[0].id;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (!section) continue;

        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + scrollPosition;

        if (scrollPosition + navOffset >= sectionTop - 100) {
          newActiveTab = tabs[i].id;
        }
      }

      setActiveTab(newActiveTab);
    };

    // Wait a bit for sections to render
    setTimeout(checkInitialActiveTab, 100);
  }, []);

  const handleTabClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    tabId: string
  ) => {
    e.preventDefault();
    
    // Immediately set the active tab for instant visual feedback
    setActiveTab(tabId);
    
    // Scroll the clicked tab into view (especially important on mobile)
    scrollTabIntoView(tabId);
    
    // Flag that we're doing a programmatic scroll
    isScrollingRef.current = true;
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
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
      
      // Re-enable scroll listener after scroll animation completes
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false;
      }, 600); // Allow 600ms for smooth scroll to complete
    } else {
      isScrollingRef.current = false;
    }
  };

  return (
    <div className=" bg-white/80 backdrop-blur-sm ">
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
                    "whitespace-nowrap rounded-lg px-4 py-4 text-xs lg:text-sm font-semibold text-gray-600 transition-all duration-300 ease-in-out",
                    activeTab === tab.id
                      ? "bg-[#E91515] text-white shadow-md transform scale-105"
                      : "hover:bg-gray-200 hover:scale-102"
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
