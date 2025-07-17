# Mutation Timeout Fix - Preventing Stuck Button Loaders

## Problem Solved

The button loader was getting stuck in a pending state when authentication requests failed to resolve properly. This happened due to:

1. **Network timeouts** - Requests hanging without proper timeout handling
2. **Improper error handling** - Mutations not transitioning out of pending state 
3. **Missing timeout protection** - No safety net for indefinitely pending mutations
4. **Race conditions** - Multiple async operations causing state conflicts

## Solution Implemented

### 1. Enhanced Mutation Timeout Utilities (`src/utils/mutationTimeout.ts`)

```typescript
// Wrap any promise with timeout protection
const result = await withMutationTimeout(
  apiCall(),
  45000, // 45 second timeout
  'Request timed out'
);

// Get standardized retry configuration
const retryConfig = getDefaultMutationRetry();
```

### 2. Mutation Monitoring System (`src/utils/mutationMonitor.ts`)

- **Tracks all active mutations** with unique IDs and timestamps
- **Automatically cleans up stuck mutations** after timeout
- **Provides debugging tools** to inspect active mutations
- **Logs mutation lifecycle** for better debugging

```typescript
// Development debugging (available in browser console)
window.logMutations(); // Shows all active mutations
window.mutationMonitor; // Access to mutation monitor instance
```

### 3. Enhanced Authentication Hooks

Updated `useAuth.ts` with:
- **Timeout protection** using `withMutationTimeout`
- **Mutation monitoring** using `withMutationMonitoring` 
- **Standardized retry logic** with `getDefaultMutationRetry`
- **Better error handling** to prevent stuck states

### 4. Global Query Client Configuration

Updated `queryClient.ts` with:
- **Global mutation retry configuration**
- **Enhanced error handling**
- **Timeout-aware retry logic**

## How It Works

### Before (Problematic)
```typescript
// Could hang indefinitely
const mutation = useMutation({
  mutationFn: async (data) => {
    const result = await apiCall(data); // Might never resolve
    return result;
  }
});
```

### After (Fixed)
```typescript
// Protected with timeout and monitoring
const mutation = useMutation({
  mutationFn: withMutationMonitoring(
    async (data) => {
      const result = await withMutationTimeout(
        apiCall(data),
        45000, // 45 second timeout
        'Request timed out'
      );
      return result;
    },
    'api-call-name',
    50000 // 50 second monitoring timeout
  ),
  retry: getDefaultMutationRetry(),
});
```

## Key Features

### ✅ Automatic Timeout Protection
- All authentication mutations now have 45-second timeouts
- Monitoring system provides 50-second backup timeout
- Global safety net prevents indefinite pending states

### ✅ Smart Retry Logic
- Won't retry on timeout, validation, or auth errors
- Limited to 2 retries maximum
- Prevents infinite retry loops

### ✅ Enhanced Debugging
- Mutation lifecycle logging in development
- Browser console debugging tools
- Detailed error tracking and reporting

### ✅ Graceful Error Handling
- Proper error propagation to React Query
- User-friendly error messages via toast
- No duplicate error notifications

## Usage Guidelines

### For New Mutations
```typescript
import { withMutationTimeout, getDefaultMutationRetry } from '@/utils/mutationTimeout';
import { withMutationMonitoring } from '@/utils/mutationMonitor';

export const useMyMutation = () => {
  return useMutation({
    mutationFn: withMutationMonitoring(
      async (data) => {
        return await withMutationTimeout(
          myApiCall(data),
          30000, // 30 second timeout
          'Operation timed out'
        );
      },
      'my-operation',
      35000 // 35 second monitoring timeout
    ),
    retry: getDefaultMutationRetry(),
  });
};
```

### For Debugging Stuck Mutations
```javascript
// In browser console (development only)
logMutations(); // See all active mutations
mutationMonitor.getActiveMutations(); // Get detailed info
mutationMonitor.forceCleanup('mutation-id'); // Force cleanup
```

## Button Component Integration

The existing Button component automatically shows loading state when `loading={mutation.isPending}` is used:

```tsx
<Button
  type="submit"
  loading={registerMutation.isPending}
  disabled={registerMutation.isPending}
>
  Sign Up
</Button>
```

With the timeout fixes, the `isPending` state will now properly resolve instead of hanging indefinitely.

## Testing the Fix

1. **Normal Flow**: Button loader appears and disappears correctly
2. **Network Issues**: Mutation times out after 45 seconds, button returns to normal
3. **Server Errors**: Mutation fails immediately, button returns to normal
4. **Multiple Submissions**: Subsequent attempts work properly

## Monitoring & Alerts

The system provides several layers of protection:

1. **Request Level**: 45-second timeout on individual API calls
2. **Mutation Level**: 50-second monitoring timeout 
3. **Global Level**: Query client retry configuration
4. **Development**: Console logging and debugging tools

This comprehensive approach ensures button loaders will never get permanently stuck, providing a much better user experience. 