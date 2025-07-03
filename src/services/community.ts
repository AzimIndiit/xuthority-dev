import api from './api';

// Types
export interface CommunityQuestion {
  _id: string;
  title: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  };
  product?: {
    _id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'closed';
  totalAnswers: number;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityAnswer {
  _id: string;
  content: string;
  question: string | CommunityQuestion;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  createdAt: string;
  updatedAt: string;
}

export interface GetQuestionsParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'totalAnswers';
  sortOrder?: 'asc' | 'desc';
  status?: string;
  product?: string;
  author?: string;
  search?: string;
}

export interface GetAnswersParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt';
  sortOrder?: 'asc' | 'desc';
  status?: string;
}

export interface CreateQuestionData {
  title: string;
  product?: string;
}

export interface CreateAnswerData {
  content: string;
}

export interface UpdateQuestionData {
  title: string;
}

export interface UpdateAnswerData {
  content: string;
}

// Question APIs
export const getQuestions = (params?: GetQuestionsParams) => {
  return api.get('/community/questions', { params });
};

export const getQuestion = (id: string) => {
  return api.get(`/community/questions/${id}`);
};

export const createQuestion = (data: CreateQuestionData) => {
  return api.post('/community/questions', data);
};

export const updateQuestion = (id: string, data: UpdateQuestionData) => {
  return api.put(`/community/questions/${id}`, data);
};

export const deleteQuestion = (id: string) => {
  return api.delete(`/community/questions/${id}`);
};

// Answer APIs
export const getAnswers = (questionId: string, params?: GetAnswersParams) => {
  return api.get(`/community/questions/${questionId}/answers`, { params });
};

export const getAnswer = (id: string) => {
  return api.get(`/community/answers/${id}`);
};

export const createAnswer = (questionId: string, data: CreateAnswerData) => {
  return api.post(`/community/questions/${questionId}/answers`, data);
};

export const updateAnswer = (id: string, data: UpdateAnswerData) => {
  return api.put(`/community/answers/${id}`, data);
};

export const deleteAnswer = (id: string) => {
  return api.delete(`/community/answers/${id}`);
};

// Search API
export const searchCommunity = (params: { q: string; type?: 'questions' | 'answers' | 'both'; page?: number; limit?: number }) => {
  return api.get('/community/search', { params });
};

// Get user's questions
export const getUserQuestions = (userId: string, params?: GetQuestionsParams) => {
  return api.get('/community/questions', { 
    params: { 
      ...params, 
      author: userId 
    } 
  });
};

// Get all answers with populated questions for My Answers tab
export const getAllAnswersWithQuestions = (params?: { page?: number; limit?: number }) => {
  // Fetch all questions with their answers populated
  return api.get('/community/questions', { 
    params: { 
      ...params,
      status: 'approved',
      limit: params?.limit || 50
    } 
  });
}; 