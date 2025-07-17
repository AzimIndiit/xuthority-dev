import React, { useState } from 'react';
import { ArrowLeftIcon, Check, CreditCard, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import SecondaryLoader from '@/components/ui/SecondaryLoader';
import { 
  useSubscriptionPlans, 
  useCurrentSubscription, 
  useCreateCheckoutSession, 
  useCancelSubscription,
  useResumeSubscription,
  useCreateBillingPortalSession,
  type SubscriptionPlan 
} from '@/hooks/useSubscription';
import { useNavigate } from 'react-router-dom';

// Skeleton for the page header
const HeaderSkeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-2">
      <span className="block lg:hidden">
        <div className="w-6 h-6 bg-gray-200 rounded" />
      </span>
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-80" />
      </div>
    </div>
  </div>
);

// Skeleton for individual subscription plan cards
const SubscriptionCardSkeleton = () => (
  <Card className="border border-gray-200 bg-white animate-pulse">
    <CardHeader className="pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="h-6 bg-gray-200 rounded w-24" />
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-full mt-2" />
    </CardHeader>

    <CardContent className="pt-0">
      {/* Pricing Skeleton */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <div className="h-10 bg-gray-200 rounded w-20" />
          <div className="h-6 bg-gray-200 rounded w-16" />
        </div>
      </div>

      {/* Features Skeleton */}
      <div className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-3" />
        <ul className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded-full flex-shrink-0" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button Skeleton */}
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded-full w-full" />
        <div className="text-center space-y-1">
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto" />
          <div className="h-3 bg-gray-200 rounded w-40 mx-auto" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// Skeleton for billing management actions
const BillingActionsSkeleton = () => (
  <div className="flex justify-center gap-4 animate-pulse">
    <div className="h-10 bg-gray-200 rounded-full w-32" />
    <div className="h-10 bg-gray-200 rounded-full w-40" />
  </div>
);

// Complete page skeleton
const MySubscriptionPageSkeleton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-8">
      <HeaderSkeleton />
      
      {/* Subscription Plans Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubscriptionCardSkeleton />
        <SubscriptionCardSkeleton />
      </div>
      
      {/* Billing Actions Skeleton */}
      <BillingActionsSkeleton />
    </div>
  );
};

const MySubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  
  // API hooks
  const { data: subscriptionPlans, isLoading: plansLoading ,error: plansError} = useSubscriptionPlans();
  const { data: currentSubscription, isLoading: subscriptionLoading ,error: subscriptionError} = useCurrentSubscription();
  const createCheckoutSession = useCreateCheckoutSession();
  const cancelSubscription = useCancelSubscription();
  const resumeSubscription = useResumeSubscription();
  const createBillingPortalSession = useCreateBillingPortalSession();

  // Mock data for development - remove when API is ready
  const mockPlans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Collaborate and optimize your team processes',
      price: 0,
      currency: 'USD',
      period: 'for 7 days',
      isActive: false,
      isFree: true,
      trialDays: 7,
      features: [
        'Basic Product Listing',
        'Basic Analytics',
        'Standard Branding',
        'Review Response'
      ],
      buttonText: 'Try For Free',
      buttonVariant: 'default',
      planType: 'free',
      formattedPrice: 'Free'
    },
    {
      id: 'standard',
      name: 'Standard',
      description: 'Collaborate and optimize your team processes',
      price: 12,
      currency: 'USD',
      period: 'monthly',
      isActive: true,
      isFree: false,
      trialDays: 7,
      features: [
        'Enhanced branding',
        'Advanced analytics.',
        'Review management.',
        'Dispute management.'
      ],
      buttonText: 'Renew',
      buttonVariant: 'default',
      planType: 'standard',
      formattedPrice: '$12.00',
      expiryDate: 'Jan 02, 2025'
    }
  ];

  // Use API data, fallback to mock data if loading, or empty array if still loading
  const plans = subscriptionPlans || (plansLoading ? [] : mockPlans);
  
  // Determine active plan based on current subscription
  const activePlan = plans.find(plan => {
    if (!currentSubscription) return false;
    return plan.id === currentSubscription.plan.id; // Fixed: use plan.id instead of planId
  });

  const handlePlanAction = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      console.error('Plan not found:', planId);
      return;
    }

    // Check if this is a reactivation of a cancelled subscription
    if (activePlan?.id === plan.id && currentSubscription?.isCanceled) {
      setShowReactivateModal(true);
      return;
    }

    // For free plans, handle locally or redirect to signup
    if (plan.isFree) {
      // Handle free plan activation
      console.log('Activating free plan:', planId);
      // You might want to call a different endpoint for free plans
      return;
    }

    // For paid plans, create Stripe checkout session
    try {
      await createCheckoutSession.mutateAsync(planId);
      // Redirect happens automatically in the hook
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription.mutateAsync(currentSubscription?.id);
      setShowCancelModal(false);
    } catch (error) {
      console.error('Error cancelling subscription:', error);
    }
  };

  const handleReactivateSubscription = async () => {
    try {
      await resumeSubscription.mutateAsync();
      setShowReactivateModal(false);
    } catch (error) {
      console.error('Error reactivating subscription:', error);
    }
  };

  const handleManageBilling = async () => {
    try {
      await createBillingPortalSession.mutateAsync();
      // Redirect happens automatically in the hook
    } catch (error) {
      console.error('Error accessing billing portal:', error);
    }
  };

  // Show skeleton when loading
  if (plansLoading || subscriptionLoading) {
    return <MySubscriptionPageSkeleton />;
  }

  if(plansError || subscriptionError) {
    return <div>
      <h1 className='text-center text-xl font-bold text-red-500'  > Error loading subscription plans</h1>
      <p className='text-center text-gray-600'>Please try again later</p>
    </div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="">
        <div className="flex items-center gap-2">
        <span className="block lg:hidden" onClick={() => navigate(-1)}>
            {" "}
            <ArrowLeftIcon className="w-6 h-6" />
          </span> 
         <div>
         <h1 className="text-2xl font-bold text-gray-900 mb-2">My Subscription</h1>
          <p className="text-gray-600">
            Manage your subscription plans and billing preferences
          </p>
         </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.length === 0 && plansLoading ? (
          <div className="col-span-full flex justify-center py-8">
            <SecondaryLoader />
          </div>
        ) : (
          plans.map((plan) => {
            const isActivePlan = activePlan?.id === plan.id;
            return (
          <Card 
            key={plan.id} 
            className={`relative transition-all duration-200 ${
              isActivePlan 
                ? 'border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-lg ring-1 ring-blue-500/20' 
                : 'border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
          >
            {isActivePlan && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className={`text-white px-4 py-1 rounded-full text-sm font-medium shadow-md ${
                  currentSubscription?.isCanceled 
                    ? 'bg-red-600' 
                    : 'bg-blue-600'
                }`}>
                  {currentSubscription?.isCanceled ? 'Cancelled' : 'Current Plan'}
                </div>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isActivePlan ? 'bg-blue-600' : 'bg-blue-100'
                  }`}>
                    <div className={`w-6 h-6 rounded-full ${
                      isActivePlan ? 'bg-white' : 'bg-blue-600'
                    }`}></div>
                  </div>
                  <CardTitle className={`text-xl font-semibold ${
                    isActivePlan? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {plan.name}
                  </CardTitle>
                </div>
                {/* {isActivePlan && (
                  <Badge variant="default" className="bg-green-600 text-white shadow-sm">
                    Active
                  </Badge>
                )} */}
              </div>
              
              <p className={`mt-2 ${
                isActivePlan ? 'text-blue-700' : 'text-gray-600'
              }`}>
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="pt-0">
              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${
                    isActivePlan ? 'text-blue-900' : 'text-black'
                  }`}>
                    {plan.formattedPrice}
                  </span>
                  {plan.period && (
                    <span className={`text-lg ${
                      isActivePlan ? 'text-blue-700' : 'text-gray-600'
                    }`}>
                      /{plan.period}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className={`font-semibold mb-3 ${
                  isActivePlan ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  What's included
                </h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isActivePlan ? 'bg-green-600' : 'bg-blue-600'
                      }`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className={`${
                        isActivePlan ? 'text-blue-800' : 'text-gray-700'
                      }`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="space-y-3">
                {!plan.isFree && <Button
                  onClick={() => handlePlanAction(plan.id)}
                  disabled={createCheckoutSession.isPending || (isActivePlan && !currentSubscription?.isCanceled)}
                  className={`w-full rounded-full text-white ${
                    isActivePlan && !currentSubscription?.isCanceled
                      ? 'bg-green-600 hover:bg-green-700' 
                      : isActivePlan && currentSubscription?.isCanceled
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                  variant="default"
                >
                  {isActivePlan && !currentSubscription?.isCanceled 
                    ? 'Current Plan' 
                    : isActivePlan && currentSubscription?.isCanceled
                    ? 'Reactivate Plan'
                    : createCheckoutSession.isPending 
                    ? 'Processing...' 
                    : plan.buttonText
                  }
                </Button>}
                
                {isActivePlan && currentSubscription && (
                  <div className="text-center space-y-1">
                    {currentSubscription.isCanceled ? (
                      <>
                        <p className="text-sm text-red-600 font-medium">
                          ⚠️ Cancelled - Access ends: {new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          You can still use all features until the end date
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-blue-700 font-medium">
                          {(() => {
                            // Check if it's a free plan by price or if expiry is more than 50 years in future
                            const isFreePlan = plan.isFree || 
                                             plan.planType === 'free' || 
                                             currentSubscription.plan?.price === 0 ||
                                             plan.price === 0;
                            
                            const expiryDate = new Date(currentSubscription.currentPeriodEnd);
                            const now = new Date();
                            const yearsFromNow = (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365);
                            const isLifetime = yearsFromNow > 50; // If expires more than 50 years from now, it's lifetime
                            
                            return isFreePlan || isLifetime 
                              ? 'Lifetime validity' 
                              : `Expires: ${expiryDate.toLocaleDateString()}`;
                          })()}
                        </p>
                        {currentSubscription.isTrialing && currentSubscription.trialEnd && (
                          <p className="text-xs text-amber-600">
                            Trial ends: {new Date(currentSubscription.trialEnd).toLocaleDateString()}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          );
        }))}
      </div>

      {/* Billing Management Actions */}
      {(() => {
        // Hide entire billing section for free plans
        const isFreePlan = activePlan?.isFree || activePlan?.price === 0 || (activePlan as any)?.planType === 'free';
        
        // Hide if no active plan or if it's a free plan
        if (!activePlan || isFreePlan) {
          return null;
        }
        
        // Check if subscription has expired
        const hasExpired = currentSubscription && new Date(currentSubscription.currentPeriodEnd) < new Date();
        if (hasExpired) {
          return null;
        }
        
        return (
          <div className="flex justify-center gap-4">
            <Button
              onClick={handleManageBilling}
              disabled={createBillingPortalSession.isPending}
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50 rounded-full"
            >
              {createBillingPortalSession.isPending ? 'Loading...' : 'Manage Billing'}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            
            {!currentSubscription?.isCanceled && (
              <Button
                onClick={() => setShowCancelModal(true)}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50 rounded-full"
              >
                Cancel My Subscription
              </Button>
            )}
            
            {currentSubscription?.isCanceled && (
              <Button
                onClick={() => setShowReactivateModal(true)}
                variant="outline"
                className="text-green-600 border-green-600 hover:bg-green-50 rounded-full"
              >
                Reactivate Subscription
              </Button>
            )}
          </div>
        );
      })()}

      {/* Cancel Subscription Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onOpenChange={setShowCancelModal}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        description="Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period."
        confirmText="Yes, Cancel"
        cancelText="Keep Subscription"
        confirmVariant="destructive"
        isLoading={cancelSubscription.isPending}
      />

      {/* Reactivate Subscription Modal */}
      <ConfirmationModal
        isOpen={showReactivateModal}
        onOpenChange={setShowReactivateModal}
        onConfirm={handleReactivateSubscription}
        title="Reactivate Subscription"
        description="Are you sure you want to reactivate your subscription? You'll regain access to all premium features and billing will resume."
        confirmText="Yes, Reactivate"
        cancelText="Keep Cancelled"
        confirmVariant="default"
        isLoading={resumeSubscription.isPending}
      />
    </div>
  );
};

export default MySubscriptionPage; 