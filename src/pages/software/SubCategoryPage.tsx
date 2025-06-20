import SoftwareCard from "@/components/home/SoftwareCard";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Menu,
} from "lucide-react";
import SoftwareDetailCard from "@/components/SoftwareDetailCard";
import PillButton from "@/components/ui/PillButton";
import SortByDropdown from "@/components/SortByDropdown";
import FilterDropdown from "@/components/FilterDropdown";

const DUMMY_SOFTWARES = [
  {
    name: "monday Work Management",
    logo: "https://placehold.co/64x64?text=M",
    rating: 4.7,
    reviewCount: 2306,
    logoBackground: "bg-pink-100",
  },
  {
    name: "Smartsheet",
    logo: "https://placehold.co/64x64?text=S",
    rating: 4.4,
    reviewCount: 1578,
    logoBackground: "bg-blue-100",
  },
  {
    name: "Notion",
    logo: "https://placehold.co/64x64?text=N",
    rating: 4.7,
    reviewCount: 2306,
    logoBackground: "bg-gray-100",
  },
  {
    name: "Slack",
    logo: "https://placehold.co/64x64?text=S",
    rating: 4.4,
    reviewCount: 1578,
    logoBackground: "bg-cyan-100",
  },
  {
    name: "Airtable",
    logo: "https://placehold.co/64x64?text=A",
    rating: 4.7,
    reviewCount: 2306,
    logoBackground: "bg-yellow-100",
  },
  {
    name: "Trello",
    logo: "https://placehold.co/64x64?text=T",
    rating: 4.4,
    reviewCount: 1578,
    logoBackground: "bg-blue-100",
  },
  {
    name: "ClickUp",
    logo: "https://placehold.co/64x64?text=C",
    rating: 4.7,
    reviewCount: 2306,
    logoBackground: "bg-pink-100",
  },
  {
    name: "Wrike",
    logo: "https://placehold.co/64x64?text=W",
    rating: 4.4,
    reviewCount: 1578,
    logoBackground: "bg-green-100",
  },
];

const PAGE_SIZE = 8;

const exampleDescription =
  "Voted one of the top Global Software companies of 2023 on XUTHORITY, monday.com Work OS is a customisable platform where teams can create and shape the tools they need...";
const exampleUsers = "Project Manager, CEO";
const exampleIndustries = "Marketing & Advertising, IT and Services";
const exampleMarketSegment = "63% Small-Business, 29% Mid-Market";
const exampleEntryPrice = "$ Free";

const SubCategoryPage = () => {
  const { subCategory } = useParams<{ subCategory: string }>();
  const [page, setPage] = useState(1);
  const total = 230;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const [sortValue, setSortValue] = useState<string | null>("ratings-desc");
  const [filters, setFilters] = useState({
    segment: "all",
    categories: ["Project Management", "Accounting"],
    industries: ["IT & Services", "Computer Software"],
    price: [10, 250],
  });

  // For demo, repeat dummy data to fill the page
  const listings = Array(PAGE_SIZE)
    .fill(0)
    .map((_, i) => DUMMY_SOFTWARES[i % DUMMY_SOFTWARES.length]);

  return (
    <section className=" flex justify-center items-center  py-8  ">
      <div className="w-full lg:max-w-screen-xl mx-auto  px-4 sm:px-6  ">
        {/* Heading and controls */}
        <div className="flex flex-col flex-wrap md:flex-row md:items-center sm:justify-between mb-6 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {total} Listings in{" "}
            {subCategory ? subCategory.replace(/-/g, " ") : "Category"}{" "}
            Available
          </h2>
          <div className="flex  gap-2 sm:gap-4 items-start sm:items-center">
            <SortByDropdown value={sortValue} onChange={setSortValue} />
            <FilterDropdown filters={filters} onFilterChange={setFilters} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 space-y-6 mt-12">
          {listings.map((item, idx) => (
            <SoftwareDetailCard
              key={item.name + idx}
              name={item.name}
              logo={item.logo}
              logoBackground={item.logoBackground}
              rating={item.rating}
              reviewCount={item.reviewCount}
              description={exampleDescription}
              users={exampleUsers}
              industries={exampleIndustries}
              marketSegment={exampleMarketSegment}
              entryPrice={exampleEntryPrice}
            />
          ))}
        </div>
        {/* Pagination and showing text */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 gap-2">
          <div className="text-sm text-gray-600">
            Showing {start} to {end} of {total}
          </div>
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="icon"
                className="rounded-full border-gray-300 w-8 h-8"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            )).slice(0, 3)}
            {totalPages > 3 && <span className="px-2 text-gray-400">...</span>}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-gray-300"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubCategoryPage;
