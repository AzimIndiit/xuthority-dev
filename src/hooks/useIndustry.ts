import { useQuery } from '@tanstack/react-query';
import { IndustryService, IndustryQueryParams, Industry } from '@/services/industry';
import { useMemo, useState, useEffect } from 'react';

// Query keys for React Query
export const industryQueryKeys = {
  all: ['industries'] as const,
  active: () => [...industryQueryKeys.all, 'active'] as const,
  activeWithParams: (params: IndustryQueryParams) => [...industryQueryKeys.active(), params] as const,
  byId: (id: string) => [...industryQueryKeys.all, 'byId', id] as const,
  bySlug: (slug: string) => [...industryQueryKeys.all, 'bySlug', slug] as const,
};

// Hook to fetch active industries
export const useActiveIndustries = (params: IndustryQueryParams = {}) => {
  return useQuery({
    queryKey: industryQueryKeys.activeWithParams(params),
    queryFn: () => IndustryService.getActiveIndustries(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to get industries formatted for select options
export const useIndustryOptions = (searchTerm?: string) => {
  const { data, isLoading, error } = useActiveIndustries({
    search: searchTerm,
    limit: 100, // Get a large number of industries
  });

  const options = useMemo(() => {
    if (!data?.data) return [];
    
    return data.data.map(industry => ({
      value: industry._id,
      label: industry.name,
      slug: industry.slug,
      description: industry.description,
    }));
  }, [data]);

  return {
    options,
    isLoading,
    error,
    totalCount: data?.pagination?.total || 0,
  };
};

// Hook to fetch all industries (including inactive)
export const useAllIndustries = (params: IndustryQueryParams = {}) => {
  return useQuery({
    queryKey: [...industryQueryKeys.all, params],
    queryFn: () => IndustryService.getAllIndustries(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Hook to fetch industry by ID
export const useIndustryById = (industryId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: industryQueryKeys.byId(industryId),
    queryFn: () => IndustryService.getIndustryById(industryId),
    enabled: enabled && !!industryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook to fetch industry by slug
export const useIndustryBySlug = (slug: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: industryQueryKeys.bySlug(slug),
    queryFn: () => IndustryService.getIndustryBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for search functionality with debouncing
export const useIndustrySearch = (searchTerm: string, debounceMs: number = 300) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceMs]);

  return useIndustryOptions(debouncedSearchTerm || undefined);
}; 