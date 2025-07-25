import { User } from "@/services/auth";

/**
 * Get user display name from user object
 * @param user - User object
 * @returns Display name (firstName + lastName) or email as fallback
 */
export const getUserDisplayName = (user: User | null): string => {
  if (!user) return '';
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
};

/**
 * Get user initials for avatar fallback
 * @param user - User object
 * @returns User initials (first letter of firstName + first letter of lastName)
 */
export const getUserInitials = (user: User | null): string => {
  if (!user) return '';
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
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