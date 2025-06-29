import { api } from './api';

export interface FollowUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  createdAt: string;
}

export interface FollowListResponse {
  data: FollowUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface FollowStatsResponse {
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isFollowedBy?: boolean;
}

export interface ToggleFollowResponse {
  action: 'followed' | 'unfollowed';
  isFollowing: boolean;
  targetUser: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
  };
}

export class FollowService {
  // Get user's followers
  static async getFollowers(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await api.get(`/follow/${userId}/followers?${params}`);
    return response.data;
  }

  // Get user's following
  static async getFollowing(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search: string = ''
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await api.get(`/follow/${userId}/following?${params}`);
    return response.data;
  }

  // Toggle follow/unfollow
  static async toggleFollow(userId: string) {
    const response = await api.post(`/follow/toggle/${userId}`);
    return response.data;
  }

  // Remove follower
  static async removeFollower(userId: string) {
    const response = await api.delete(`/follow/followers/${userId}/remove`);
    return response.data;
  }

  // Get follow statistics
  static async getFollowStats(userId: string) {
    const response = await api.get(`/follow/${userId}/stats`);
    return response.data;
  }

  // Get follow status
  static async getFollowStatus(userId: string) {
    const response = await api.get(`/follow/status/${userId}`);
    return response.data;
  }

  // Format user display name
  static formatUserName(user: FollowUser): string {
    return `${user.firstName} ${user.lastName}`.trim();
  }

  // Format follower count
  static formatFollowerCount(count: number): string {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  }

  // Get user initials for avatar fallback
  static getUserInitials(user: FollowUser): string {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }
}

export default FollowService; 