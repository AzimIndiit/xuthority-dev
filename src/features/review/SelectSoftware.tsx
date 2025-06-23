import React, { useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Software } from "@/types/review";
import SoftwareSelectionCard from "./SoftwareSelectionCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import ReviewCategorySearch from "./ReviewCategorySearch";
import { useReviewStore } from "@/store/useReviewStore";
import useUserStore from "@/store/useUserStore";
import useUIStore from "@/store/useUIStore";

const popularCategories = [
  "All Categories",
  "Project Management",
  "Video Conferencing",
  "E-Commerce Platforms",
  "Marketing Automation",
  "Accounting",
  "Expense Management",
  "CRM Tools",
  "Online Backup",
  "AI Chatbots",
  "ERP Systems",
  "Others",
];

const softwareList: Software[] = [
  {
    id: "monday",
    name: "monday Work Management",
    logo: "https://placehold.co/64x64",
    logoBackground: "bg-red-500",
    rating: 4.6,
    reviewsCount: 2306,
  },
  {
    id: "smartsheet",
    name: "Smartsheet",
    logo: "https://placehold.co/64x64",
    logoBackground: "bg-red-500",
    rating: 4.5,
    reviewsCount: 4026,
  },
  {
    id: "notion",
    name: "Notion",
    logo: "https://placehold.co/64x64",
    logoBackground: "bg-red-500",
    rating: 4.7,
    reviewsCount: 2536,
  },
  {
    id: "asana",
    name: "Asana",
    logo: "https://placehold.co/64x64",
    logoBackground: "bg-red-500",
    rating: 4.5,
    reviewsCount: 3026,
  },
  {
    id: "slack",
    name: "Slack",
    logo: "https://placehold.co/64x64",
    logoBackground: "bg-red-500",
    rating: 4.7,
    reviewsCount: 6524,
  },
  {
    id: "airtable",
    name: "Airtable",
    logo: "https://placehold.co/64x64",
    rating: 4.6,
    reviewsCount: 6523,
    logoBackground: "bg-red-500",
  },
  {
    id: "trello",
    name: "Trello",
    logo: "https://placehold.co/64x64",
    rating: 4.5,
    reviewsCount: 8452,
    logoBackground: "bg-red-500",
  },
  {
    id: "clickup",
    name: "ClickUp",
    logo: "https://placehold.co/64x64",
    rating: 4.7,
    reviewsCount: 5620,
    logoBackground: "bg-red-500",
  },
  {
    id: "wrike",
    name: "Wrike",
    logo: "https://placehold.co/64x64",
    rating: 4.3,
    reviewsCount: 4513,
    logoBackground: "bg-red-500",
  },
];

const SelectSoftware = ({
  setShowStepper,
}: {
  setShowStepper?: (show: boolean) => void;
}) => {
  const { isLoggedIn } = useUserStore();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const { selectedSoftware, setSelectedSoftware } = useReviewStore();
  const setCurrentStep = useReviewStore((state) => state.setCurrentStep);
  const getSelectedSoftware = () => {
    return softwareList.find((s) => s.id === selectedSoftware);
  };

  return (
    <div className="space-y-8">
      {selectedSoftware && (
        <div className="sm:hidden block">
          <button
            onClick={() => {
              setShowStepper && setShowStepper(true);
              setSelectedSoftware(null);
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
        </div>
      )}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Search for tools to power your workplace.
        </h2>
        <p className="mt-2 text-gray-600">
          If you're researching new business software or services, you know how
          helpful reviews from real people can be. Our community is a place for
          professionals to help one another find the best business solutions.
        </p>
      </div>

      <ReviewCategorySearch
        popularMentions={popularCategories}
        onSearch={() => {}}
      />

      <RadioGroup
        value={selectedSoftware || ""}
        onValueChange={setSelectedSoftware}
      >
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
          {softwareList.map((software) => (
            <label key={software.id} htmlFor={software.id} className="h-full">
              <SoftwareSelectionCard
                software={software}
                isSelected={selectedSoftware === software.id}
              />
            </label>
          ))}
        </div>
      </RadioGroup>

      {/* Footer */}
      <div className="mt-12">
        <div className="flex justify-between items-center gap-2">
          <div>
            {selectedSoftware && (
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-14 h-14 rounded-lg border-2 border-red-500 bg-red-50 flex items-center justify-center">
                    <img
                      src={getSelectedSoftware()?.logo}
                      alt={getSelectedSoftware()?.name}
                      className="w-10 h-10 object-contain rounded-lg"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedSoftware(null)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-400 text-white rounded-full flex items-center justify-center text-xs shadow hover:bg-gray-500"
                    aria-label="Remove selection"
                  >
                    ×
                  </button>
                </div>
                <span className="ml-4 font-bold text-lg capitalize">
                  {getSelectedSoftware()?.name}
                </span>
              </div>
            )}
          </div>
          <Button
            size="lg"
            variant="default"
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedSoftware}
            onClick={() => {
              if(!isLoggedIn) {
                openAuthModal();
                return;
              }
              setShowStepper && setShowStepper(false);
              setCurrentStep(2);
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SelectSoftware;
