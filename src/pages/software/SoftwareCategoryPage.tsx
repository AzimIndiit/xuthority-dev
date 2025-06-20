import React from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

// This would typically come from a CMS or API
const categoriesData: { [key: string]: string[] } = {
  software: [
    "Artificial Intelligence", "Data Privacy", "Professional Services",
    "Project Management", "Video Conferencing", "E-Commerce Platforms",
    "Design", "Ecosystem Service Providers", "Development",
    "Sales Tools", "Routers", "Marketing Services",
    "Security Hardware", "Servers", "Staffing Services",
    "Marketing", "Storage", "Supply Chain & Logistics",
    "Digital Advertising Tech", "ERP Systems", "Switches",
    "Translation Services", "Value-Added Resellers (VARs)", "Security",
    "Governance, Risk & Compliance", "Vertical Industry", "Greentech",
    "Hosting", "Analytics Tools & Software", "AR/VR",
    "IoT Management", "B2B Marketplaces", "IT Infrastructure",
    "Business Services", "CAD & PLM", "Collaboration & Productivity",
    "IT Management", "E-Commerce Platforms", "Marketing Automation",
    "Accounting", "Expense Management", "Other Services",
    "Content Management", "Office Management Software", "Other Services"
  ],
  // Add other main categories here if needed
};

const SoftwareCategoryPage = () => {
  const { category = "software" } = useParams<{ category: string }>();

  const subCategories = categoriesData[category.toLowerCase()] || [];

  const toUrlSlug = (text: string) => {
    return text.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
  }

  return (
    <section  className="flex justify-center items-center  py-8 ">
      <div className="w-full lg:max-w-screen-xl mx-auto  px-4 sm:px-6 ">
        <div className="">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </h2>
          {/* <div className="mt-6 border-t border-yellow-400 w-24 mx-auto sm:mx-0" /> */}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subCategories.map((subCategory) => (
            <Link
              key={subCategory}
              to={`/${category}/${toUrlSlug(subCategory)}`}
              className="group flex items-center justify-between rounded-lg bg-blue-50 p-4 transition-all hover:bg-blue-100 hover:shadow-md"
            >
              <span className="font-semibold text-gray-800">{subCategory}</span>
              <ChevronRight className="h-5 w-5 text-gray-500 transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>

        {subCategories.length > 0 && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="outline"
              className="rounded-full border-red-400 px-8 py-2 text-base font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              View All Categories
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default SoftwareCategoryPage; 