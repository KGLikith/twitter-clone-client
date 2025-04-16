import {
  UserPlus,
  UserPlus2,
  Heart,
  HeartOff,
  MessageCircle,
  MessageSquare,
  Bell,
  BellOff
} from "lucide-react";

export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "FOLLOW":
      return (
        <div className="group transition-colors duration-150">
          <UserPlus
            size={20}
            className="text-blue-600 dark:text-blue-400 group-hover:text-blue-400 dark:group-hover:text-blue-300"
            fill="currentColor"
          />
        </div>
      );

    case "LIKE":
      return (
        <div className="group transition-colors duration-150">
          <Heart
            size={20}
            className="text-pink-600 dark:text-pink-400 group-hover:text-pink-400 dark:group-hover:text-pink-300"
            fill="currentColor"
          />
        </div>
      );

    case "COMMENT":
      return (
        <div className="group transition-colors duration-150">
          <MessageCircle
            size={20}
            className="text-green-600 dark:text-green-400 group-hover:text-green-400 dark:group-hover:text-green-300"
            fill="currentColor"
          />
        </div>
      );

    case "LIKE_COMMENT":
      return (
        <div className="group transition-colors duration-150">
          <Heart
            size={20}
            className="text-purple-600 dark:text-purple-400 group-hover:text-purple-400 dark:group-hover:text-purple-300"
            fill="currentColor"
          />
        </div>
      );

    default:
      return (
        <div className="group transition-colors duration-150">
          <Bell
            size={20}
            className="text-gray-500 dark:text-gray-400 group-hover:text-gray-400 dark:group-hover:text-gray-300"
            fill="currentColor"
          />
        </div>
      );
  }
};
