import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/useToast';
import * as disputeService from '@/services/dispute';
import { queryClient } from '@/lib/queryClient';

// Query keys
const QUERY_KEYS = {
  disputes: 'disputes',
  dispute: 'dispute',
  allDisputes: 'all-disputes'
};

// Dispute hooks
export const useVendorDisputes = (params?: disputeService.GetDisputesParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.disputes, params],
    queryFn: () => disputeService.getVendorDisputes(params),
    select: (response) => {
      // The backend returns { success, data: { disputes, pagination }, message }
      return response.data.data || response.data;
    },
  });
};

export const useAllDisputes = (params?: disputeService.GetDisputesParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.allDisputes, params],
    queryFn: () => disputeService.getAllDisputes(params),
    select: (response) => response.data.data,
  });
};

export const useDispute = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.dispute, id],
    queryFn: () => disputeService.getDisputeById(id),
    select: (response) => response.data.data,
    enabled: !!id
  });
};

export const useCreateDispute = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: disputeService.createDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allDisputes] });
      success('Dispute created successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to create dispute');
    }
  });
};

export const useUpdateDispute = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: disputeService.UpdateDisputeData }) => 
      disputeService.updateDispute(id, data),
    onSuccess: (response, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allDisputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dispute, id] });
      success('Dispute updated successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to update dispute');
    }
  });
};

export const useDeleteDispute = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: disputeService.deleteDispute,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allDisputes] });
      success('Dispute deleted successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to delete dispute');
    }
  });
};

export const useAddExplanation = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ disputeId, data }: { disputeId: string; data: disputeService.AddExplanationData }) => 
      disputeService.addExplanation(disputeId, data),
    onSuccess: (response, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allDisputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dispute, disputeId] });
      success('Explanation added successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to add explanation');
    }
  });
};

export const useUpdateExplanation = () => {
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ disputeId, explanationId, data }: { 
      disputeId: string; 
      explanationId: string; 
      data: disputeService.UpdateExplanationData 
    }) => 
      disputeService.updateExplanation(disputeId, explanationId, data),
    onSuccess: (response, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.allDisputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dispute, disputeId] });
      success('Explanation updated successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to update explanation');
    }
  });
}; 