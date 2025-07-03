import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/useToast';
import * as communityService from '@/services/community';
import { CommunityQuestion, CommunityAnswer } from '@/services/community';

// Query keys
const QUERY_KEYS = {
  questions: 'community-questions',
  question: 'community-question',
  answers: 'community-answers',
  answer: 'community-answer',
  userQuestions: 'user-questions',
  userAnswers: 'user-answers',
  search: 'community-search'
};

// Questions hooks
export const useQuestions = (params?: communityService.GetQuestionsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.questions, params],
    queryFn: () => communityService.getQuestions(params),
    select: (response) => response.data.data,
  });
};

export const useQuestion = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.question, id],
    queryFn: () => communityService.getQuestion(id),
    select: (response) => response.data,
    enabled: !!id
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  const { success, error   } = useToast();

  return useMutation({
    mutationFn: communityService.createQuestion,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.questions] });
      success('Question posted successfully');
      return response.data;
    },
    onError: (err: any) => {
        error(err.response?.data?.error?.message || 'Failed to post question');
    }
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: communityService.UpdateQuestionData }) => 
      communityService.updateQuestion(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.questions] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.question, id] });
      success('Question updated successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to update question');
    }
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: communityService.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.questions] });
      success('Question deleted successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to delete question');
    }
  });
};

// Answers hooks
export const useAnswers = (questionId: string, params?: communityService.GetAnswersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.answers, questionId, params],
    queryFn: () => communityService.getAnswers(questionId, params),
    select: (response) => response.data.data || [],
    enabled: !!questionId
  });
};

export const useAnswer = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.answer, id],
    queryFn: () => communityService.getAnswer(id),
    select: (response) => response.data,
    enabled: !!id
  });
};

export const useCreateAnswer = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ questionId, data }: { questionId: string; data: communityService.CreateAnswerData }) => 
      communityService.createAnswer(questionId, data),
    onSuccess: (response, { questionId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.answers, questionId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.questions] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.question, questionId] });
      success('Answer posted successfully');
      return response.data;
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to post answer');
    }
  });
};

export const useUpdateAnswer = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: communityService.UpdateAnswerData }) => 
      communityService.updateAnswer(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate all answer-related queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.answers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.answer, id] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.questions] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userAnswers] });
      success('Answer updated successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to update answer');
    }
  });
};

export const useDeleteAnswer = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: communityService.deleteAnswer,
    onSuccess: () => {
      // Invalidate all answer-related queries to refresh the UI
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.answers] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.questions] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userAnswers] });
      success('Answer deleted successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to delete answer'); 
    }
  });
};

// Search hook
export const useCommunitySearch = (query: string, type?: 'questions' | 'answers' | 'both', page?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.search, query, type, page],
    queryFn: () => communityService.searchCommunity({ q: query, type, page, limit: 10 }),
    select: (response) => response.data,
    enabled: !!query && query.length > 0
  });
};

// User specific hooks
export const useUserQuestions = (userId: string, params?: communityService.GetQuestionsParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.userQuestions, userId, params],
    queryFn: () => communityService.getUserQuestions(userId, params),
    select: (response) => response.data,
    enabled: !!userId
  });
};

// Custom hook to get user's answers by fetching questions and filtering answers
export const useUserAnswers = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.userAnswers, userId],
    queryFn: async () => {
      if (!userId) return [];

      try {
        // First get all questions
        const questionsResponse = await communityService.getAllAnswersWithQuestions({ limit: 50 });
        const questions = questionsResponse.data.data.questions || [];
        
        const allUserAnswers: any[] = [];
        
        // For each question, fetch its answers
        for (const question of questions) {
          try {
            const answersResponse = await communityService.getAnswers(question._id, { limit: 50 });
            const answers = answersResponse.data.data.answers || [];
            
            // Filter answers by userId
            const userAnswersForQuestion = answers.filter(
              (answer: any) => answer.author._id === userId
            );
            
            // Add question info to each answer
            userAnswersForQuestion.forEach((answer: any) => {
              allUserAnswers.push({
                id: answer._id,
                question: question.title,
                questionDate: question.createdAt,
                answerContent: answer.content,
                answerId: answer._id,
                questionId: question._id
              });
            });
          } catch (error) {
            console.error('Error fetching answers for question:', question._id, error);
          }
        }
        
        return allUserAnswers;
      } catch (error) {
        console.error('Error fetching user answers:', error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 0, // Always refetch when query is re-enabled
  });
}; 