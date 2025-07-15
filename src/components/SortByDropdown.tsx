import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import PillButton from "@/components/ui/PillButton";
import { ListFilter, Menu } from "lucide-react";

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
  // Parse the current value to get selected options
  const selectedOptions = value ? value.split(',') : [];
  
  // Get active groups based on selected options
  const activeGroups = SORT_OPTIONS.filter(group => 
    group.options.some(opt => selectedOptions.includes(opt.value))
  );
  
  // Handle group checkbox change
  const handleGroupChange = (groupKey: string, checked: boolean) => {
    const group = SORT_OPTIONS.find(g => g.key === groupKey);
    if (!group) return;
    
    let newSelected = [...selectedOptions];
    
    if (checked) {
      // Add the first option of the group if not already selected
      const firstOption = group.options[0];
      if (!newSelected.includes(firstOption.value)) {
        newSelected.push(firstOption.value);
      }
    } else {
      // Remove all options from this group
      newSelected = newSelected.filter(selected => 
        !group.options.some(opt => opt.value === selected)
      );
    }
    
    onChange(newSelected.join(','));
  };
  
  // Handle individual option change
  const handleOptionChange = (optionValue: string) => {
    let newSelected = [...selectedOptions];
    
    if (newSelected.includes(optionValue)) {
      // Remove the option
      newSelected = newSelected.filter(selected => selected !== optionValue);
    } else {
      // Add the option, but first remove any other option from the same group
      const group = SORT_OPTIONS.find(g => g.options.some(opt => opt.value === optionValue));
      if (group) {
        newSelected = newSelected.filter(selected => 
          !group.options.some(opt => opt.value === selected)
        );
        newSelected.push(optionValue);
      }
    }
    
    onChange(newSelected.join(','));
  };
  
  // Get display text for the button
  const getDisplayText = () => {
    if (selectedOptions.length === 0) return "Sort By";
    // if (selectedOptions.length === 1) {
    //   const option = SORT_OPTIONS.flatMap(g => g.options).find(opt => opt.value === selectedOptions[0]);
    //   const group = SORT_OPTIONS.find(g => g.options.some(opt => opt.value === selectedOptions[0]));
    //   return `${group?.label}: ${option?.label}`;
    // }
    return `Sort By (${selectedOptions.length})`;
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild >
        <PillButton icon={<ListFilter className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} className="text-xs cursor-pointer">
          {getDisplayText()}
        </PillButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-screen sm:w-64 p-4 rounded-xl bg-white border shadow-lg"
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        {SORT_OPTIONS.map(group => {
          const checked = activeGroups.some(ag => ag.key === group.key);
          const selectedOptionInGroup = group.options.find(opt => selectedOptions.includes(opt.value));
          
          return (
            <div key={group.key} className="mb-3 last:mb-0">
              <label className="flex items-center gap-2 cursor-pointer select-none mb-2">
                <span
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    checked ? 'border-red-500 bg-red-500' : 'border-gray-300 bg-white'
                  }`}
                >
                  {checked && (
                    <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className={`font-semibold text-base ${checked ? 'text-gray-800' : 'text-gray-600'}`}>
                  {group.label}
                </span>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => handleGroupChange(group.key, e.target.checked)}
                  className="hidden"
                />
              </label>
              
              <div className="pl-7 flex flex-col gap-1.5">
                {group.options.map(opt => {
                  const selected = selectedOptions.includes(opt.value);
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
                        onChange={() => handleOptionChange(opt.value)}
                        className="hidden"
                      />
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Clear all button */}
        {selectedOptions.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={() => onChange('')}
              className="w-full text-center text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 