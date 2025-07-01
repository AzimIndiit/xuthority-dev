import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import PillButton from "@/components/ui/PillButton";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useSoftwareCategories } from "@/hooks/useCategoryOptions";
import { useIndustryOptions } from "@/hooks/useIndustry";
import { useMarketSegmentOptions } from "@/hooks/useMarketSegmentOptions";


interface FilterDropdownProps {
  filters: any;
  onFilterChange: (filters: any) => void;
  onApply?: () => void;
  onClear?: () => void;
}

const FilterPill = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (checked: boolean) => void }) => (
  <label className={`flex items-center gap-2 cursor-pointer select-none rounded-full border px-3 py-1.5 text-sm transition-all ${
    checked ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white border-gray-300 text-gray-700'
  }`}>
    <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="hidden" />
    {checked && (
      <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )}
    {!checked && <div className="w-4 h-4 border border-gray-400 rounded-sm" />}
    {label}
  </label>
);


export default function FilterDropdown({ filters, onFilterChange, onApply, onClear }: FilterDropdownProps) {
  const {
    data: softwareResultRaw = [] as any,
      isLoading: isSoftwareLoading = true,
      isError: isSoftwareError = true,
  } = useSoftwareCategories(1, 100);
  const { options: industryOptions } = useIndustryOptions();
  const { options: marketSegmentOptions } = useMarketSegmentOptions();
  const softwareResult = softwareResultRaw as { data: string[]; pagination: any } | undefined 
  const allCategories = (softwareResult?.data || [])
    .map((item: any) => ({ name: item.name, slug: item.slug ,id: item._id }))
    .filter((item: any) => item.name && item.slug);


  const handleSegmentChange = (id: string) => onFilterChange({ ...filters, segment: id });
  const handleCategoryChange = (cat: string) => {
    const newCats = filters.categories.includes(cat)
      ? filters.categories.filter((c: string) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: newCats });
  };
    const handleIndustryChange = (ind: string) => {
      console.log(ind,"ind");
    const newInds = filters.industries.includes(ind)
      ? filters.industries.filter((c: string) => c !== ind)
      : [...filters.industries, ind];
    onFilterChange({ ...filters, industries: newInds });
  };
  const handlePriceChange = (value: number[]) => onFilterChange({ ...filters, price: value });
  const clearFilters = () => {
    const resetFilters = {
      segment: "all",
      categories: [],
      industries: [],
      price: [10, 250],
    };
    onFilterChange(resetFilters);
    if (onClear) {
      onClear();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PillButton icon={<SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />} className="text-xs ">
          Filters
        </PillButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-screen md:w-[560px] p-5 rounded-xl bg-white border shadow-lg"
        align="end"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Segments */}
        <div className="mb-4">
          <h4 className="font-bold text-base sm:text-lg mb-2">Segments</h4>
          <div className="grid grid-cols-2 gap-2">
            {marketSegmentOptions.map(({ value, label }: any) => (
              <label key={value} className="flex items-center gap-2 cursor-pointer">
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${filters.segment === value ? 'border-red-500' : 'border-gray-300'}`}>
                  {filters.segment === value && <span className="w-2.5 h-2.5 rounded-full bg-red-500" />}
                </span>
                <span className="text-gray-800">{label}</span>
                <input type="radio" name="segment" checked={filters.segment === value} onChange={() => handleSegmentChange(value)} className="hidden" />
              </label>
            ))}
          </div>
        </div>
        {/* Categories */}
        <div className="mb-4">
          <h4 className="font-bold text-base sm:text-lg mb-2">Categories</h4>
          <div className="flex flex-wrap gap-2">
            {allCategories?.map((cat: any) => (
              <FilterPill key={cat.id} label={cat.name} checked={filters.categories.includes(cat.id)} onChange={() => handleCategoryChange(cat.id)} />
            ))}
          </div>
        </div>
        {/* Industries */}
        <div className="mb-4">
          <h4 className="font-bold text-base sm:text-lg mb-2">Industries</h4>
          <div className="flex flex-wrap gap-2">
            {industryOptions.map(({label,value}: any) => (
              <FilterPill key={value} label={label} checked={filters.industries.includes(value)} onChange={() => handleIndustryChange(value)} />
            ))}
          </div>
        </div>
        {/* Pricing */}
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-base sm:text-lg">Pricing</h4>
                <span className="text-gray-600 font-medium">${filters.price[0]} - ${filters.price[1]}</span>
            </div>
            <Slider
                min={0}
                max={500}
                step={10}
                value={filters.price}
                onValueChange={handlePriceChange}
                className="w-full"
            />
        </div>
        {/* Buttons */}
        <div className="flex items-center gap-2 mt-6 border-t pt-4">
          <Button variant="outline" className="flex-1 rounded-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={clearFilters}>
            Clear All Filters
          </Button>
          <Button className="flex-1 rounded-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onApply && onApply()}>
            Apply Filter
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 