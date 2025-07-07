# Secondary Loader Implementation

This document describes the implementation of secondary loaders using `react-activity` library in the xuthority application.

## Overview

We've implemented a secondary loader system that provides better user experience by:
- Preventing flash of loading states for fast operations
- Ensuring minimum display duration to avoid jarring transitions
- Providing various loader animations for different contexts
- Offering consistent loading states across the application

## Components

### 1. SecondaryLoader Component
Located at: `src/components/SecondaryLoader.tsx`

A flexible loader component that supports multiple animation types from react-activity:
- **spinner** - Classic spinning loader
- **dots** - Three animated dots
- **levels** - Audio level-like bars
- **sentry** - Rotating squares
- **windmill** - Windmill animation
- **digital** - Digital clock-like animation
- **bounce** - Bouncing animation

```typescript
<SecondaryLoader 
  type="dots" 
  text="Loading badges..." 
  size={32}
  color="#3B82F6"
/>
```

### 2. PageLoaderWrapper Component
Located at: `src/components/PageLoaderWrapper.tsx`

A wrapper component that handles loading states for entire pages:

```typescript
<PageLoaderWrapper 
  isLoading={isLoading} 
  loaderType="spinner"
  loaderText="Loading..."
>
  {/* Your page content */}
</PageLoaderWrapper>
```

## Hooks

### usePageLoader Hook
Located at: `src/hooks/usePageLoader.ts`

Manages loading state visibility with configurable delays:

```typescript
const showLoader = usePageLoader(isLoading, {
  showAfter: 100,    // Show loader after 100ms
  delay: 300         // Keep visible for at least 300ms
});
```

### useMultipleLoaders Hook
Combines multiple loading states:

```typescript
const showLoader = useMultipleLoaders({
  users: isLoadingUsers,
  posts: isLoadingPosts,
  comments: isLoadingComments
});
```

## Configuration

Located at: `src/config/loaders.ts`

Centralized configuration for loader preferences:

```typescript
export const loaderConfig = {
  default: {
    type: 'spinner',
    color: '#3B82F6',
    size: 32,
    showAfter: 100,
    minDuration: 300
  },
  pages: {
    badges: { type: 'dots', text: 'Loading badges...' },
    products: { type: 'levels', text: 'Loading your products...' },
    // ... more page configs
  }
};
```

## Usage Examples

### Basic Usage
```typescript
import SecondaryLoader from '@/components/SecondaryLoader';
import { usePageLoader } from '@/hooks/usePageLoader';

const MyComponent = () => {
  const { data, isLoading } = useQuery(...);
  const showLoader = usePageLoader(isLoading);

  if (showLoader) {
    return <SecondaryLoader type="dots" text="Loading..." />;
  }

  return <div>{/* Your content */}</div>;
};
```

### With Configuration
```typescript
import { loaderConfig } from '@/config/loaders';

const BadgesPage = () => {
  const showLoader = usePageLoader(isLoading);
  
  if (showLoader) {
    return <SecondaryLoader {...loaderConfig.pages.badges} />;
  }
  // ...
};
```

### Full Screen Loader
```typescript
<SecondaryLoader 
  type="spinner" 
  text="Processing..." 
  fullScreen={true}
/>
```

## Best Practices

1. **Choose appropriate loader types** - Different animations convey different meanings:
   - `spinner` - General loading
   - `dots` - Content loading
   - `levels` - Data processing
   - `bounce` - Playful/casual operations

2. **Use consistent delays** - Stick to the default showAfter (100ms) and minDuration (300ms) unless specific needs arise

3. **Provide meaningful text** - Always include descriptive loading text for better UX

4. **Handle error states** - Don't forget to handle errors alongside loading states

5. **Avoid nested loaders** - Use one loader per view hierarchy level

## Migration Guide

To migrate from simple spinners to SecondaryLoader:

1. Import the necessary components:
```typescript
import SecondaryLoader from '@/components/SecondaryLoader';
import { usePageLoader } from '@/hooks/usePageLoader';
```

2. Replace loading state check:
```typescript
// Before
if (isLoading) {
  return <div className="animate-spin..."></div>;
}

// After
const showLoader = usePageLoader(isLoading);
if (showLoader) {
  return <SecondaryLoader type="spinner" text="Loading..." />;
}
```

## Performance Considerations

- The `usePageLoader` hook prevents unnecessary re-renders by managing its own state
- Loader animations are CSS-based for optimal performance
- The delay mechanism prevents flash of loading state for fast operations
- React Activity library is lightweight (~15KB gzipped)

## Troubleshooting

**Loader flashing too quickly**: Increase the `minDuration` in usePageLoader options

**Loader appearing too late**: Decrease the `showAfter` delay

**Loader not appearing**: Check if the loading state is properly passed to usePageLoader

**Style conflicts**: Ensure react-activity CSS is imported: `import 'react-activity/dist/library.css'` 