# Frontend API Integration Guide

## Overview
This document outlines the complete API integration setup for the Xuthority frontend application, including authentication, state management, and social login functionality.

## Features Implemented

### ✅ Authentication System
- **Login/Logout**: Complete authentication flow with JWT tokens
- **User Registration**: Both regular user and vendor signup
- **Password Management**: Forgot password, reset password, change password
- **Social Login**: Google and LinkedIn OAuth integration
- **Token Management**: Automatic token refresh and storage
- **Profile Management**: Get and update user profile information

### ✅ State Management
- **Zustand Store**: Enhanced existing useUserStore with API integration
- **TanStack Query**: Server state management with caching
- **Loading States**: Proper loading indicators for all operations
- **Error Handling**: Comprehensive error handling with toast notifications

### ✅ API Infrastructure
- **Axios Instance**: Advanced HTTP client with interceptors
- **Request/Response Interceptors**: Automatic token injection and error handling
- **Base URL Configuration**: Environment-based API endpoints
- **Type Safety**: Full TypeScript support for API responses

### ✅ UI Components
- **Authentication Forms**: Login, signup, forgot password forms
- **Social Login Buttons**: Google and LinkedIn integration
- **Loading States**: Disabled states and loading indicators
- **Error Display**: Form validation and API error messages
- **SVG Assets**: Reusable icon components for social login

## File Structure

```
src/
├── assets/
│   └── svg/                    # SVG icon components
│       ├── GoogleIcon.tsx      # Google social login icon
│       ├── LinkedInIcon.tsx    # LinkedIn social login icon
│       ├── index.ts           # SVG exports
│       └── README.md          # SVG documentation
├── services/
│   ├── api.ts                 # Axios instance with interceptors
│   └── auth.ts                # Authentication API methods
├── store/
│   └── useUserStore.ts        # Enhanced Zustand store with API integration
├── hooks/
│   └── useAuth.ts             # TanStack Query auth hooks
├── features/auth/
│   ├── LoginForm.tsx          # Login form with social login
│   ├── UserSignupForm.tsx     # User registration form
│   ├── VendorSignupForm.tsx   # Vendor registration form
│   ├── ForgotPasswordForm.tsx # Password reset form
│   └── AuthModal.tsx          # Authentication modal
└── components/layout/
    └── Navbar.tsx             # Navigation with auth state
```

## Configuration

### Environment Variables
Create a `.env` file in the frontend root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1

# Social Login (Configure these with your OAuth providers)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_LINKEDIN_CLIENT_ID=your_linkedin_client_id

# Optional: Development settings
VITE_ENABLE_MOCK_API=false
VITE_API_TIMEOUT=10000
```

### Package Dependencies
```json
{
  "dependencies": {
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "react-query-devtools": "^5.0.0",
    "zustand": "^4.4.0",
    "react-hot-toast": "^2.4.0"
  }
}
```

## API Endpoints

### Authentication Endpoints
```typescript
// Login
POST /auth/login
Body: { email: string, password: string }

// User Registration
POST /auth/register
Body: { firstName, lastName, email, password, acceptedTerms, acceptedMarketing }

// Vendor Registration
POST /auth/register/vendor
Body: { firstName, lastName, email, password, companyName, companyEmail, industry, companySize, acceptedTerms, acceptedMarketing }

// Forgot Password
POST /auth/forgot-password
Body: { email: string }

// Reset Password
POST /auth/reset-password
Body: { token: string, newPassword: string, confirmNewPassword: string }

// Change Password
PUT /auth/change-password
Body: { currentPassword: string, newPassword: string }

// Get Profile
GET /auth/profile

// Update Profile
PUT /auth/profile
Body: { firstName, lastName, email, phone, avatar }

// Verify Token
GET /auth/verify

// Social Login Redirects
GET /auth/google
GET /auth/linkedin
```

## Data Flow

### 1. Authentication Flow
```
User Action → Form Validation → API Call → Store Update → UI Update
     ↓              ↓              ↓           ↓           ↓
  Login Form → Zod Schema → Auth Service → useUserStore → TanStack Query
```

### 2. Token Management
```
Request → Interceptor → Add Token → API → Response → Interceptor → Handle Errors
   ↓           ↓           ↓        ↓        ↓           ↓           ↓
Component → Axios → Token Check → Server → Success/Error → Toast → Store Update
```

### 3. Social Login Flow
```
Social Button → OAuth Redirect → Backend Callback → Token Exchange → Profile Fetch
     ↓              ↓                ↓               ↓              ↓
Google/LinkedIn → Provider → Backend OAuth → JWT Token → User Data → Store
```

## Component Updates

### LoginForm Component
- ✅ Integrated with `useLogin` and `useSocialLogin` hooks
- ✅ Loading states and error handling
- ✅ Social login buttons with SVG icons
- ✅ Form validation with Zod schema
- ✅ Automatic modal closing on success

### UserSignupForm Component
- ✅ Integrated with `useRegisterUser` hook
- ✅ Complete form validation
- ✅ Terms and conditions checkbox
- ✅ Social signup options
- ✅ Loading states and error display

### VendorSignupForm Component
- ✅ Integrated with `useRegisterVendor` hook
- ✅ Company and job title fields
- ✅ Vendor-specific validation
- ✅ Social signup integration
- ✅ Professional form layout

### Navbar Component
- ✅ Dynamic user state display
- ✅ Logout functionality
- ✅ Loading states for auth operations
- ✅ Conditional rendering based on auth status

## Custom Hooks

### useAuth Hooks
```typescript
// Login hook
const loginMutation = useLogin();
await loginMutation.mutateAsync({ email, password });

// Registration hooks
const registerUserMutation = useRegisterUser();
const registerVendorMutation = useRegisterVendor();

// Social login hooks
const { googleLogin, linkedInLogin } = useSocialLogin();

// Profile management
const { data: profile, isLoading } = useProfile();
const updateProfileMutation = useUpdateProfile();

// Password management
const forgotPasswordMutation = useForgotPassword();
const changePasswordMutation = useChangePassword();
```

### Hook Features
- ✅ Automatic error handling with toast notifications
- ✅ Loading states for all operations
- ✅ Optimistic updates where appropriate
- ✅ Automatic cache invalidation
- ✅ Retry logic for failed requests

## Enhanced useUserStore

### Backward Compatibility
The existing `useUserStore` has been enhanced with API integration while maintaining backward compatibility:

```typescript
// Original methods (still available)
const { user, isLoggedIn, login, logout, updateUser } = useUserStore();

// New API integration methods
const { 
  loginWithAPI, 
  registerUserWithAPI, 
  registerVendorWithAPI,
  logoutWithAPI,
  getProfileWithAPI,
  isLoading,
  error,
  clearError,
  initializeAuth 
} = useUserStore();
```

### API Integration Features
- ✅ Automatic token management
- ✅ User data mapping from API response
- ✅ Error handling and loading states
- ✅ Persistent storage with localStorage
- ✅ Automatic authentication initialization

## SVG Assets Structure

### Icon Components
```typescript
// GoogleIcon.tsx
interface GoogleIconProps {
  className?: string;
  size?: number;
}

// LinkedInIcon.tsx
interface LinkedInIconProps {
  className?: string;
  size?: number;
}
```

### Usage
```typescript
import { GoogleIcon, LinkedInIcon } from "@/assets/svg";

// Default usage
<GoogleIcon />

// Custom styling
<LinkedInIcon className="mr-3 h-6 w-6" size={24} />
```

### Benefits
- ✅ Reusable across components
- ✅ TypeScript support with props
- ✅ Consistent styling and sizing
- ✅ Easy to maintain and update
- ✅ Centralized icon management

## Security Features

### Token Management
- ✅ Secure token storage in localStorage
- ✅ Automatic token refresh on expiration
- ✅ Token verification on app startup
- ✅ Secure token removal on logout

### Request Security
- ✅ Automatic token injection in headers
- ✅ Request/response interceptors
- ✅ Error handling for unauthorized requests
- ✅ Automatic logout on token expiration

### Social Login Security
- ✅ OAuth 2.0 flow implementation
- ✅ Secure redirect handling
- ✅ Token exchange on backend
- ✅ Profile verification

## Usage Examples

### Basic Login
```typescript
import { useLogin } from "@/hooks/useAuth";

function LoginComponent() {
  const loginMutation = useLogin();
  
  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // Success - user is automatically logged in
    } catch (error) {
      // Error is handled by the hook
    }
  };
}
```

### Social Login
```typescript
import { useSocialLogin } from "@/hooks/useAuth";
import { GoogleIcon } from "@/assets/svg";

function SocialLoginButtons() {
  const { googleLogin, linkedInLogin } = useSocialLogin();
  
  return (
    <div>
      <button onClick={googleLogin}>
        <GoogleIcon />
        Continue with Google
      </button>
    </div>
  );
}
```

### Profile Management
```typescript
import { useProfile, useUpdateProfile } from "@/hooks/useAuth";

function ProfileComponent() {
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const handleUpdate = async (profileData) => {
    await updateProfileMutation.mutateAsync(profileData);
  };
}
```

## Development Setup

### 1. Install Dependencies
```bash
npm install axios @tanstack/react-query react-query-devtools zustand react-hot-toast
```

### 2. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Configure your API endpoints and OAuth credentials
```

### 3. Backend Integration
```bash
# Ensure backend is running on configured port
# Default: http://localhost:5000/api/v1
```

### 4. Social Login Setup
```bash
# Configure OAuth providers in your backend
# Update frontend environment variables with client IDs
```

## Testing

### Unit Tests
```bash
# Test authentication hooks
npm test useAuth

# Test API service
npm test services/api
```

### Integration Tests
```bash
# Test complete auth flow
npm test auth-flow

# Test social login
npm test social-login
```

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured for frontend domain
   - Check API base URL configuration

2. **Token Issues**
   - Verify token storage in localStorage
   - Check token refresh logic
   - Ensure backend token validation

3. **Social Login Problems**
   - Verify OAuth client IDs
   - Check redirect URI configuration
   - Ensure backend OAuth endpoints are working

4. **Loading States Not Working**
   - Check TanStack Query configuration
   - Verify mutation states are being used
   - Ensure proper error boundaries

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('debug', 'auth:*');

// Check network requests
// Open browser dev tools → Network tab
```

## Next Steps

### Planned Features
- [ ] Email verification flow
- [ ] Two-factor authentication
- [ ] Account deletion
- [ ] Session management
- [ ] Role-based access control
- [ ] Audit logging integration

### Performance Optimizations
- [ ] Request caching strategies
- [ ] Background token refresh
- [ ] Optimistic updates
- [ ] Request deduplication
- [ ] Error retry mechanisms

### Security Enhancements
- [ ] CSRF protection
- [ ] Rate limiting integration
- [ ] Security headers
- [ ] Input sanitization
- [ ] XSS prevention

---

This integration provides a robust, scalable authentication system with modern React patterns, comprehensive error handling, and excellent developer experience. The existing useUserStore has been enhanced with API integration while maintaining full backward compatibility. 