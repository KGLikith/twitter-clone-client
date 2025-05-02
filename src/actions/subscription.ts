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
  const sub = razorpay.subscriptions.cancel(subscriptionId, cancelOption);
  return sub;
};
