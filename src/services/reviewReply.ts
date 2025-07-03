import { ApiService, ApiResponse } from './api';

export interface ReviewReply {
  _id: string;
  review: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    avatar?: string;
  };
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  helpfulVotes: {
    count: number;
    voters: Array<{
      user: string;
      votedAt: string;
    }>;
  };
  isEdited: boolean;
  editedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewReplyFilters {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'helpfulVotes.count';
  sortOrder?: 'asc' | 'desc';
  replyType?: 'user' | 'vendor' | 'admin';
  status?: 'pending' | 'approved' | 'rejected' | 'flagged';
}

export interface CreateReplyRequest {
  content: string;
  replyType?: 'user' | 'vendor' | 'admin';
  parentReply?: string;
}

export interface UpdateReplyRequest {
  content: string;
}

export class ReviewReplyService {
  // Get all replies for a specific review
  static async getRepliesForReview(
    reviewId: string, 
    filters: ReviewReplyFilters = {}
  ): Promise<ApiResponse<ReviewReply[]>> {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.replyType) params.append('replyType', filters.replyType);
    if (filters.status) params.append('status', filters.status);
    
    return ApiService.get<ReviewReply[]>(
      `/reviews/${reviewId}/replies?${params.toString()}`
    );
  }

  // Create a new reply to a review
  static async createReply(
    reviewId: string,
    data: CreateReplyRequest
  ): Promise<ApiResponse<ReviewReply>> {
    return ApiService.post<ReviewReply>(`/reviews/${reviewId}/replies`, data);
  }

  // Get a single reply by ID
  static async getReplyById(replyId: string): Promise<ApiResponse<ReviewReply>> {
    return ApiService.get<ReviewReply>(`/replies/${replyId}`);
  }

  // Update a reply
  static async updateReply(
    replyId: string,
    data: UpdateReplyRequest
  ): Promise<ApiResponse<ReviewReply>> {
    return ApiService.put<ReviewReply>(`/replies/${replyId}`, data);
  }

  // Delete a reply
  static async deleteReply(replyId: string): Promise<ApiResponse<void>> {
    return ApiService.delete<void>(`/replies/${replyId}`);
  }

  // Vote reply as helpful
  static async voteHelpful(replyId: string): Promise<ApiResponse<ReviewReply>> {
    return ApiService.post<ReviewReply>(`/replies/${replyId}/helpful`);
  }

  // Remove helpful vote from a reply
  static async removeHelpfulVote(replyId: string): Promise<ApiResponse<ReviewReply>> {
    return ApiService.delete<ReviewReply>(`/replies/${replyId}/helpful`);
  }
} 