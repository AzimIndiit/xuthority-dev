import { useQuery } from '@tanstack/react-query';
import { LandingPageService } from '@/services/landingPage';

export type PageType = 'user' | 'vendor' | 'about';
export type SectionName = string;

interface SectionData {
  [key: string]: any;
}

// Hook to fetch a specific section data
export const useLandingPageSection = (pageType: PageType, sectionName: SectionName) => {
  return useQuery({
    queryKey: ['landingPage', pageType, sectionName],
    queryFn: async () => {
      // Call the section-specific API endpoint
      const response = await LandingPageService.getSection(pageType, sectionName);
      return response.data || {};
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};