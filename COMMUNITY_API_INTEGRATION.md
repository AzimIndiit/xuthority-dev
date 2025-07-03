# Community API Integration

This document describes the implementation of the Community Q&A feature API integration.

## Overview

The Community feature allows users to:
- Ask questions about products
- Answer questions from other users
- View all questions and answers
- Delete their own questions
- View their activity (questions asked)

## API Endpoints

### Questions
- `GET /api/v1/community/questions` - Get all questions (with pagination)
- `GET /api/v1/community/questions/:id` - Get single question
- `POST /api/v1/community/questions` - Create new question
- `PUT /api/v1/community/questions/:id` - Update question
- `DELETE /api/v1/community/questions/:id` - Delete question

### Answers
- `GET /api/v1/community/questions/:questionId/answers` - Get answers for a question
- `GET /api/v1/community/answers/:id` - Get single answer
- `POST /api/v1/community/questions/:questionId/answers` - Create new answer
- `PUT /api/v1/community/answers/:id` - Update answer
- `DELETE /api/v1/community/answers/:id` - Delete answer

### Search
- `GET /api/v1/community/search` - Search questions and answers

## Implementation Details

### Services (`/src/services/community.ts`)
- Defines all API calls for community features
- Exports TypeScript interfaces for type safety
- Handles request/response formatting

### Hooks (`/src/hooks/useCommunity.ts`)
- React Query hooks for all community operations
- Automatic cache management
- Optimistic updates for better UX
- Toast notifications for user feedback

### Components Updated

#### CommunityPage (`/src/pages/software/CommunityPage.tsx`)
- Integrated with `useQuestions` hook to fetch questions
- Added loading states
- Sorting functionality (Most Recent/Newest)
- Empty states for no content
- Authentication checks

#### QuestionCard (`/src/components/product/QuestionCard.tsx`)
- Integrated with `useAnswers` hook to fetch answers
- Dynamic answer loading (3 initially, then all)
- Delete question functionality for owners
- Authentication prompts for unauthenticated users
- Loading states for answers

#### AskQuestionModal (`/src/components/product/AskQuestionModal.tsx`)
- Integrated with `useCreateQuestion` hook
- Form validation
- Authentication checks
- Success/error handling

#### WriteAnswreModal (`/src/components/product/WriteAnswreModal.tsx`)
- Integrated with `useCreateAnswer` and `useUpdateAnswer` hooks
- Supports both create and edit modes
- Accepts questionId prop for new answers
- Accepts editAnswerId and editAnswerContent for editing
- Form validation
- Authentication checks
- Success/error handling

## Features Implemented

### Question Management
- ✅ List all questions with pagination
- ✅ Create new questions (authenticated users)
- ✅ Delete own questions
- ✅ Sort questions (Most Recent/Newest)
- ✅ Show question ownership badge

### Answer Management
- ✅ View answers for each question
- ✅ Create new answers (authenticated users)
- ✅ Lazy load answers (3 initially, then all)
- ✅ Show/hide all answers toggle

### User Experience
- ✅ Loading states for all operations
- ✅ Empty states with helpful messages
- ✅ Authentication prompts for protected actions
- ✅ Toast notifications for success/error
- ✅ Form validation
- ✅ Optimistic updates

## Data Transformation

The API returns data in a different format than the UI expects, so transformation is done:

```typescript
// API Question format
{
  _id: string,
  title: string,
  author: { _id, firstName, lastName, avatar, email },
  createdAt: string,
  totalAnswers: number
}

// UI Question format
{
  id: string,
  question: string,
  date: string,
  isOwnQuestion: boolean,
  answers: Answer[]
}
```

## My Answers Implementation

The "My Answers" tab now properly fetches and displays all answers created by the logged-in user:

1. **Custom Hook**: `useUserAnswers` fetches all questions and filters answers by userId
2. **Edit Functionality**: Users can edit their answers using the WriteAnswreModal
   - Click "Edit Answer" button to open the modal with existing content
   - Modal title changes to "Edit Answer" in edit mode
   - Submit button shows "Update" instead of "Submit"
3. **Delete Functionality**: Users can delete their answers with confirmation
4. **Loading States**: Shows loading spinner while fetching data
5. **Empty State**: Shows message when user hasn't answered any questions

## Limitations & Future Improvements

1. **My Answers Performance**: Currently fetches all questions to find user's answers
   - This is inefficient for large datasets
   - Backend should provide a dedicated endpoint like `/api/v1/community/users/{userId}/answers`
   - Current implementation is a workaround

2. **Vendor Badge**: Cannot show vendor badges on answers
   - User role is not populated in answer author data
   - Backend needs to include role in population

3. **Product Association**: Questions are not associated with specific products
   - Product ID needs to be passed when creating questions
   - Requires mapping product slug to ID

4. **Real-time Updates**: No WebSocket integration
   - New questions/answers require manual refresh
   - Could add real-time updates in future

5. **Search Functionality**: Search endpoint exists but not integrated in UI
   - Could add search bar in community page

## Testing

To test the integration:

1. Navigate to `/product-detail/{productSlug}/community`
2. View existing questions and answers
3. Click "Ask Questions" to create a new question
4. Click "Write Your Answers" on any question to add an answer
5. Delete your own questions using the delete button (now with confirmation modal)
6. Edit your own answers using the "Edit Answer" button
7. Delete your own answers using the "Delete Answer" button (with confirmation modal)
8. Test authentication by logging out and trying protected actions 