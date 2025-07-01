import { useQuery } from '@tanstack/react-query';
import { fetchSoftwareCategories, fetchSolutionCategories } from '@/services/category';

export const useSoftwareCategories = (page = 1, limit = 12) =>
  useQuery({
    queryKey: ['software-categories', page, limit],
    queryFn: () => fetchSoftwareCategories(page, limit),
    keepPreviousData: true,
  });

export const useSolutionCategories = (page = 1, limit = 12) =>
  useQuery({
    queryKey: ['solution-categories', page, limit],
    queryFn: () => fetchSolutionCategories(page, limit),
    keepPreviousData: true,
  }); 