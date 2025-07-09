import { useState, useRef } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import useDebounce from "@/hooks/useDebounce";
import LottieLoader from "@/components/LottieLoader";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import { useNavigate } from "react-router-dom";

const icons = {
  software: (
    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
  ),
  solution: (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
  ),
  product: (
    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
  ),
};

// Skeleton component for search result items
const SearchResultItemSkeleton = () => (
  <div className="flex items-center gap-2 px-2 py-1 rounded animate-pulse">
    <div className="w-4 h-4 bg-gray-200 rounded" />
    <div className="h-3 bg-gray-200 rounded w-24" />
  </div>
);

// Skeleton component for search result sections
const SearchResultSectionSkeleton = ({ title, itemCount = 3 }: { title: string; itemCount?: number }) => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-16 mb-1 mt-3 first:mt-0" />
    <div className="space-y-1">
      {[...Array(itemCount)].map((_, index) => (
        <SearchResultItemSkeleton key={index} />
      ))}
    </div>
  </div>
);

// Complete skeleton for search dropdown
const SearchDropdownSkeleton = () => (
  <div className="space-y-1">
    <SearchResultSectionSkeleton title="Software" itemCount={3} />
    <SearchResultSectionSkeleton title="Solutions" itemCount={2} />
    <SearchResultSectionSkeleton title="Products" itemCount={4} />
  </div>
);

export default function SearchSection() {
  const navigate=useNavigate()
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const debounced = useDebounce(input, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data, isLoading ,isFetching} = useGlobalSearch(debounced);
  const results = data as { softwares?: any[]; solutions?: any[]; products?: any[] } | undefined;

  // Show/hide dropdown based on debounced input
  // (optional: you can also close on blur/click outside)
  // This effect ensures dropdown is shown only when there is a query
  // and closes when input is cleared
  // You can further enhance with click outside logic if needed
  if (debounced && !showDropdown) setShowDropdown(true);
  if (!debounced && showDropdown) setShowDropdown(false);
  function renderSection(title: string, items: any[] | undefined, type: string) {
    if (!items?.length) return null;
    return (
      <div>
        <div className="font-bold text-sm mb-1 mt-3 first:mt-0">{title}</div>
        {items.map((item: any, idx: number) => (
          <div key={item._id || idx} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer" onClick={() => {
            if(type === 'product'){
              navigate(`/product-detail/${item.slug}`)
            }else if(type === 'software'){
              navigate(`/software/${item.slug}`)
            }else if(type === 'solution'){
              navigate(`/solution/${item.slug}`)
            }
          }}>
            {type === 'software' && <span className="text-green-500">🧩</span>}
            {type === 'solution' && <span className="text-gray-500">🛠️</span>}
            {type === 'product' && <span className="text-blue-500">{idx === 0 ? '📦' : '📦'}</span>}
            <span className={type === 'software' && item.name === 'sales tools' ? 'text-red-500 text-xs' : 'text-xs'}>{item.name}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className=" flex flex-col items-center justify-center min-h-[90dvh] w-full bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200  px-4 sm:px-6 lg:px-8 py-12" style={{backgroundImage: 'url(/svg/home_bg.svg)',backgroundSize: 'cover',backgroundPosition: 'center' ,backgroundRepeat: 'no-repeat'}}>
      <div className="w-full lg:max-w-screen-xl mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 mt-8 md:mt-0 px-4 leading-[1.2]">
          Find the right software with Us!
        </h1>
        <p className="text-gray-700 text-center  mx-auto mb-6 sm:mb-8 text-base md:text-2xl px-4">
          We helps you discover the ideal solutions for your business. Compare options by price, features, business size, industry, and reviews from verified users.
        </p>
        <form className="flex w-full max-w-xl mx-auto px-2 mt-8 relative" onSubmit={e => e.preventDefault()}>
          <div className="flex w-full rounded-full border border-red-400 bg-white overflow-hidden shadow-sm ">
            <Input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search here..."
              className="flex-1 px-5 py-3 text-base bg-transparent border-none focus:ring-0 placeholder-gray-400 outline-none shadow-none rounded-none h-14 "
              onFocus={() => input && setShowDropdown(true)}
              autoComplete="off"
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 sm:px-8 py-3 text-base rounded-full transition-all flex items-center justify-center"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <svg
                className="w-5 h-5 ml-[-10px] sm:hidden"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" stroke="currentColor" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeLinecap="round" />
              </svg>
              <span className="hidden sm:inline">Search</span>
            </button>
            {/* Dropdown */}
         
          </div>
          {showDropdown && (
              <div ref={dropdownRef} className="absolute left-0 top-14 mt-2 w-full bg-white rounded-2xl shadow-xl border z-30 p-2 sm:p-4 min-w-[320px] max-h-[70vh] min-h-[30px] sm:min-h-[50px]  overflow-y-auto">
                {isLoading || isFetching ? (
                  <SearchDropdownSkeleton />
                ) : results && (results.softwares?.length > 0 || results.solutions?.length > 0 || results.products?.length > 0) ? (
                  <>
                    {renderSection('Software', results.softwares, 'software')}
                    {renderSection('Solutions', results.solutions, 'solution')}
                    {renderSection('Products', results.products, 'product')}
                  </>
                ) : (
                  <div className="text-gray-400 text-left ">No results</div>
                )}
              </div>
            )}
        </form>
   
      </div>
    </section>
  );
} 