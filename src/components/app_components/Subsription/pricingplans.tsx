"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle, Star, Crown, Rocket, Sparkles, Home } from 'lucide-react'
import { useRouter } from "next/navigation"
import { Plan, Subscription, User } from "@/gql/graphql"
import { plans } from "@/constants/plans"
import { useSession } from "next-auth/react"
import { checkSubscription, createSubscription } from "@/actions/subscription"
import { apolloClient } from "@/clients/api"
import { createSubscriptionMutation, updateSubscriptionMutation } from "@/graphql/mutation/user"
import { motion } from "framer-motion"
import { toast } from "sonner"
import Loader from "@/components/ui/loader"
import { useQueryClient } from "@tanstack/react-query"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
type BillingInterval = "year" | "month"

type Props = {
  subscription: Subscription
}

export default function PricingPlans({ subscription }: Props) {
  const [billingInterval, setBillingInterval] = useState<BillingInterval>("month")
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession();
  const user = subscription?.user || session?.user
  const [showUpgradePopup, setShowUpgradePopup] = useState(false)
  const [upgradeUrl, setUpgradeUrl] = useState("")
  const queryClient = useQueryClient();

  const handleSubscription = async (planName: string, planId: string, price: string) => {
    if (!session?.user) {
      router.push('/auth/sign-in')
      return
    }
    setLoading(true)
    toast.info("You will be redirected to Razorpay for payment", {
      duration: 2000
    })
    if (subscription?.planId === planId && subscription?.shortUrl) {
      window.open(subscription.shortUrl, "_blank")
      setLoading(false)
      router.refresh();
      return;
    }
    const sub = await createSubscription(planId, session.user.email || "" as string)
    if (!sub) {
      setLoading(false)
      toast.error("Something went wrong while creating subscription. Please try again.")
      return
    }

    const mutationsub = await apolloClient.mutate({
      mutation: createSubscriptionMutation,
      variables: {
        payload: {
          planId: planId,
          subscriptionId: sub.id,
          interval: billingInterval === "month" ? "MONTHLY" : "YEARLY",
          plan: planName === "Basic" ? ("BASIC" as Plan) : planName === "Premium" ? ("PREMIUM" as Plan) : ("FREE" as Plan),
          price: price,
          shortUrl: sub.short_url
        }
      }
    })

    if (!mutationsub.data?.createSubscription) {
      setLoading(false)
      toast.error("Something went wrong while creating subscription. Please try again.")
      return
    } else {
      window.open(sub.short_url, "_blank")
      setLoading(false)
      await apolloClient.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["subscription"] })
    }

  }

  const checkSubscriptionStatus = async () => {
    if (subscription && subscription.subscriptionId && subscription.shortUrl) {
      const sub = await checkSubscription(subscription.subscriptionId);
      if (sub) {
        if (sub.status === "active") {
          await apolloClient.mutate({
            mutation: updateSubscriptionMutation,
            variables: {
              payload: {
                subscriptionId: sub.id,
                customerId: sub.customer_id,
                active: true,
                planId: sub.plan_id,
                startDate: new Date((sub.current_start || 0) * 1000),
                endDate: new Date((sub.current_end || 0) * 1000),
              },
            },
          })
          await queryClient.invalidateQueries({ queryKey: ["subscription"] })
        } else {
          setUpgradeUrl(sub.short_url)
          setShowUpgradePopup(true)
        }
      }
    }
  }

  useEffect(() => {
    checkSubscriptionStatus();
  }, [subscription])

  return (
    <section
      id="pricing"
      className="bg-gradient-to-br from-gray-900 to-black min-h-[90vh]  flex flex-col items-center justify-center px-4 py-8"
    >
      <Loader state={loading}>
        <div className="fixed top-4 left-4 z-10">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => router.push("/")}>
            <Home className="h-5 w-5" />
            <span className="sr-only">Home</span>
          </Button>
        </div>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto mb-2 text-center"
        >
          {user && <div className="flex items-center justify-center gap-3 mb-2">
            (<motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              <Avatar className="h-10 w-10 border-2 border-zinc-700 rounded-full overflow-hidden">
                <AvatarImage
                  src={user?.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${user?.profileImageUrl}` : "/user.png"}
                  alt="Profile"
                  className="object-cover"
                />
              </Avatar>
            </motion.div>)
            <motion.h1
              className="text-2xl font-bold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Hello ,{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {user?.name}
              </span>
              !
            </motion.h1>
          </div>}
        </motion.div>

        <motion.div
          className="text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r  via-amber-400 bg-clip-text text-transparent sm:text-5xl mb-2">
              Pricing Plans
            </h1>
            <p className="text-sm text-white/90">Choose the perfect plan for your needs</p>
          </div>
        </motion.div>

        <div className="relative flex bg-white/10 backdrop-blur-sm rounded-full p-1 mb-10">
          <button
            onClick={() => setBillingInterval("month")}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-full transition-all duration-200",
              billingInterval === "month" ? "bg-white text-black shadow" : "text-white",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval("year")}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-full transition-all duration-200",
              billingInterval === "year" ? "bg-white text-black shadow" : "text-white",
            )}
          >
            Yearly
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6 w-full max-w-5xl px-2">
          {Object.entries(plans).map(([key, plan], index) => {
            const Icon = plan.icon || Star

            const isFree = !plan.monthly
            const price = isFree ? 0 : billingInterval === "month" ? plan.monthly?.price : plan.yearly?.price

            const planId = isFree ? "" : billingInterval === "month" ? plan.monthly?.plan_id : plan.yearly?.plan_id

            let savings = 0
            let monthlyEquivalent = 0

            if (!isFree && billingInterval === "year") {
              const yearlyPrice = plan.yearly?.price || 0
              const monthlyPrice = plan.monthly?.price || 0
              const yearlyEquivalent = monthlyPrice * 12
              savings = yearlyEquivalent - yearlyPrice
              monthlyEquivalent = yearlyPrice / 12
            }

            const formattedPrice = isFree
              ? "Free"
              : new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "INR",
                minimumFractionDigits: 0,
              }).format(price || 0)

            const isPremium = key === "Premium"

            return (
              <div
                key={key}
                className={cn(
                  "w-full sm:max-w-sm transition-all group border border-black hover:border-transparent bg-black rounded-2xl hover:bg-gradient-to-r p-[2px]",
                  `hover:${plan.gradientColor}`,
                  isPremium ? "md:scale-110 z-10" : "",
                )}
              >
                <div className="bg-black text-white rounded-[calc(1rem-2px)] p-6 transition-all   group-hover:scale-[1.005] ">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={cn("w-6 h-6", plan.textColor)} />
                    <h2 className="text-xl font-bold">{plan.name}</h2>
                  </div>
                  <p className="text-sm text-white/80 mb-4">{plan.description || "Get started with our service"}</p>

                  {isFree ? (
                    <p className={cn("text-3xl font-bold", plan.textColor)}>Free</p>
                  ) : billingInterval === "year" ? (
                    <>
                      <p className={cn("text-3xl font-bold", plan.textColor)}>
                        ₹{monthlyEquivalent.toFixed(2)}
                        <span className="text-base font-medium"> /month</span>
                      </p>
                      <p className="text-sm text-white/70 mt-1">₹{plan.yearly?.price} billed annually</p>
                      {savings > 0 && (
                        <p className={`text-xs mt-1 ${plan.textColor}`}>
                          You save ₹{savings.toFixed(2)} a year
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className={cn("text-3xl font-bold", plan.textColor || "text-blue-400")}>
                        {formattedPrice}
                        <span className="text-base font-medium"> /month</span>
                      </p>
                      <p className="text-sm text-white/70 mt-1">Billed monthly</p>
                    </>
                  )}

                  <ul className="mt-4 mb-6 text-sm space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-white/80">
                        <CheckCircle className={cn("w-4 h-4", plan.textColor || "text-blue-400")} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full bg-white text-black hover:bg-white/90"
                    onClick={async () => {
                      if (!session?.user) {
                        router.push('/auth/sign-in')
                        return
                      }

                      if (isFree) {
                        router.push('/')
                      }
                      if (!isFree && planId) {
                        await handleSubscription(plan.name, planId, String(price))
                      }
                    }}
                  >
                    {subscription?.shortUrl && !subscription.active && subscription.planId === planId
                      ? "Complete Subscription"
                      : isFree
                        ? "Get Started"
                        : "Subscribe Now"}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
        {showUpgradePopup && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-bold text-white mb-2">Subscription Inactive</h3>
              <p className="text-white/80 mb-4">
                Your subscription is inactive. Please press continue to go with the previous plan you selected.
              </p>

              <div className="bg-blue-900/30 text-blue-300 text-sm rounded-md px-3 py-2 mb-4 border border-blue-500/50">
                ℹ️ If you’ve already completed the payment, please wait a moment — your subscription status will update shortly.
                Or refresh the page to check your subscription status.
              </div>

              <div className="flex gap-3">
                <Button
                  className="bg-white hover:opacity-90"
                  onClick={() => {
                    if (upgradeUrl) {
                      window.open(upgradeUrl, "_blank")
                    }
                  }}
                >
                  Continue
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                  onClick={() => setShowUpgradePopup(false)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>

        )}
      </Loader>
    </section>
  )
}
