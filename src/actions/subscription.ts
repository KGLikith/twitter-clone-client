"use server";

import { razorpay } from "@/clients/razorpay";

export const createSubscription = async (planId: string, email: string) => {
  const sub = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: 12,
    customer_notify: 0,
    notify_info: {
      notify_email: email,
    },
  });

  return sub
};

export const cancelSubscription = async (subscriptionId: string, cancelOption: number) => {
  try{
    const sub = razorpay.subscriptions.cancel(subscriptionId, cancelOption);
  
    return {
      error: false
    };

  }catch (err: any) {
    console.error("Razorpay Error:", err);
  
    if (err.statusCode === 400 && err.error?.description === "Subscription is not cancellable in cancelled status.") {
      return ({ error: true,alreadyCancelled: true });
    }
  
    return ({ error: true,message: "Failed to cancel subscription" });
  }
  
};

export const checkSubscription = async (subscriptionId: string) => {
  try {
    const sub = await razorpay.subscriptions.fetch(subscriptionId);
    return sub;
  } catch (err: any) {
    console.error("Razorpay Error:", err);
    return null;
  }
}