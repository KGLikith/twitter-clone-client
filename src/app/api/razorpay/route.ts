import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { RAZORPAY_EVENTS } from "@/constants/plans";
import { createServerApolloClient } from "@/clients/serverAppoloClient";
import { updateSubscriptionMutation } from "@/graphql/mutation/user";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");

  if (!signature) {
    console.warn("[Webhook] ❌ Missing signature");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.warn("[Webhook] ❌ Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const type = event.event as string;
  const payload = event.payload;

  const subscriptionId = payload?.subscription?.entity?.id;
  const customerId = payload?.subscription?.entity?.customer_id;
  const active = payload?.subscription?.entity?.status === "active";
  const sd = (payload?.subscription?.entity?.current_start || 0) * 1000;
  const startDate = new Date(sd);
  const ed = (payload?.subscription?.entity?.current_end || 0) * 1000;
  const endDate = new Date(ed);
  const planId = payload?.subscription?.entity?.plan_id;
  // const planName = planIds

  const client = createServerApolloClient();

  try {
    switch (type) {
      case RAZORPAY_EVENTS.SUBSCRIPTION_AUTHENTICATED:
        console.log("[Webhook] 🔑 Subscription Authenticated", {
          id: subscriptionId,
          customerId: customerId,
          active: active,
          planId: planId,
        });

        await client.mutate({
          mutation: updateSubscriptionMutation,
          variables: {
            payload: {
              subscriptionId: subscriptionId,
              customerId: customerId,
              active: active,
              planId: planId,
              startDate: startDate,
              endDate: endDate,
            },
          },
        });

        break;

      case RAZORPAY_EVENTS.SUBSCRIPTION_ACTIVATED:
        const amt = payload.payment.entity.amount / 100;
        console.log("[Webhook] ✅ Subscription Activated", {
          id: subscriptionId,
          customerId: customerId,
          active: active,
          planId: planId,
          amount: amt,
        });

        await client.mutate({
          mutation: updateSubscriptionMutation,
          variables: {
            payload: {
              subscriptionId: subscriptionId,
              customerId: customerId,
              active: active,
              planId: planId,
              startDate: startDate,
              endDate: endDate,
            },
          },
        });

        break;

      case RAZORPAY_EVENTS.SUBSCRIPTION_CHARGED:
        await client.mutate({
          mutation: updateSubscriptionMutation,
          variables: {
            payload: {
              subscriptionId: subscriptionId,
              customerId: customerId,
              active: active,
              planId: planId,
              startDate: startDate,
              endDate: endDate,
            },
          },
        });
        break;

      case RAZORPAY_EVENTS.SUBSCRIPTION_COMPLETED:
        console.log("[Webhook] ✅ Subscription Completed", {
          id: payload.subscription.entity.id,
          total_count: payload.subscription.entity.total_count,
          status: payload.subscription.entity.status,
          startDate: startDate,
          endDate: endDate,
        });
        break;

      default:
        console.warn("[Webhook] ⚠️ Unhandled event type:", type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Webhook] ❗ Error handling event:", error);
    return NextResponse.json(
      { error: "Webhook handler error" },
      { status: 500 }
    );
  }
}
