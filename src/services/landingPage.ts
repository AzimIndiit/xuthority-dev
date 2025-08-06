import api from './api';

export interface LandingPageData {
  _id?: string;
  pageType: 'user' | 'vendor' | 'about';
  sections: {
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SectionData {
  [key: string]: any;
}

export const LandingPageService = {
  // Get landing page by type
  getLandingPage: async (pageType: string) => {
    const response = await api.get(`/landing-pages/${pageType}`);
    return response.data;
  },

  // Get specific section
  getSection: async (pageType: string, sectionName: string) => {
    const response = await api.get(`/landing-pages/${pageType}/sections/${sectionName}`);
    return response.data;
  },

  // Get all landing pages summary
  getAllLandingPages: async () => {
    const response = await api.get('/landing-pages');
    return response.data;
  },
};