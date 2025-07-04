import { 
  Bell, 
  User, 
  Key, 
  Star, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  UserPlus,
  Award,
  ShieldCheck,
  PartyPopper,
  FileText,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { NotificationType, NotificationIconConfig } from '../types/notification';

// Map notification types to icons and colors
export const getNotificationIcon = (type: NotificationType): NotificationIconConfig => {
  const iconConfigs: Record<NotificationType, NotificationIconConfig> = {
    WELCOME: {
      icon: PartyPopper.name,
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      iconColor: 'text-purple-600',
    },
    PROFILE_UPDATE: {
      icon: User.name,
      bgColor: 'bg-gradient-to-br from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600',
    },
    PASSWORD_CHANGE: {
      icon: Key.name,
      bgColor: 'bg-gradient-to-br from-orange-100 to-yellow-100',
      iconColor: 'text-orange-600',
    },
    PRODUCT_REVIEW: {
      icon: Star.name,
      bgColor: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      iconColor: 'text-yellow-600',
    },
    REVIEW_DISPUTE: {
      icon: AlertTriangle.name,
      bgColor: 'bg-gradient-to-br from-red-100 to-orange-100',
      iconColor: 'text-red-600',
    },
    DISPUTE_STATUS_UPDATE: {
      icon: AlertCircle.name,
      bgColor: 'bg-gradient-to-br from-amber-100 to-orange-100',
      iconColor: 'text-amber-600',
    },
    PROFILE_VERIFIED: {
      icon: ShieldCheck.name,
      bgColor: 'bg-gradient-to-br from-green-100 to-emerald-100',
      iconColor: 'text-green-600',
    },
    FOLLOW: {
      icon: UserPlus.name,
      bgColor: 'bg-gradient-to-br from-blue-100 to-indigo-100',
      iconColor: 'text-blue-600',
    },
    BADGE_REQUEST: {
      icon: Award.name,
      bgColor: 'bg-gradient-to-br from-purple-100 to-blue-100',
      iconColor: 'text-purple-600',
    },
    BADGE_STATUS: {
      icon: Award.name,
      bgColor: 'bg-gradient-to-br from-emerald-100 to-teal-100',
      iconColor: 'text-emerald-600',
    },
    DISPUTE_EXPLANATION: {
      icon: MessageCircle.name,
      bgColor: 'bg-gradient-to-br from-gray-100 to-slate-100',
      iconColor: 'text-gray-600',
    },
    DISPUTE_EXPLANATION_UPDATE: {
      icon: FileText.name,
      bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-100',
      iconColor: 'text-indigo-600',
    },
  };

  return iconConfigs[type] || {
    icon: Bell.name,
    bgColor: 'bg-gradient-to-br from-gray-100 to-slate-100',
    iconColor: 'text-gray-600',
  };
};

// Get the actual icon component
export const getNotificationIconComponent = (type: NotificationType) => {
  const iconMap: Record<NotificationType, React.ComponentType<any>> = {
    WELCOME: PartyPopper,
    PROFILE_UPDATE: User,
    PASSWORD_CHANGE: Key,
    PRODUCT_REVIEW: Star,
    REVIEW_DISPUTE: AlertTriangle,
    DISPUTE_STATUS_UPDATE: AlertCircle,
    PROFILE_VERIFIED: ShieldCheck,
    FOLLOW: UserPlus,
    BADGE_REQUEST: Award,
    BADGE_STATUS: Award,
    DISPUTE_EXPLANATION: MessageCircle,
    DISPUTE_EXPLANATION_UPDATE: FileText,
  };

  return iconMap[type] || Bell;
}; 