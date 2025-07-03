# Review Comments Implementation

## Overview
This document describes the implementation of the review comments/replies feature for the Xuthority platform.

## Navigation Flow

### 1. Review Card Component
- Located in: `/src/components/product/ReviewCard.tsx`
- When a user clicks "View Comments" on a review:
  - The component navigates to `/product-detail/{productSlug}/reviews`
  - Passes the `reviewId` and `review` object in the navigation state (not URL params)

### 2. Review Comments Page
- Located in: `/src/pages/review/ReviewCommentsPage.tsx`
- Retrieves `reviewId` from `location.state` instead of URL params
- Displays:
  - Original review details at the top
  - Comment form for adding new comments
  - List of all comments with user info
  - Edit/Delete functionality for own comments
  - Helpful vote system
  - Pagination with "Load More" button

## Key Features

### Comment Management
- **Add Comment**: Authenticated users can add comments to reviews
- **Edit Comment**: Users can edit their own comments
- **Delete Comment**: Users can delete their own comments with confirmation
- **Helpful Votes**: Users can mark comments as helpful

### Pagination
- Comments are loaded 10 at a time
- "Load More Comments" button appears when more comments are available
- New comments reset the pagination to show from the beginning
- Edited comments are updated in place without refetching
- Deleted comments are removed from the list immediately

### Navigation State
Instead of passing `reviewId` as a URL parameter, it's passed through React Router's state:

```typescript
// In ReviewCard.tsx
navigate(`/product-detail/${productSlug}/reviews`, {
  state: { 
    reviewId: backendReview._id,
    review: backendReview 
  }
});

// In ReviewCommentsPage.tsx
const reviewId = location.state?.reviewId;
const reviewFromState = location.state?.review;
```

## API Integration

### Endpoints Used
- `GET /api/v1/reviews/{reviewId}/replies` - Fetch all replies for a review (with pagination)
- `POST /api/v1/reviews/{reviewId}/replies` - Create a new reply
- `PUT /api/v1/replies/{id}` - Update a reply
- `DELETE /api/v1/replies/{id}` - Delete a reply
- `POST /api/v1/replies/{id}/helpful` - Vote reply as helpful
- `DELETE /api/v1/replies/{id}/helpful` - Remove helpful vote

### Services
- `/src/services/reviewReply.ts` - API service for review replies
- `/src/hooks/useReviewReply.ts` - React hooks for review reply operations

## Component Props Flow

1. **ProductReviews** → passes `product.slug` to **ReviewList**
2. **ReviewList** → passes `productSlug` to each **ReviewCard**
3. **ReviewCard** → uses `productSlug` for navigation

## UI/UX Features

- **Loading States**: 
  - Initial loading shows loader in center
  - "Load More" button shows inline loader while fetching
- **Empty States**: Friendly message when no comments exist
- **Error Handling**: Proper error messages for failed operations
- **Responsive Design**: Works on all screen sizes
- **Real-time Updates**: 
  - Comments update immediately after actions
  - Edit/Delete operations update the local state
  - New comments trigger a refresh from page 1
- **Authentication**: Prompts login for unauthenticated users

## Pagination Implementation

### State Management
```typescript
const [page, setPage] = useState(1);
const [allReplies, setAllReplies] = useState<any[]>([]);
const [hasMoreReplies, setHasMoreReplies] = useState(true);
```

### Loading Strategy
- First page replaces all existing replies
- Subsequent pages append to the existing list
- `hasMoreReplies` is determined from the API response pagination metadata

### User Actions Impact
- **Adding a comment**: Adds to the beginning of the list instantly (no refetch)
- **Editing a comment**: Updates in place without refetching
- **Deleting a comment**: Removes from list without refetching
- **Loading more**: Increments page and appends results

## Smooth User Experience

### Optimistic Updates
- **New Comments**: Appear instantly at the top of the list without waiting for server response
- **Vote Updates**: Helpful votes update immediately with rollback on error
- **Edit/Delete**: Local state updates provide instant feedback

### Performance Optimizations
- **No Full Reloads**: All operations update only the affected parts of the UI
- **Fade-in Animation**: New comments smoothly animate into view
- **Preserved Scroll Position**: User's scroll position is maintained during updates
- **Separate Loading States**: Initial load vs "Load More" have different loading indicators
- **Local State Management**: Comments are managed locally to avoid unnecessary API calls
- **Duplicate Prevention**: Tracks loaded pages to prevent duplicate comments when loading more
- **Smart Deduplication**: Filters out duplicates based on comment ID when appending new pages

## Date Formatting

Uses relative time formatting for recent dates:
- "just now" for very recent comments
- "2 hours ago", "3 days ago" for recent comments
- Absolute dates for older comments

## Security Features

- Only authenticated users can add comments
- Users can only edit/delete their own comments
- Input sanitization on the backend
- Proper authorization checks 