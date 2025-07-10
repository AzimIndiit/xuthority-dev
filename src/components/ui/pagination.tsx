import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showInfo?: boolean;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showInfo = true,
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

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than or equal to maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first 3 pages
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4', className)}>
      {/* Info section */}
      {showInfo && totalItems && itemsPerPage && (
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems}
        </div>
      )}

      {/* Pagination controls */}
      <div className="flex gap-1 items-center">
        {/* Previous button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-300"
          disabled={currentPage === 1}
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="icon"
            className={cn(
              "rounded-full border-gray-300 w-8 h-8",
              currentPage === pageNum && "bg-red-500 hover:bg-red-600 border-red-500"
            )}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}
        
        {/* Ellipsis if there are more pages */}
        {totalPages > 3 && <span className="px-2 text-gray-400">...</span>}

        {/* Next button */}
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-300"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination; 