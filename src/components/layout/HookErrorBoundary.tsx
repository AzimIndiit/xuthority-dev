import React from 'react';

interface HookErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface HookErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

class HookErrorBoundary extends React.Component<HookErrorBoundaryProps, HookErrorBoundaryState> {
  constructor(props: HookErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): HookErrorBoundaryState {
    // Check if this is a hook order error
    const isHookError = error.message.includes('hooks') || 
                       error.message.includes('Hook') || 
                       error.message.includes('Rendered fewer hooks than expected');
    
    return {
      hasError: isHookError,
      error: isHookError ? error : null
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const isHookError = error.message.includes('hooks') || 
                       error.message.includes('Hook') || 
                       error.message.includes('Rendered fewer hooks than expected');
    
    if (isHookError) {
      console.error('Hook order error caught:', error, errorInfo);
      
      // Force a page reload to reset the component state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              The page is reloading to fix the issue...
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default HookErrorBoundary; 