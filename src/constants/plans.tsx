import { CheckCircle, Star, Crown, Rocket, Sparkles } from "lucide-react"

export type PlanType = {
  [key: string]: {
    name: string
    icon?: React.ElementType
    description?: string
    gradientColor: string
    textColor: string
    monthly?: {
      price: number
      plan_id: string
    }
    yearly?: {
      price: number
      plan_id: string
    }
    features: string[]
  }
}

export const plans: PlanType = {
  Free: {
    name: "Free",
    icon: Sparkles,
    description: "Perfect for getting started",
    gradientColor: "from-green-600 via-teal-500 to-cyan-500",
    textColor: "text-emerald-400",
    features: [
      "Bookmark up to 50 tweets",
      "Basic direct messages",
      "Standard feed access",
      "Limited post length",
      "Community forums access",
    ],
  },
  Premium: {
    name: "Premium",
    icon: Crown,
    description: "For power users and businesses",
    gradientColor: "from-amber-600 via-red-500 to-orange-500",
    textColor: "text-amber-400",
    monthly: {
      price: 199.99,
      plan_id: "plan_QPyyFaN9DksA4x",
    },
    yearly: {
      price: 1799.88,
      plan_id: "plan_QPyyTARmEl6Dor",
    },
    features: [
      "All Basic features",
      "Unlimited post length",
      "Ad-free experience",
      "24/7 dedicated support",
      "Early access to new features",
    ],
  },
  Basic: {
    name: "Basic",
    icon: Rocket,
    description: "Great for regular users",
    gradientColor: "from-blue-600 via-purple-600 to-pink-600",
    textColor: "text-blue-400",
    monthly: {
      price: 99.99,
      plan_id: "plan_QPyxvsXxEkjcJ0",
    },
    yearly: {
      price: 899.88,
      plan_id: "plan_QPyxamJa49A66T",
    },
    features: [
      "Unlimited bookmarks",
      "Edit posts within 30 minutes",
      "Priority feed access",
      "Verified badge",
      "Ad-reduced experience",
    ],
  },
}

export const planIds = {
  
}

export const RAZORPAY_EVENTS = {
  SUBSCRIPTION_AUTHENTICATED: "subscription.authenticated",
  SUBSCRIPTION_ACTIVATED: "subscription.activated",
  SUBSCRIPTION_CHARGED: "subscription.charged",
  SUBSCRIPTION_HALTED: "subscription.halted",
  SUBSCRIPTION_CANCELLED: "subscription.cancelled",
  SUBSCRIPTION_COMPLETED: "subscription.completed",
  SUBSCRIPTION_PAUSED: "subscription.paused",
  SUBSCRIPTION_RESUMED: "subscription.resumed",
} as const;

export type RazorpayEvent = typeof RAZORPAY_EVENTS[keyof typeof RAZORPAY_EVENTS];
