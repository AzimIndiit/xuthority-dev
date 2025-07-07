# Badge Request API Implementation

## Overview
This document describes the implementation of the badge request functionality in the Xuthority platform.

## Frontend Implementation

### Components

#### BadgeCard Component (`src/components/badges/BadgeCard.tsx`)
- Displays individual badge with status-based styling
- Shows different states: `available`, `requested`, `approved`
- Handles badge request button click
- Visual feedback for different states:
  - Available: Red "Request Badge" button
  - Requested: Yellow "Requested" button (disabled)
  - Approved: Green "Approved" button (disabled)

#### MyBadgesPage Component (`src/pages/user/MyBadgesPage.tsx`)
- Displays all available badges for vendors
- Fetches both all badges and user's badge statuses
- Maps badge status for each badge
- Handles badge request action
- Vendor-only access (redirects non-vendors)

### Services

#### Badge Service (`src/services/badge.ts`)
- `getAllBadges()`: Fetches all available badges
- `getUserBadges()`: Fetches user's badge requests/approvals
- `requestBadge(badgeId)`: Submits a badge request

### Hooks

#### useBadges Hook (`src/hooks/useBadges.ts`)
- `useAllBadges()`: React Query hook for fetching all badges
- `useUserBadges()`: React Query hook for fetching user badges
- `useRequestBadge()`: Mutation hook for requesting badges
- Handles cache invalidation after badge request
- Shows success/error toast notifications

## Backend Implementation

### API Endpoints

#### Badge Routes (`/api/v1/badges`)
- `GET /badges` - Get all badges (public, with user status if authenticated)
- `GET /badges/:id` - Get badge by ID
- `POST /badges` - Create badge (admin only)
- `PUT /badges/:id` - Update badge (admin only)
- `DELETE /badges/:id` - Delete badge (admin only)

#### User Badge Routes (`/api/v1/user-badges`)
- `POST /user-badges/request` - Request a badge (vendor only)
- `GET /user-badges/me` - Get current user's badges
- `GET /user-badges/user/:userId` - Get badges for specific user
- `PATCH /user-badges/:id/cancel` - Cancel badge request (vendor only)
- `PATCH /user-badges/:id/approve` - Approve badge request (admin only)

### Controllers

#### Badge Controller (`src/controllers/badgeController.js`)
- Handles CRUD operations for badges
- Returns user-specific flags (requested/approved) when authenticated

#### User Badge Controller (`src/controllers/userBadgeController.js`)
- Handles badge requests from vendors
- Prevents duplicate requests
- Sends notifications on badge request/approval
- Only vendors can request badges

### Models

#### Badge Model
- `title`: Badge name
- `description`: Badge description
- `icon`: Badge icon URL
- `colorCode`: Badge color for display
- `criteria`: Array of requirements
- `status`: active/inactive

#### UserBadge Model
- `userId`: Reference to user
- `badgeId`: Reference to badge
- `status`: requested/accepted/rejected/canceled
- `reason`: Optional reason for request
- `requestedAt`, `approvedAt`, `rejectedAt`: Timestamps

## User Flow

1. **Vendor visits My Badges page**
   - All available badges are displayed
   - Each badge shows current status

2. **Vendor requests a badge**
   - Clicks "Request Badge" button
   - API call to `/user-badges/request`
   - Badge status updates to "Requested"
   - Notification sent to vendor
   - Button becomes disabled

3. **Admin reviews request**
   - Can approve or reject request
   - Vendor receives notification of decision

4. **Badge status updates**
   - Approved badges show with full color
   - Requested badges show with muted colors
   - Available badges show with grayscale

## Key Features

- **Role-based access**: Only vendors can request badges
- **Duplicate prevention**: Can't request same badge twice
- **Real-time updates**: UI updates immediately after request
- **Notifications**: Users notified of badge status changes
- **Visual feedback**: Clear indication of badge status
- **Responsive design**: Works on all screen sizes

## Error Handling

- Proper error messages for failed requests
- Toast notifications for user feedback
- Graceful handling of network errors
- Validation on both frontend and backend

## Security Considerations

- Authentication required for badge requests
- Role-based authorization (vendor-only)
- Input validation on backend
- Prevention of duplicate requests
- Admin-only badge management 