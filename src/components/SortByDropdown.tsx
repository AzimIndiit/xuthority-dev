import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import PillButton from "@/components/ui/PillButton";
import { Menu } from "lucide-react";

const SORT_OPTIONS = [
  {
    key: "ratings",
    label: "Ratings",
    options: [
      { value: "ratings-desc", label: "High to Low" },
      { value: "ratings-asc", label: "Low to High" },
    ],
  },
  {
    key: "pricing",
    label: "Pricing",
    options: [
      { value: "pricing-desc", label: "High to Low" },
      { value: "pricing-asc", label: "Low to High" },
    ],
  },
  {
    key: "reviewCounts",
    label: "Review Counts",
    options: [
      { value: "reviewCounts-desc", label: "High to Low" },
      { value: "reviewCounts-asc", label: "Low to High" },
    ],
  },
];

interface SortByDropdownProps {
  value: string | null;
  onChange: (value: string) => void;
  children?: React.ReactNode;
  trigger?: React.ReactNode;
}

export default function SortByDropdown({ value, onChange }: SortByDropdownProps) {
  const activeGroup = SORT_OPTIONS.find(group => group.options.some(opt => opt.value === value));
  console.log('activeGroup', activeGroup)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PillButton icon={<Menu className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} className="text-xs ">
          Sort By
        </PillButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-screen sm:w-64 p-4 rounded-xl bg-white border shadow-lg"
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        {SORT_OPTIONS.map(group => {
          const checked = activeGroup?.key === group.key;
          return (
            <div key={group.key} className="mb-3 last:mb-0">
              <label className="flex items-center gap-2 cursor-pointer select-none mb-2">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    checked ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span className={`font-semibold text-base ${checked ? 'text-gray-800' : 'text-gray-600'}`}>
                  {group.label}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {
                    if (checked) onChange("");
                    else onChange(group.options[0].value);
                  }}
                  className="hidden"
                />
              </label>
              
              <div className="pl-7 flex flex-col gap-1.5">
                {group.options.map(opt => {
                  const selected = value === opt.value;
                  return (
                    <label key={opt.value} className={`flex items-center gap-2 cursor-pointer select-none ${!checked ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <span
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          selected ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {selected && <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />}
                      </span>
                      <span className={`text-base ${selected ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                        {opt.label}
                      </span>
                      <input
                        type="radio"
                        name={group.key}
                        checked={selected}
                        disabled={!checked}
                        onChange={() => onChange(opt.value)}
                        className="hidden"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 