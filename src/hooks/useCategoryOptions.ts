import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchSoftwareCategories, fetchSolutionCategories } from '@/services/category';

export const useSoftwareCategories = (page = 1, limit = 12) =>
  useQuery({
    queryKey: ['software-categories', page, limit],
    queryFn: () => fetchSoftwareCategories(page, limit),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    placeholderData: keepPreviousData,
  });

export const useSolutionCategories = (page = 1, limit = 12) =>
  useQuery({
    queryKey: ['solution-categories', page, limit],
    queryFn: () => fetchSolutionCategories(page, limit),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    placeholderData:  keepPreviousData,
  }); 