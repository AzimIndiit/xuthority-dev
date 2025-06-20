import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function SearchSection() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[90dvh] w-full bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200 overflow-hidden px-4 sm:px-6 lg:px-8 py-12">
      {/* Decorative SVG or background can go here */}
      <div className="w-full lg:max-w-screen-xl mx-auto">
        <h1 className="text-4xl lg:text-6xl font-bold text-center mb-3 sm:mb-4 mt-8 md:mt-0 px-4 leading-[1.2]">
          Find the right software with Us!
        </h1>
        <p className="text-gray-700 text-center  mx-auto mb-6 sm:mb-8 text-base md:text-2xl px-4">
          We helps you discover the ideal solutions for your business. Compare options by price, features, business size, industry, and reviews from verified users.
        </p>
        <form className="flex w-full max-w-xl mx-auto px-2 mt-8">
          <div className="flex w-full rounded-full border border-red-400 bg-white overflow-hidden shadow-sm">
            <Input
              type="text"
              placeholder="Search here..."
              className="flex-1 px-5 py-3 text-base bg-transparent border-none focus:ring-0 placeholder-gray-400 outline-none shadow-none rounded-none h-14 "
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 sm:px-8 py-3 text-base rounded-full transition-all flex items-center justify-center"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              {/* Search icon for mobile */}
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
              {/* "Search" text for desktop */}
              <span className="hidden sm:inline">Search</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
} 