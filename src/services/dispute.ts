import api from './api';

// Types
export interface DisputeReason {
  value: 'false-or-misleading-information' | 'spam-or-fake-review' | 'inappropriate-content' | 'conflict-of-interest' | 'other';
  label: string;
}

export interface CreateDisputeData {
  reviewId: string;
  reason: DisputeReason['value'];
  description: string;
}

export interface UpdateDisputeData {
  reason?: DisputeReason['value'];
  description?: string;
  status?: 'active' | 'resolved';
}

export interface GetDisputesParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'resolved';
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface DisputeReview {
  _id: string;
  title: string;
  content: string;
  overallRating: number;
  reviewer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export interface DisputeProduct {
  _id: string;
  name: string;
  slug: string;
}

export interface DisputeVendor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Dispute {
  _id: string;
  id: string;
  review: DisputeReview;
  vendor: DisputeVendor;
  product: DisputeProduct;
  reason: DisputeReason['value'];
  description: string;
  status: 'active' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

// API calls
export const createDispute = (data: CreateDisputeData) => {
  return api.post('/disputes', data);
};

export const getVendorDisputes = (params?: GetDisputesParams) => {
  return api.get('/disputes', { params });
};

export const getAllDisputes = (params?: GetDisputesParams) => {
  return api.get('/disputes/all', { params });
};

export const getDisputeById = (id: string) => {
  return api.get(`/disputes/${id}`);
};

export const updateDispute = (id: string, data: UpdateDisputeData) => {
  return api.put(`/disputes/${id}`, data);
};

export const deleteDispute = (id: string) => {
  return api.delete(`/disputes/${id}`);
};

export interface AddExplanationData {
  explanation: string;
}

export interface UpdateExplanationData {
  explanation: string;
}

export const addExplanation = (disputeId: string, data: AddExplanationData) => {
  return api.post(`/disputes/${disputeId}/explanation`, data);
};

export const updateExplanation = (disputeId: string, explanationId: string, data: UpdateExplanationData) => {
  return api.put(`/disputes/${disputeId}/explanation/${explanationId}`, data);
};

// Dispute reason options
export const DISPUTE_REASONS: DisputeReason[] = [
  { value: 'false-or-misleading-information', label: 'False or Misleading Information' },
  { value: 'spam-or-fake-review', label: 'Spam or Fake Review' },
  { value: 'inappropriate-content', label: 'Inappropriate Content' },
  { value: 'conflict-of-interest', label: 'Conflict of Interest' },
  { value: 'other', label: 'Other' }
]; 