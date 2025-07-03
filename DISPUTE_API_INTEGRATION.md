# Dispute API Integration

This document describes the implementation of the Dispute feature API integration.

## Overview

The Dispute feature allows vendors to:
- View disputes on their product reviews
- Create new disputes on reviews
- Update dispute details
- Delete disputes
- Add explanations to active disputes

## API Endpoints

### Disputes
- `GET /api/v1/disputes` - Get vendor's disputes (with pagination)
- `GET /api/v1/disputes/all` - Get all disputes (Admin only)
- `GET /api/v1/disputes/:id` - Get single dispute
- `POST /api/v1/disputes` - Create new dispute
- `PUT /api/v1/disputes/:id` - Update dispute
- `DELETE /api/v1/disputes/:id` - Delete dispute

## Implementation Details

### Services (`/src/services/dispute.ts`)
- Defines all API calls for dispute features
- Exports TypeScript interfaces for type safety
- Handles request/response formatting
- Provides dispute reason constants

### Hooks (`/src/hooks/useDispute.ts`)
- React Query hooks for all dispute operations
- Automatic cache management
- Optimistic updates for better UX
- Toast notifications for user feedback

### Components Updated

#### DisputesPage (`/src/pages/software/DisputesPage.tsx`)
- Integrated with `useVendorDisputes` hook to fetch disputes
- Transforms API data to match UI structure
- Added loading states
- Empty states for no content
- Passes ownership information to DisputeCard

#### DisputeModal (`/src/components/product/DisputeModal.tsx`)
- Modal component for creating new disputes
- Form with reason dropdown and description textarea
- Integrated with `useCreateDispute` hook
- Form validation and character count
- Submits dispute to backend API

#### ReviewCard (`/src/components/product/ReviewCard.tsx`)
- Added Dispute button for vendors
- Uses Lucide icons (Reply, FileText)
- Opens DisputeModal on click
- Only visible to vendor users

## Features Implemented

### Dispute Management
- ✅ List all vendor disputes with pagination
- ✅ Transform API data to UI format
- ✅ Show dispute status (Active/Resolved)
- ✅ Display dispute reason with proper labels
- ✅ Show dispute explanation and claims
- ✅ Track dispute ownership for UI controls
- ✅ Create new disputes from review cards
- ✅ Dispute modal with form validation

### User Experience
- ✅ Loading states for all operations
- ✅ Empty states with helpful messages
- ✅ Proper error handling
- ✅ Data transformation for UI compatibility
- ✅ Modal interface for creating disputes
- ✅ Character count for description field
- ✅ Form validation (min 10 characters)

## Data Transformation

The API returns data in a different format than the UI expects, so transformation is done:

```typescript
// API Dispute format
{
  _id: string,
  review: { _id, title, content, overallRating, reviewer },
  vendor: { _id, firstName, lastName, email },
  product: { _id, name, slug },
  reason: 'false-or-misleading-information' | ...,
  description: string,
  status: 'active' | 'resolved',
  createdAt: string,
  updatedAt: string
}

// UI Dispute format
{
  id: string,
  disputer: { name, avatarUrl },
  date: string,
  reason: string (label),
  status: 'Active' | 'Resolved',
  explanation: string,
  claims: string[],
  isOwner?: boolean,
  vendorId?: string,
  reviewId?: string
}
```

## Dispute Reasons

The following dispute reasons are supported:
- False or Misleading Information
- Spam or Fake Review
- Inappropriate Content
- Conflict of Interest
- Other

## Authorization

- Only vendors can create, view, update, and delete disputes
- Vendors can only manage disputes on their own products
- Admin users can view all disputes

## UI Behavior

Based on the requirements:
- If the current logged-in user is the owner of the dispute:
  - Edit and Delete Review buttons are visible
  - Add Explanation section is shown for active disputes
- These controls are passed to DisputeCard via the dispute object

## Future Enhancements

1. **Edit/Delete Integration**: Implement actual edit/delete functionality for reviews
2. **Add Explanation**: Implement the add explanation feature
3. **Filtering**: Add filters for dispute status
4. **Search**: Add search functionality for disputes
5. **Bulk Actions**: Allow bulk status updates

## Testing

To test the integration:
1. Navigate to `/disputes` as a vendor user
2. View existing disputes
3. Check that ownership controls are properly displayed
4. Verify loading and empty states 