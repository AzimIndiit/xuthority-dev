import { api } from './api';

export interface UserRole {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

export interface UserRoleResponse {
  success: boolean;
  data: UserRole[];
  pagination?: { page: number; limit: number; total: number; pages: number };
}

export const UserRoleService = {
  getActiveUserRoles: async (params: { search?: string; page?: number; limit?: number } = {}) => {
    const query = new URLSearchParams();
    query.append('page', (params.page || 1).toString());
    query.append('limit', (params.limit || 100).toString());
    if (params.search) query.append('search', params.search);
    const response = await api.get(`/user-roles/active?${query.toString()}`);
    return response.data;
  },
}; 