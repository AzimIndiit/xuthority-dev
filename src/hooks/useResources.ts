import { useQuery, useMutation, useQueryClient, keepPreviousData   } from '@tanstack/react-query';
import { resourceService } from '@/services/resource';
import { ResourcesResponse, Webinar, ResourceFilters, ResourceCategory, Blog } from '@/types/resource';
import { useToast } from './useToast';
import React from 'react';

// Query Keys
export const resourceQueryKeys = {
  all: ['resources'] as const,
  lists: () => [...resourceQueryKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...resourceQueryKeys.lists(), filters] as const,
  webinars: () => [...resourceQueryKeys.all, 'webinars'] as const,
  webinar: (slug: string) => [...resourceQueryKeys.all, 'webinar', slug] as const,
  categories: () => [...resourceQueryKeys.all, 'categories'] as const,
  featured: (type?: string) => [...resourceQueryKeys.all, 'featured', type] as const,
  search: (query: string, filters?: ResourceFilters) => 
    [...resourceQueryKeys.all, 'search', query, filters] as const,
  related: (resourceId: string) => [...resourceQueryKeys.all, 'related', resourceId] as const,
};

// Get all resources with filtering
export const useResources = (params?: {
  type?: string;
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}) => {
  const { enabled = true, ...queryParams } = params || {};
  
  return useQuery({
    queryKey: resourceQueryKeys.list(queryParams),
    queryFn: () => resourceService.getResources(queryParams),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get webinars specifically
export const useWebinars = (params?: {
  status?: 'live' | 'on-demand' | 'upcoming';
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}) => {
  const { enabled = true, ...queryParams } = params || {};
  
  return useQuery({
    queryKey: [...resourceQueryKeys.webinars(), queryParams],
    queryFn: () => resourceService.getWebinars(queryParams),
    enabled,
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Get single webinar by slug
export const useWebinar = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: resourceQueryKeys.webinar(slug),
    queryFn: () => resourceService.getWebinarBySlug(slug),
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Get resource categories
export const useResourceCategories = () => {
  return useQuery({
    queryKey: ['resourceCategories'],
    queryFn: resourceService.getResourceCategories,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    placeholderData: keepPreviousData,
  });
};

// Get resources by category
export const useResourcesByCategory = (
  category: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    enabled?: boolean;
  }
) => {
  const { enabled = true, ...queryParams } = params || {};
  
  return useQuery({
    queryKey: [...resourceQueryKeys.list({ category }), queryParams],
    queryFn: () => resourceService.getResourcesByCategory(category, queryParams),
    enabled: enabled && !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Search resources
export const useSearchResources = (
  query: string,
  filters?: ResourceFilters,
  enabled = true
) => {
  return useQuery({
    queryKey: resourceQueryKeys.search(query, filters),
    queryFn: () => resourceService.searchResources(query, filters),
    enabled: enabled && !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get featured resources
export const useFeaturedResources = (type?: string, enabled = true) => {
  return useQuery({
    queryKey: resourceQueryKeys.featured(type),
    queryFn: () => resourceService.getFeaturedResources(type),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
};

// Get related resources
export const useRelatedResources = (
  resourceId: string,
  limit = 6,
  enabled = true
) => {
  return useQuery({
    queryKey: resourceQueryKeys.related(resourceId),
    queryFn: () => resourceService.getRelatedResources(resourceId, limit),
    enabled: enabled && !!resourceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Track resource view mutation
export const useTrackResourceView = () => {
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationFn: (resourceId: string) => resourceService.trackResourceView(resourceId),
    onSuccess: () => {
      // Invalidate and refetch resource queries to update view counts
      queryClient.invalidateQueries({
        queryKey: resourceQueryKeys.all,
      });
    },
    onError: (error) => {
      console.error('Failed to track resource view:', error);
      // Don't show toast for tracking errors as it's not critical
    },
  });
};

// Prefetch webinar
export const usePrefetchWebinar = () => {
  const queryClient = useQueryClient();

  return (slug: string) => {
    queryClient.prefetchQuery({
      queryKey: resourceQueryKeys.webinar(slug),
      queryFn: () => resourceService.getWebinarBySlug(slug),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

// Invalidate all resource queries
export const useInvalidateResources = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: resourceQueryKeys.all,
    });
  };
};

// Hook for fetching blogs by category
export const useBlogsByCategory = (categoryId: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['blogs', 'category', categoryId],
    queryFn: () => categoryId ? resourceService.getBlogsByCategory(categoryId) : Promise.resolve({ success: true, data: [] }),
    select: (data) => data.data,
    enabled: enabled && !!categoryId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
  });
};

// Hook for fetching all active blogs
export const useActiveBlogs = () => {
  return useQuery({
    queryKey: ['blogs', 'active'],
    queryFn: resourceService.getActiveBlogs,
    select: (data) => data.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
  });
};

// Hook for fetching a specific blog by slug
export const useBlogBySlug = (slug: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['blog', 'slug', slug],
    queryFn: () => slug ? resourceService.getBlogBySlug(slug) : Promise.resolve({ success: false, data: null }),
    select: (data) => data.data,
    enabled: enabled && !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData,
  });
};

// Hook for fetching blogs by tag
export const useBlogsByTag = (tag: string | null, enabled = true) => {
  return useQuery({
    queryKey: ['blogs', 'tag', tag],
    queryFn: () => tag ? resourceService.getBlogsByTag(tag) : Promise.resolve({ success: true, data: [] }),
    select: (data) => data.data,
    enabled: enabled && !!tag,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
  });
};

// Hook for fetching all blogs grouped by categories using single API call
export const useBlogsGroupedByCategory = (limit: number = 6) => {
  return useQuery({
    queryKey: ['blogs', 'grouped-by-categories', limit],
    queryFn: () => resourceService.getBlogsGroupedByCategories(limit),
    select: (data) => data.data,
    staleTime: 2 * 60 * 1000, // 2 minutes
    placeholderData: keepPreviousData,
  });
}; 