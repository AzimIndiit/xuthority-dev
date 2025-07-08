import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useToast } from './useToast';
import { queryClient } from '@/lib/queryClient';
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  period: string;
  isActive: boolean;
  isFree: boolean;
  trialDays: number;
  features: string[];
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  planType: string;
  formattedPrice: string;
  expiryDate?: string;
}

interface UserSubscription {
  id: string;
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  isActive: boolean;
  isTrialing: boolean;
  isCanceled: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEnd?: string;
  cancelAtPeriodEnd: boolean;
  daysUntilExpiry: number;
  trialDaysRemaining?: number;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

interface CreateSubscriptionRequest {
  planId: string;
  paymentMethodId?: string;
}

interface UpdateSubscriptionRequest {
  newPlanId: string;
}

// API functions - integrated with backend
const subscriptionApi = {
  // Get available subscription plans
  getPlans: async (): Promise<SubscriptionPlan[]> => {
    const response = await api.get('/subscription/plans');
    return response.data.data; // Backend returns { success: true, data: [...] }
  },

  // Get user's current subscription
  getCurrentSubscription: async (): Promise<UserSubscription | null> => {
    try {
      const response = await api.get('/subscription/current');
      return response.data.data; // Backend returns { success: true, data: {...} }
    } catch (error: any) {
      if (error.response?.status === 401) {
        // User not authenticated, return null
        return null;
      }
      throw error;
    }
  },

  // Create Stripe Checkout session
  createCheckoutSession: async (planId: string): Promise<{ url: string }> => {
    const response = await api.post('/subscription/checkout', { planId });
    return response.data.data; // Backend returns { success: true, data: { url: "..." } }
  },

  // Create billing portal session
  createBillingPortalSession: async (): Promise<{ url: string }> => {
    const response = await api.post('/subscription/billing-portal');
    return response.data.data; // Backend returns { success: true, data: { url: "..." } }
  },

  // Update existing subscription
  updateSubscription: async (data: UpdateSubscriptionRequest): Promise<UserSubscription> => {
    const response = await api.put('/subscription/update', data);
    return response.data.data; // Backend returns { success: true, data: {...} }
  },

  // Cancel subscription
  cancelSubscription: async (reason?: string): Promise<void> => {
    const config = reason ? { data: { reason } } : {};
    await api.delete('/subscription/cancel', config);
  },

  // Resume subscription
  resumeSubscription: async (): Promise<UserSubscription> => {
    const response = await api.post('/subscription/resume');
    return response.data.data; // Backend returns { success: true, data: {...} }
  },
};

// Hook to get subscription plans
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: subscriptionApi.getPlans,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get current subscription
export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: ['current-subscription'],
    queryFn: subscriptionApi.getCurrentSubscription,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Hook to create subscription (via checkout session)
export const useCreateSubscription = () => {
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: subscriptionApi.createCheckoutSession,
    onSuccess: (data) => {
      // Redirect to Stripe Checkout
      window.location.href = data.url;
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to create subscription');
    },
  });
};

// Hook to create checkout session (alias for useCreateSubscription)
export const useCreateCheckoutSession = useCreateSubscription;

// Hook to update subscription
export const useUpdateSubscription = () => {
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: subscriptionApi.updateSubscription,
    onSuccess: (data) => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      success('Subscription updated successfully');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to update subscription');
    },
  });
};

// Hook to cancel subscription
export const useCancelSubscription = () => {
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: (reason?: string) => subscriptionApi.cancelSubscription(reason),
    onSuccess: () => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      success('Subscription cancelled successfully');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to cancel subscription');
    },
  });
};

// Hook to resume subscription
export const useResumeSubscription = () => {
  const { success, error: showError } = useToast();

  return useMutation({
    mutationFn: subscriptionApi.resumeSubscription,
    onSuccess: () => {
      // Invalidate and refetch subscription data
      queryClient.invalidateQueries({ queryKey: ['current-subscription'] });
      success('Subscription reactivated successfully');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to reactivate subscription');
    },
  });
};

// Hook to create billing portal session
export const useCreateBillingPortalSession = () => {
  const { success, error: showError } = useToast();
  return useMutation({
    mutationFn: subscriptionApi.createBillingPortalSession,
    onSuccess: (data) => {
      // Redirect to Stripe Billing Portal
      window.location.href = data.url;
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to access billing portal');
    },
  });
};

// Export types for use in components
export type {
  SubscriptionPlan,
  UserSubscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
}; 