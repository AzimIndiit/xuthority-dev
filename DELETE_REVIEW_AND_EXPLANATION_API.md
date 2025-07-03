# Delete Review and Explanation API Integration

## Overview
This document covers the implementation of delete review functionality and dispute explanation submission feature.

## Frontend Changes

### 1. Review Service Updates
**File:** `src/services/review.ts`

Added delete review function:
```typescript
export async function deleteReview(reviewId: string) {
  return ApiService.delete(`/product-reviews/${reviewId}`);
}
```

### 2. Review Hooks Updates
**File:** `src/hooks/useReview.ts`

Added delete review hook:
```typescript
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews'] });
      queryClient.invalidateQueries({ queryKey: ['userReview'] });
      success('Review deleted successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to delete review');
    }
  });
};
```

### 3. Dispute Service Updates
**File:** `src/services/dispute.ts`

Added explanation submission:
```typescript
export interface AddExplanationData {
  explanation: string;
}

export const addExplanation = (disputeId: string, data: AddExplanationData) => {
  return api.post(`/disputes/${disputeId}/explanation`, data);
};
```

### 4. Dispute Hooks Updates
**File:** `src/hooks/useDispute.ts`

Added explanation submission hook:
```typescript
export const useAddExplanation = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  return useMutation({
    mutationFn: ({ disputeId, data }: { disputeId: string; data: disputeService.AddExplanationData }) => 
      disputeService.addExplanation(disputeId, data),
    onSuccess: (response, { disputeId }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.disputes] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.dispute, disputeId] });
      success('Explanation added successfully');
    },
    onError: (err: any) => {
      error(err.response?.data?.error?.message || 'Failed to add explanation');
    }
  });
};
```

### 5. DisputeCard Component Updates
**File:** `src/components/dispute/DisputeCard.tsx`

Enhanced with delete and explanation functionality:
- Added state management for delete modal and explanation input
- Implemented delete review with confirmation modal
- Added explanation submission with loading states
- Integrated proper error handling and user feedback

Key features:
- Delete review button with confirmation modal
- Explanation input field with character validation
- Loading states for both operations
- Proper authorization checks (only review owners can delete)
- Real-time UI updates after operations

## Backend Changes

### 1. Dispute Model Updates
**File:** `src/models/Dispute.js`

Added explanations field:
```javascript
explanations: [{
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 2000,
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}]
```

### 2. Dispute Routes Updates
**File:** `src/routes/disputes.js`

Added explanation endpoint:
```javascript
router.post(
  '/:id/explanation',
  auth,
  validate(disputeValidator.addExplanationValidator),
  disputeController.addExplanation
);
```

### 3. Dispute Validator Updates
**File:** `src/validators/disputeValidator.js`

Added explanation validator:
```javascript
const addExplanationValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid dispute ID'),
  body('explanation')
    .notEmpty()
    .withMessage('Explanation is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Explanation must be between 1 and 2000 characters')
    .trim()
];
```

### 4. Dispute Controller Updates
**File:** `src/controllers/disputeController.js`

Added explanation controller:
```javascript
const addExplanation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { explanation } = req.body;
    const userId = req.user.id;

    const dispute = await disputeService.addExplanation(id, userId, explanation);

    return res.json(
      ApiResponse.success(
        dispute,
        'Explanation added successfully'
      )
    );
  } catch (error) {
    next(error);
  }
};
```

### 5. Dispute Service Updates
**File:** `src/services/disputeService.js`

Added explanation service method:
```javascript
const addExplanation = async (disputeId, userId, explanation) => {
  try {
    const dispute = await Dispute.findById(disputeId);
    
    if (!dispute) {
      throw new ApiError('Dispute not found', 'NOT_FOUND', 404);
    }

    // Check authorization (vendor or review author)
    const review = await ProductReview.findById(dispute.review);
    const isVendor = dispute.vendor.toString() === userId.toString();
    const isReviewAuthor = review && review.reviewer.toString() === userId.toString();
    
    if (!isVendor && !isReviewAuthor) {
      throw new ApiError('You are not authorized to add explanations to this dispute', 'UNAUTHORIZED', 403);
    }

    // Add explanation
    dispute.explanations.push({
      content: explanation,
      author: userId,
      createdAt: new Date()
    });

    await dispute.save();

    // Return populated dispute
    return await Dispute.findById(disputeId)
      .populate([
        { path: 'review', select: 'title content overallRating reviewer', populate: { path: 'reviewer', select: 'firstName lastName avatar companyName companySize title' } },
        { path: 'product', select: 'name slug' },
        { path: 'vendor', select: 'firstName lastName email' },
        { path: 'explanations.author', select: 'firstName lastName avatar' }
      ]);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Failed to add explanation', 'ADD_EXPLANATION_FAILED', 500);
  }
};
```

## API Endpoints

### Delete Review
- **Method:** DELETE
- **Endpoint:** `/api/v1/product-reviews/:id`
- **Authentication:** Required
- **Authorization:** Review owner or admin only
- **Response:** Success message

### Add Explanation to Dispute
- **Method:** POST
- **Endpoint:** `/api/v1/disputes/:id/explanation`
- **Authentication:** Required
- **Authorization:** Dispute vendor or review author
- **Body:**
  ```json
  {
    "explanation": "string (1-2000 characters)"
  }
  ```
- **Response:** Updated dispute with explanations

## Features

### Delete Review
- ✅ Confirmation modal before deletion
- ✅ Loading states during deletion
- ✅ Proper authorization (only review owners)
- ✅ Real-time UI updates
- ✅ Toast notifications
- ✅ Query invalidation for cache updates

### Add Explanation
- ✅ Input validation (1-2000 characters)
- ✅ Loading states during submission
- ✅ Authorization for both vendors and review authors
- ✅ Real-time UI updates
- ✅ Toast notifications
- ✅ Automatic input clearing after submission

## Security Considerations

1. **Authorization**: Both endpoints check user permissions
2. **Input Validation**: Explanation content is validated for length
3. **Error Handling**: Proper error messages without sensitive data
4. **Notifications**: Automatic notifications to involved parties

## Testing

### Frontend Testing
```bash
# Test delete review functionality
npm test -- --testNamePattern="delete review"

# Test explanation submission
npm test -- --testNamePattern="add explanation"
```

### Backend Testing
```bash
# Test delete review endpoint
npm test -- --testNamePattern="DELETE /api/v1/product-reviews"

# Test explanation endpoint
npm test -- --testNamePattern="POST /api/v1/disputes/:id/explanation"
```

## Usage Examples

### Delete Review
```typescript
const deleteReviewMutation = useDeleteReview();

const handleDeleteReview = () => {
  deleteReviewMutation.mutate(reviewId);
};
```

### Add Explanation
```typescript
const addExplanationMutation = useAddExplanation();

const handleSubmitExplanation = () => {
  addExplanationMutation.mutate({
    disputeId: dispute.id,
    data: { explanation: explanationText }
  });
};
```

## Error Handling

Both features include comprehensive error handling:
- Network errors
- Validation errors
- Authorization errors
- Server errors
- User-friendly error messages via toast notifications

## Performance Considerations

- Query invalidation ensures fresh data
- Loading states prevent duplicate submissions
- Optimistic updates where appropriate
- Proper caching strategies 