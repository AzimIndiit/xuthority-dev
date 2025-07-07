// Loader configuration for different pages/sections
export const loaderConfig = {
  // Default settings
  default: {
    type: 'spinner' as const,
    color: '#3B82F6', // Tailwind blue-500
    size: 32,
    showAfter: 100,
    minDuration: 300
  },

  // Page-specific configurations
  pages: {
    badges: {
      type: 'dots' as const,
      text: 'Loading badges...'
    },
    products: {
      type: 'levels' as const,
      text: 'Loading your products...'
    },
    reviews: {
      type: 'windmill' as const,
      text: 'Loading your reviews...'
    },
    favorites: {
      type: 'sentry' as const,
      text: 'Loading your favorites...'
    },
    notifications: {
      type: 'digital' as const,
      text: 'Loading notifications...'
    },
    disputes: {
      type: 'bounce' as const,
      text: 'Loading disputes...'
    },
    profile: {
      type: 'spinner' as const,
      text: 'Loading profile...'
    }
  },

  // Action-specific configurations
  actions: {
    submit: {
      type: 'spinner' as const,
      size: 24,
      text: 'Submitting...'
    },
    upload: {
      type: 'dots' as const,
      text: 'Uploading...'
    },
    search: {
      type: 'levels' as const,
      size: 20,
      text: 'Searching...'
    },
    delete: {
      type: 'bounce' as const,
      text: 'Deleting...'
    }
  }
}; 