# Common Components

## NotFoundPage

A reusable component for displaying 404 pages, product not found, or any "not found" scenarios.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Oops! Not found."` | Custom title for the not found message |
| `description` | `string` | `undefined` | Custom description/subtitle |
| `imageSrc` | `string` | `"/svg/404.svg"` | Custom image source |
| `imageAlt` | `string` | `"Not found"` | Custom image alt text |
| `buttonText` | `string` | `"Go Back Home"` | Custom button text |
| `navigateTo` | `string` | `"/"` | Custom navigation path |
| `buttonIcon` | `React.ComponentType` | `HomeIcon` | Custom button icon |
| `containerHeight` | `string` | `"min-h-[80vh]"` | Custom container height classes |
| `showBackButton` | `boolean` | `false` | Show back button instead of home button |
| `onButtonClick` | `() => void` | `undefined` | Custom callback function instead of navigation |

### Usage Examples

#### Basic Usage
```tsx
import { NotFoundPage } from "@/components/common";

function MyComponent() {
  return <NotFoundPage />;
}
```

#### Product Not Found
```tsx
import { NotFoundPage } from "@/components/common";

function ProductPage() {
  return (
    <NotFoundPage 
      title="Product not found"
      description="The product you're looking for doesn't exist or has been removed."
      buttonText="Browse Products"
      navigateTo="/products"
    />
  );
}
```

#### Custom Action
```tsx
import { NotFoundPage } from "@/components/common";
import { RefreshCwIcon } from "lucide-react";

function MyComponent() {
  const handleRetry = () => {
    // Custom retry logic
    window.location.reload();
  };

  return (
    <NotFoundPage 
      title="Failed to load"
      description="Something went wrong. Please try again."
      buttonText="Retry"
      buttonIcon={RefreshCwIcon}
      onButtonClick={handleRetry}
    />
  );
}
```

#### Go Back Navigation
```tsx
import { NotFoundPage } from "@/components/common";

function MyComponent() {
  return (
    <NotFoundPage 
      title="Access Denied"
      description="You don't have permission to view this page."
      buttonText="Go Back"
      showBackButton={true}
    />
  );
}
```

## EmptyState

A specialized component for displaying empty data states, extending the NotFoundPage component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"No data found"` | Custom title for the empty state |
| `description` | `string` | `"There's nothing to display here yet."` | Custom description |
| `imageSrc` | `string` | `"/svg/no_data.svg"` | Custom image source |
| `buttonText` | `string` | `"Refresh"` | Custom button text |
| `onButtonClick` | `() => void` | `undefined` | Custom callback function |
| `showRefreshButton` | `boolean` | `true` | Show refresh button |
| `containerHeight` | `string` | `"min-h-[40vh]"` | Custom container height classes |

### Usage Examples

#### Basic Empty State
```tsx
import { EmptyState } from "@/components/common";

function MyList() {
  const { data, refetch } = useQuery('myData', fetchData);

  if (!data?.length) {
    return (
      <EmptyState 
        title="No items found"
        description="Add your first item to get started."
        onButtonClick={refetch}
      />
    );
  }

  return <div>{/* render data */}</div>;
}
```

#### Search Results Empty State
```tsx
import { EmptyState } from "@/components/common";

function SearchResults({ query, onClearSearch }) {
  return (
    <EmptyState 
      title="No results found"
      description={`No results found for "${query}". Try adjusting your search terms.`}
      buttonText="Clear Search"
      showRefreshButton={false}
      onButtonClick={onClearSearch}
    />
  );
}
```

## Benefits

1. **Consistency**: Ensures all not-found states look and behave consistently across the app
2. **Flexibility**: Highly customizable with props for different use cases
3. **Accessibility**: Includes proper alt text and semantic HTML
4. **Responsive**: Mobile-first design with responsive image sizing
5. **Reusable**: Can be used for 404 pages, product not found, empty states, etc.
6. **Type Safe**: Full TypeScript support with proper prop types

## Best Practices

1. **Use appropriate titles**: Make titles specific to the context (e.g., "Product not found" vs "Page not found")
2. **Provide helpful descriptions**: Give users context about what happened and what they can do
3. **Choose appropriate actions**: Use "Go Back" for navigation errors, "Refresh" for data loading errors
4. **Customize images**: Use context-appropriate images when available
5. **Consider container height**: Use appropriate heights for different layouts (full screen vs component) 