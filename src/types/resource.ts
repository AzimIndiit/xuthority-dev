export interface Webinar {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status: 'live' | 'on-demand' | 'upcoming';
  speaker: {
    name: string;
    title: string;
    company?: string;
    companyLogo?: string;
  };
  duration?: number; // in minutes
  viewCount?: number;
  tags?: string[];
  publishedAt: string;
  slug: string;
}

// Blog interface to match backend Blog model
export interface Blog {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  authorName: string;
  designation?: string;
  mediaUrl?: string;
  thumbnailUrl?:string;
  watchUrl?: string;
  tag: string;
  status: 'active' | 'inactive';
  resourceCategoryId: {
    _id: string;
    name: string;
    slug: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'webinar' | 'guide' | 'edge-content' | 'success-story';
  category: string;
  imageUrl?: string;
  downloadUrl?: string;
  viewUrl?: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt: string;
  author?: {
    name: string;
    title: string;
    avatar?: string;
  };
  tags?: string[];
  slug: string;
}

// ResourceCategory interface to match backend model
export interface ResourceCategory {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Update ResourceTab to be dynamic based on resource categories
export type ResourceTab = string;

export interface ResourceFilters {
  category?: string;
  type?: string;
  status?: string;
  search?: string;
  tags?: string[];
}

export interface ResourcesResponse {
  success: boolean;
  data: Resource[] | Webinar[];
  meta: {
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    total: number;
  };
}

// Response interfaces for API calls
export interface BlogsResponse {
  success: boolean;
  data: Blog[];
  meta?: {
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    total?: number;
  };
}

export interface ResourceCategoriesResponse {
  success: boolean;
  data: ResourceCategory[];
  meta?: {
    total?: number;
  };
} 