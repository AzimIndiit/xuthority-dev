// Utility function to get nested error from react-hook-form errors object
export const getNestedError = (errors: any, path: string) => {
  return path.split('.').reduce((current, key) => {
    if (current && typeof current === 'object') {
      // Handle array indices
      if (!isNaN(Number(key))) {
        return current[Number(key)];
      }
      return current[key];
    }
    return undefined;
  }, errors);
};

// Helper to check if a nested error exists
export const hasNestedError = (errors: any, path: string): boolean => {
  const error = getNestedError(errors, path);
  return !!error?.message;
};

// Get error message from nested path
export const getNestedErrorMessage = (errors: any, path: string): string | undefined => {
  const error = getNestedError(errors, path);
  return error?.message;
}; 