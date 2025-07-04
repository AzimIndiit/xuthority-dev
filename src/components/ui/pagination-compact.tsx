import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationCompactProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

const PaginationCompact: React.FC<PaginationCompactProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const page = parseInt(e.currentTarget.value);
      if (page >= 1 && page <= totalPages) {
        onPageChange(page);
      }
    }
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

  return (
    <div className={cn('flex flex-col sm:flex-row items-center justify-between gap-3', className)}>
      {/* Info section */}
      {totalItems && itemsPerPage && (
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          {startItem}-{endItem} of {totalItems}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex items-center space-x-2 order-1 sm:order-2">
        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          )}
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page input */}
        <div className="flex items-center space-x-1 text-sm">
          <span className="text-gray-700">Page</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={handlePageInput}
            onKeyPress={handleKeyPress}
            className="w-12 h-8 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <span className="text-gray-700">of {totalPages}</span>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md transition-colors',
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          )}
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PaginationCompact; 