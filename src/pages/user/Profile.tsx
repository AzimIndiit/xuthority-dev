import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  MessageSquare,
  HeartIcon,
  BellIcon,
  LogOutIcon,
  Badge,
  HelpCircle,
  Grid,
  CreditCard,
} from 'lucide-react';
import ProfileLayout from '@/components/layout/ProfileLayout';
import ProfileDetailsForm, {
  ProfileFormData,
} from '@/components/user/ProfileDetailsForm';
import { useProfile, useLogout } from '@/hooks/useAuth';
import { getUserDisplayName, getUserInitials } from '@/utils/userHelpers';
import ProfileDetailsFormVendor, { ProfileVendorFormData } from '@/components/user/ProfileDetailsFormVendor';
import FollowersFollowing from '@/components/user/FollowersFollowing';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import ProductsPage from './ProductsPage';
import AddProductPage from './AddProductPage';
import EditProductPage from './EditProductPage';
import MyReviews from '@/components/user/MyReviews';
import MyFavorites from '@/components/user/MyFavorites';
import { NotificationsList } from '@/components/notifications';
import UserDisputes from './UserDisputes';
import MyBadgesPage from './MyBadgesPage';
import MySubscriptionPage from './MySubscriptionPage';
import useUserStore from '@/store/useUserStore';

// Skeleton component for the profile sidebar
const ProfileSidebarSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    {/* Profile Header Skeleton */}
    <div className="flex flex-col items-center mb-6">
      <div className="w-20 h-20 bg-gray-300 rounded-full mb-4"></div>
      <div className="h-6 bg-gray-300 rounded w-32 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-24 mb-4"></div>
      <div className="flex space-x-4">
        <div className="text-center">
          <div className="h-6 bg-gray-300 rounded w-8 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
        <div className="text-center">
          <div className="h-6 bg-gray-300 rounded w-8 mb-1"></div>
          <div className="h-4 bg-gray-300 rounded w-12"></div>
        </div>
      </div>
    </div>

    {/* Navigation Menu Skeleton */}
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg">
          <div className="w-5 h-5 bg-gray-300 rounded"></div>
          <div className="h-4 bg-gray-300 rounded flex-1"></div>
        </div>
      ))}
    </div>
  </div>
);

// Skeleton component for the main content area
const ProfileContentSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
    {/* Content Header Skeleton */}
    <div className="mb-6">
      <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
    </div>

    {/* Form-like Content Skeleton */}
    <div className="space-y-6">
      {/* Section 1 */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded w-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 rounded w-40"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-12 bg-gray-300 rounded"></div>
          <div className="h-12 bg-gray-300 rounded"></div>
        </div>
        <div className="h-24 bg-gray-300 rounded"></div>
      </div>

      {/* Action Buttons Skeleton */}
      <div className="flex justify-end space-x-4 pt-6">
        <div className="h-10 bg-gray-300 rounded w-24"></div>
        <div className="h-10 bg-gray-300 rounded w-32"></div>
      </div>
    </div>
  </div>
);

// Complete profile page skeleton
const ProfilePageSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="w-full lg:max-w-screen-xl mx-auto px-4 lg:px-6 py-4 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-4">
        {/* Left Sidebar Skeleton */}
        <div className="lg:col-span-1 hidden lg:block">
          <ProfileSidebarSkeleton />
        </div>

        {/* Right Content Skeleton */}
        <div className="col-span-4 lg:col-span-3 lg:px-8">
          <ProfileContentSkeleton />
        </div>
      </div>
    </div>
  </div>
);

const ProfilePage: React.FC = () => {
  const { tab, subTab } = useParams<{ tab?: string, subTab?: string }>();
  const  {user:loggedInUser} = useUserStore()
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Initialize activeTab based on URL parameter
  const getInitialTab = () => {
    if (tab && tab !== 'profile-details') {
      return tab;
    }
   
    return 'profile-details';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [followTab, setFollowTab] = useState<'followers' | 'following'>(
    tab === 'following' ? 'following' : 'followers'
  );
  
  // Update activeTab when URL parameter changes
  useEffect(() => {
    const newTab = getInitialTab();
    setActiveTab(newTab);
    if (tab === 'followers' || tab === 'following') {
      setFollowTab(tab);
    }
  }, [tab, subTab]);

  // Use the useProfile hook to trigger React Query
  const { data: user, isLoading, error } = useProfile();

  // Validate tab and subTab parameters and redirect if invalid
  useEffect(() => {
    if (!user || !tab) return; // Only validate if user is loaded and tab exists

    const validTabs = user.role === 'vendor' 
      ? ['profile-details', 'products', 'my-subscription', 'dispute-management', 'my-badges', 'notifications', 'logout', 'followers', 'following']
      : ['profile-details', 'my-reviews', 'my-favourites', 'notifications', 'logout', 'followers', 'following'];

    // Check if tab is valid for the user's role
    if (!validTabs.includes(tab)) {
      navigate('/', { replace: true });
      return;
    }

    // Validate subTab if it exists
    if (subTab) {
      const validSubTabs: { [key: string]: string[] } = {
        'products': ['add-product', 'edit-product']
      };

      if (validSubTabs[tab] && !validSubTabs[tab].includes(subTab)) {
        navigate('/', { replace: true });
        return;
      }

      // If subTab exists but the tab doesn't support subTabs, redirect
      if (!validSubTabs[tab]) {
        navigate('/', { replace: true });
        return;
      }
    }
  }, [user, tab, subTab, navigate]);

  // Show comprehensive skeleton while loading
  if (isLoading) {
    return <ProfilePageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h3>
          <p className="text-gray-600">Unable to load profile or user not authenticated</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
          <p className="text-gray-600">The user profile could not be found</p>
        </div>
      </div>
    );
  }

  const userForProfile = {
    ...user,
    initials: getUserInitials(user),
  };

  const initialProfileData: ProfileFormData = {
    avatar: user?.avatar || '',
    companyAvatar: user?.companyAvatar || '',
    displayName: getUserDisplayName(user) || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    region: user?.region || '',
    description: user?.description || '',
    companyName: user?.companyName || '',
    companySize: user?.companySize || '',
    industry: user?.industry || '',
    title: user?.title || '',
    linkedinUrl: user?.socialLinks?.linkedin || '',
    twitterUrl: user?.socialLinks?.twitter || '',
  };

  const initialProfileVendorData: ProfileVendorFormData = {
    avatar: user?.avatar || '',
    companyAvatar: user?.companyAvatar || '',
    displayName: getUserDisplayName(user) || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    region: user?.region || '',
    description: user?.description || '',
    industry: user?.industry || '',
    companyName: user?.companyName || '',
    companyEmail: user?.companyEmail || '',
    companySize: user?.companySize || '',
    yearFounded: user?.yearFounded || '',
    hqLocation: user?.hqLocation || '',
    companyDescription: user?.companyDescription || '',
    linkedinUrl: user?.socialLinks?.linkedin || '',
    twitterUrl: user?.socialLinks?.twitter || '',
    companyWebsiteUrl: user?.companyWebsiteUrl || '',
  };

  // Sidebar items based on user role (no hooks inside)
  const sidebarItems = loggedInUser?.role === 'vendor'
    ? [
      {
        id: 'profile-details',
        label: 'Profile Details',
        icon: <UserIcon className="w-5 h-5" />,
      },
        {
          id: 'products',
          label: 'Products',
          icon: <Grid className="w-5 h-5" />,
         
        },
        {
          id: 'my-subscription',
          label: 'My Subscription',
          icon: <CreditCard className="w-5 h-5" />,
        },
        {
          id: 'dispute-management',
          label: 'Dispute Management',
          icon: <HelpCircle className="w-5 h-5" />,
        },
        {
          id: 'my-badges',
          label: 'My Badges',
          icon: <Badge className="w-5 h-5" />,
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <BellIcon className="w-5 h-5" />,
        },
        {
          id: 'logout',
          label: 'Logout',
          icon: <LogOutIcon className="w-5 h-5" />,
        },
      ]
    : [
        {
          id: 'profile-details',
          label: 'Profile Details',
          icon: <UserIcon className="w-5 h-5" />,
        },
        {
          id: 'my-reviews',
          label: 'My Reviews',
          icon: <MessageSquare className="w-5 h-5" />,
        },
        {
          id: 'my-favourites',
          label: 'My Favourites',
          icon: <HeartIcon className="w-5 h-5" />,
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: <BellIcon className="w-5 h-5" />,
        },
        {
          id: 'logout',
          label: 'Logout',
          icon: <LogOutIcon className="w-5 h-5" />,
        },
      ];

  // Dynamic breadcrumb based on active tab and subTab
  const getBreadcrumb = () => {
    if (activeTab === 'followers') {
      return {
        home: 'Home',
        current: 'Profile / Followers',
      };
    }
    if (activeTab === 'following') {
      return {
        home: 'Home',
        current: 'Profile / Following',
      };
    }
    if (activeTab === 'products') {
      if (subTab === 'add-product') {
        return {
          home: 'Home',
          current: 'Profile / Products / Add Product',
        };
      }
      return {
        home: 'Home',
        current: 'Profile / Products',
      };
    }

    if (activeTab === 'dispute-management') {
 
      return {
        home: 'Home',
        current: 'Profile / Dispute Management',
      };
    }
    if (activeTab === 'my-badges') {
      return {
        home: 'Home',
        current: 'Profile / My Badges',
      };
    }
    if (activeTab === 'my-subscription') {
      return {
        home: 'Home',
        current: 'Profile / My Subscription',
      };
    }
    return {
      home: 'Home',
      current: 'My Profile',
    };
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    await logoutMutation.mutateAsync();
    // Optionally, redirect or clear state here if needed
  };

  const handleTabChange = (tabId: string) => {
    console.log('tabId', tabId)
    if (tabId === 'logout') {
      setShowLogoutModal(true);
      return;
    }
    setActiveTab(tabId);
    // Update URL when tab changes
    if (tabId) {
      navigate(`/profile/${tabId}`);
    } else {
      navigate(`/profile`);
    }
  };

  const handleFollowersClick = () => {
    navigate('/profile/followers');
  };

  const handleFollowingClick = () => {
    navigate('/profile/following');
  };

  const renderContent = () => {
    // Handle subTab routing for products
    if (activeTab === 'products' && subTab === 'add-product') {
      return <AddProductPage />;
    }
    if (activeTab === 'products' && subTab === 'edit-product') {
      return <EditProductPage  />;
    }

    switch (activeTab) {
      case 'profile-details':
        return user?.role === 'vendor' ? <ProfileDetailsFormVendor isLoading={isLoading} initialData={initialProfileVendorData} /> : <ProfileDetailsForm isLoading={isLoading} initialData={initialProfileData} />;
      case 'followers':
        return (
          <FollowersFollowing
            userId={user._id}
            currentUserId={user._id}
            activeTab="followers"
            onTabChange={(tab) => {
              setFollowTab(tab);
              if (tab === 'following') {
                setActiveTab('following');
              }
            }}
            showRemoveButton={true} // Current user can remove their followers
            className="shadow-sm"
          />
        );
      case 'following':
        return (
          <FollowersFollowing
            userId={user._id}
            currentUserId={user._id}
            activeTab="following"
            onTabChange={(tab) => {
              setFollowTab(tab);
              if (tab === 'followers') {
                setActiveTab('followers');
              }
            }}
            showRemoveButton={false} // Can't remove people you're following from this view
            className="shadow-sm"
          />
        );
      case 'products':
        return <ProductsPage />;  
      case 'my-reviews':
        return <MyReviews />;
      case 'my-favourites':
        return <MyFavorites />;
      case 'my-badges':
        return <MyBadgesPage />;
      case 'my-subscription':
        return <MySubscriptionPage />;
      case 'notifications':
        return <NotificationsList />;
      case 'dispute-management':
        return <UserDisputes />;

      // Placeholder for other tabs
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 ">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {sidebarItems.find(item => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">Content for {activeTab} will be implemented here.</p>
          </div>
        );
    }
  };
  return (
    <>
      <ProfileLayout isLoading={isLoading}
        user={userForProfile}
        sidebarItems={sidebarItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        breadcrumb={getBreadcrumb()}
        onFollowersClick={handleFollowersClick}
        onFollowingClick={handleFollowingClick}
      >
        
        {renderContent()}
      </ProfileLayout>
      <ConfirmationModal
        isOpen={showLogoutModal}
        onOpenChange={setShowLogoutModal}
        onConfirm={handleLogoutConfirm}
        title="Logout?"
        description="Are you sure, You want to logout?"
        confirmText={logoutMutation.isPending ? "Logging out..." : "Yes I'm Sure"}
        cancelText="Cancel"
        confirmVariant="default"
      />
    </>
  );
};

export default ProfilePage;