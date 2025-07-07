# Popular Software Implementation

## Overview
This document describes the implementation of the popular software feature that displays popular software categories with their top 4 products based on ratings and total reviews.

## Backend Changes

### 1. Database Schema Update
- Added `isPopular` field to the Software model (`src/models/Software.js`)
- Default value is `false`
- This flag determines which software categories are considered "popular"

### 2. New API Endpoint
- **Endpoint**: `GET /api/v1/software/popular-with-products`
- **Controller**: `softwareController.getPopularSoftwaresWithTopProducts`
- **Service**: `softwareService.getPopularSoftwaresWithTopProducts`

#### Query Parameters:
- `page` (default: 1) - Page number
- `limit` (default: 10) - Number of software categories per page
- `productsPerSoftware` (default: 4) - Number of top products per software
- `minRating` (default: 0) - Minimum rating filter for products
- `sortBy` (default: 'totalReviews') - Sort field (totalReviews, avgRating, productCount, name)
- `sortOrder` (default: 'desc') - Sort order (asc, desc)

### 3. Service Logic
The `getPopularSoftwaresWithTopProducts` method:
1. Fetches all active software with `isPopular: true`
2. For each software, fetches top 4 products sorted by:
   - Average rating (descending)
   - Total reviews (descending)
3. Calculates aggregate metrics for each software:
   - Average rating across all top products
   - Total reviews across all top products
4. Returns paginated results with metadata

## Frontend Changes

### 1. New Hook: `usePopularSoftwares`
Located in `src/hooks/useFeaturedSoftwares.ts`

```typescript
const { popularSoftwares, isLoading, error, hasData } = usePopularSoftwares({
  limit: 12,
  productsPerSoftware: 4,
  minRating: 3.0,
  sortBy: 'totalReviews',
  sortOrder: 'desc'
});
```

### 2. Updated Service
- Added `getPopularSoftwaresWithProducts` method to `SoftwareService`
- Updated `getFeaturedSoftwares` to support endpoint parameter
- Added types for popular software response

### 3. Updated Component
The `PopularSoftwareSection` component now:
- Uses `usePopularSoftwares` hook instead of `useFeaturedSoftwares`
- Fetches top 4 products per popular software category
- Displays products sorted by rating and review count
- Shows loading skeleton during data fetch
- Handles error states gracefully

## Migration Script

### Running the Migration
```bash
cd xuthority-dev-backend
node scripts/add-popular-flag-to-software.js
```

The script:
1. Connects to MongoDB
2. Sets all software to `isPopular: false`
3. Updates specific software categories to `isPopular: true`
4. Shows statistics after migration

### Popular Software Categories
The following categories are marked as popular by default:
- Project Management
- Video Conferencing
- E-Commerce Platforms
- Marketing Automation
- Accounting
- Expense Management
- CRM Tools
- Online Backup
- AI Chatbots
- Social Media Analytics

## Testing

### Backend Testing
```bash
# Test the popular software endpoint
curl http://localhost:5000/api/v1/software/popular-with-products?productsPerSoftware=4&minRating=3
```

### Frontend Testing
1. Navigate to the home page
2. Scroll to the "Popular Software Categories" section
3. Verify that:
   - Popular software categories are displayed
   - Each category shows up to 4 top-rated products
   - Products display ratings and review counts
   - Accordion functionality works correctly

## Future Enhancements
1. Admin interface to manage popular software flags
2. Analytics to automatically determine popular categories
3. Personalization based on user preferences
4. A/B testing for different sorting algorithms 