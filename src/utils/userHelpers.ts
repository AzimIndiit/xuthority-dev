import { User } from "@/services/auth";

/**
 * Get user display name from user object
 * @param user - User object
 * @returns Display name (firstName + lastName) or email as fallback
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  
  // Handle case where user has firstName and lastName
  if (user.firstName || user.lastName) {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || '';
  }
  
  // Handle case where user only has name property
  if ((user as any).name) {
    return (user as any).name;
  }
  
  return user.email || '';
};

/**
 * Get user initials for avatar fallback
 * @param user - User object
 * @returns User initials (first letter of firstName + first letter of lastName)
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return '';
  
  // Handle case where user has firstName and lastName
  if (user.firstName || user.lastName) {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    return initials || 'U'; // Return 'U' if no initials
  }
  
  // Handle case where user only has name property
  if ((user as any).name) {
    const nameParts = (user as any).name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    return nameParts[0].charAt(0).toUpperCase() || 'U';
  }
  
  // Fallback to email initial or 'U'
  return user.email?.charAt(0).toUpperCase() || 'U';
};

/**
 * Get truncated display name for UI display
 * @param user - User object
 * @param maxLength - Maximum length before truncation
 * @returns Truncated display name with ellipsis if needed
 */
export const getTruncatedDisplayName = (user: User | null, maxLength: number = 20): string => {
  const displayName = getUserDisplayName(user);
  if (displayName.length > maxLength) {
    return `${displayName.substring(0, maxLength)}...`;
  }
  return displayName;
}; 

export const getFirstName = (user: User | null): string => {
  const displayName = getUserDisplayName(user);
  return displayName.split(' ')[0];
}; 