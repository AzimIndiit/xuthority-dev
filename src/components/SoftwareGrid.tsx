import { useState } from "react";
import { Button } from "./ui/button";
import SoftwareCard from "./home/SoftwareCard";

const DUMMY_LOGO = "https://placehold.co/48x48/png";

const categories = [
  "Project Management",
  "Video Conferencing",
  "E-Commerce Platforms",
  "Marketing Automation",
  "Accounting",
  "Expense Management",
  "CRM Tools",
  "Online Backup",
  "AI Chatbots",
  "Social Media Analytics",
];

const softwareData = [
  {
    name: "monday Work Management",
    logo: 'https://placehold.co/64x64?text=M',
    rating: 4.5,
    reviewCount: 2306,
    logoBackground: "bg-red-50"
  },
  {
    name: "Smartsheet",
    logo: 'https://placehold.co/64x64?text=S',
    rating: 4.5,
    reviewCount: 4026,
    logoBackground: "bg-blue-50"
  },
  {
    name: "Notion",
    logo: 'https://placehold.co/64x64?text=N',
    rating: 4.5,
    reviewCount: 2306,
    logoBackground: "bg-gray-100"
  },
  {
    name: "Asana",
    logo: 'https://placehold.co/64x64?text=A',
    rating: 4.5,
    reviewCount: 3026,
    logoBackground: "bg-pink-50"
  },
  {
    name: "Slack",
    logo: 'https://placehold.co/64x64?text=S',
    rating: 4.5,
    reviewCount: 6524,
    logoBackground: "bg-purple-50"
  },
  {
    name: "Airtable",
    logo: 'https://placehold.co/64x64?text=A',
    rating: 4.5,
    reviewCount: 6523,
    logoBackground: "bg-green-50"
  },
  {
    name: "Trello",
    logo: 'https://placehold.co/64x64?text=T',
    rating: 4.5,
    reviewCount: 6523,
    logoBackground: "bg-blue-50"
  },
  {
    name: "Wrike",
    logo: 'https://placehold.co/64x64?text=W',
    rating: 4.5,
    reviewCount: 4513,
    logoBackground: "bg-green-50"
  }
];

export default function SoftwareGrid() {
  const [activeCategory, setActiveCategory] = useState(categories[0]);

  return (
    <section className="py-8 px-2 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-b from-red-100/50 via-white to-red-100/50">
      <div className="w-full lg:max-w-screen-xl mx-auto">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-8 text-gray-900">
          The Most Widely Used Software Categories.
        </h2>
        <div className="flex flex-col sm:flex-row  gap-4 lg:gap-8 items-start">
          {/* Mobile: horizontal scrollable pills */}
          <div className="flex flex-col sm:hidden w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Softwares</h2>
              <button
                className="text-red-600 font-semibold text-sm flex items-center gap-1 hover:underline"
                onClick={() => {/* handle see all */}}
              >
                See All Softwares <span aria-hidden>→</span>
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`px-5 py-2 rounded-xl text-sm  whitespace-nowrap font-medium transition-colors ${
                    cat === activeCategory
                      ? "bg-red-600 text-white"
                      : "bg-white border border-gray-200 text-black"
                  }`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop: sidebar as before */}
          <aside className="hidden sm:block w-48 lg:w-64 flex-shrink-0 mb-4 md:mb-0 space-y-4 rounded-t-xl overflow-hidden md:static lg:sticky lg:top-10">
            <nav className="bg-white border border-gray-200 rounded-xl  ">
              <ul className="divide-y divide-gray-200">
                {categories.map((cat) => (
                  <li key={cat}>
                    <Button
                      variant={cat === activeCategory ? "default" : "ghost"}
                      className={`w-full justify-start rounded-none px-6 py-4 text-left transition-colors font-medium text-sm sm:text-sm md:text-sm lg:text-base ${
                        cat === activeCategory
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "text-gray-900 hover:bg-gray-50"
                      }`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="">
              <Button
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold flex items-center justify-center gap-2 "
              >
                See All Softwares
                <span aria-hidden className="ml-1">→</span>
              </Button>
            </div>
          </aside>

          {/* Software Cards Grid */}
          <div className="flex-1 w-full mt-10">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 space-y-6">
              {softwareData.map((software) => (
                <SoftwareCard
                  key={software.name}
                  name={software.name}
                  logo={software.logo}
                  rating={software.rating}
                  reviewCount={software.reviewCount}
                  logoBackground={software.logoBackground}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 