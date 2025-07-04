import { useState, useCallback, useMemo } from 'react';

interface UsePaginationProps {
  initialPage?: number;
  initialItemsPerPage?: number;
  totalItems?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startItem: number;
  endItem: number;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  reset: () => void;
}

export const usePagination = ({
  initialPage = 1,
  initialItemsPerPage = 10,
  totalItems = 0
}: UsePaginationProps = {}): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage);
  }, [totalItems, itemsPerPage]);

  const hasNextPage = useMemo(() => {
    return currentPage < totalPages;
  }, [currentPage, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return currentPage > 1;
  }, [currentPage]);

  const startItem = useMemo(() => {
    return (currentPage - 1) * itemsPerPage + 1;
  }, [currentPage, itemsPerPage]);

  const endItem = useMemo(() => {
    return Math.min(currentPage * itemsPerPage, totalItems);
  }, [currentPage, itemsPerPage, totalItems]);

  const goToNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const goToPreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  const reset = useCallback(() => {
    setCurrentPage(initialPage);
    setItemsPerPage(initialItemsPerPage);
  }, [initialPage, initialItemsPerPage]);

  const handleSetCurrentPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  const handleSetItemsPerPage = useCallback((newItemsPerPage: number) => {
    if (newItemsPerPage > 0) {
      setItemsPerPage(newItemsPerPage);
      // Reset to first page when changing items per page
      setCurrentPage(1);
    }
  }, []);

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startItem,
    endItem,
    setCurrentPage: handleSetCurrentPage,
    setItemsPerPage: handleSetItemsPerPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    reset
  };
};

export default usePagination; 