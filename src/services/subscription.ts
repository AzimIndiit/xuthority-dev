import { api } from './api';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  stripePriceId?: string;
  features: string[];
  isPopular?: boolean;
  trialDays?: number;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCheckoutSessionRequest {
  planId: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface BillingPortalSessionResponse {
  url: string;
}

export interface UpdateSubscriptionRequest {
  newPlanId: string;
}

export interface SubscriptionWebhookData {
  type: string;
  data: {
    object: any;
  };
}

class SubscriptionService {
  // Get all available subscription plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await api.get('/subscription/plans');
    return response.data;
  }

  // Get current user's subscription
  async getCurrentSubscription(): Promise<UserSubscription | null> {
    const response = await api.get('/subscription/current');
    return response.data;
  }

  // Create Stripe checkout session
  async createCheckoutSession(data: CreateCheckoutSessionRequest): Promise<CreateCheckoutSessionResponse> {
    const response = await api.post('/subscription/checkout', data);
    return response.data;
  }

  // Create billing portal session
  async createBillingPortalSession(): Promise<BillingPortalSessionResponse> {
    const response = await api.post('/subscription/billing-portal');
    return response.data;
  }

  // Update subscription plan
  async updateSubscription(data: UpdateSubscriptionRequest): Promise<UserSubscription> {
    const response = await api.put('/subscription/update', data);
    return response.data;
  }

  // Cancel subscription
  async cancelSubscription(): Promise<void> {
    await api.delete('/subscription/cancel');
  }

  // Resume subscription (if canceled but not yet expired)
  async resumeSubscription(): Promise<UserSubscription> {
    const response = await api.post('/subscription/resume');
    return response.data;
  }

  // Get subscription history
  async getSubscriptionHistory(): Promise<UserSubscription[]> {
    const response = await api.get('/subscription/history');
    return response.data;
  }

  // Get upcoming invoice
  async getUpcomingInvoice(): Promise<any> {
    const response = await api.get('/subscription/upcoming-invoice');
    return response.data;
  }

  // Get payment methods
  async getPaymentMethods(): Promise<any[]> {
    const response = await api.get('/subscription/payment-methods');
    return response.data;
  }

  // Add payment method
  async addPaymentMethod(paymentMethodId: string): Promise<any> {
    const response = await api.post('/subscription/payment-methods', {
      paymentMethodId,
    });
    return response.data;
  }

  // Remove payment method
  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    await api.delete(`/subscription/payment-methods/${paymentMethodId}`);
  }

  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    await api.put('/subscription/payment-methods/default', {
      paymentMethodId,
    });
  }

  // Handle webhook events (for internal use)
  async handleWebhook(data: SubscriptionWebhookData): Promise<void> {
    await api.post('/subscription/webhook', data);
  }

  // Get subscription analytics (for vendors)
  async getSubscriptionAnalytics(): Promise<any> {
    const response = await api.get('/subscription/analytics');
    return response.data;
  }
}

export const subscriptionService = new SubscriptionService();
export default subscriptionService; 