import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  UserIcon,
  MessageSquare,
  HeartIcon,
  BellIcon,
  LogOutIcon,
  Badge,
  ShoppingCart,
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

const ProfilePage: React.FC = () => {
  const { tab, subTab } = useParams<{ tab?: string, subTab?: string }>();
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
console.log('user', user)
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !user) {
    return <div>Error loading profile or user not authenticated</div>;
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
  const sidebarItems = user?.role === 'vendor'
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
    if (tabId === 'followers' || tabId === 'following' || tabId === 'products') {
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
        return user?.role === 'vendor' ? <ProfileDetailsFormVendor initialData={initialProfileVendorData} /> : <ProfileDetailsForm initialData={initialProfileData} />;
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
console.log(' activeTab',  activeTab)
  return (
    <>
      <ProfileLayout
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