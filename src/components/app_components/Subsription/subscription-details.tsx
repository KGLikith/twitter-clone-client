"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { CalendarDays, CheckCircle, Crown, ArrowUpRight, CheckIcon, XCircle, Home, AlertTriangle } from "lucide-react"
import { Plan, type Subscription } from "@/gql/graphql"
import { plans } from "@/constants/plans"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cancelSubscription, createSubscription } from "@/actions/subscription"
import { apolloClient } from "@/clients/api"
import { cancelSubscriptionMutation, createSubscriptionMutation } from "@/graphql/mutation/user"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import Image from "next/image"
import { motion } from "framer-motion"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import Loader from "@/components/ui/loader"

type BillingInterval = "month" | "year"
type CancelOption = "now" | "end-of-cycle"

type Props = {
  subscription: Subscription
}

export default function SubscriptionDetailsCard({ subscription }: Props) {
  const [cancelOption, setCancelOption] = useState<CancelOption>(subscription.autorenew ? "end-of-cycle" : "now")
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [billingInterval, setBillingInterval] = useState<BillingInterval>(
    subscription?.interval == "MONTH" ? "month" : "year",
  )
  const [loading, setLoading] = useState(false)
  const queryclient = useQueryClient();
  const router = useRouter()
  const { data: session } = useSession()

  if (!subscription || subscription.plan === Plan.Free) {
    router.push('/')
    return null
  }

  const planKey = subscription.plan === Plan.Basic ? "Basic" : "Premium"
  const planDetails = plans[planKey]
  const premiumPlan = plans.Premium
  const Icon = planDetails.icon || Crown
  const user = subscription.user

  const startDate = subscription.startDate ? new Date(subscription.startDate) : new Date()
  const endDate = subscription.endDate ? new Date(subscription.endDate) : new Date()
  const today = new Date()

  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
  const progressPercentage =100 - Math.min(Math.max(((daysElapsed) / totalDays) * 100, 0), 100)
  const daysRemaining = totalDays - daysElapsed

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleUpgrade = async () => {
    if (!session?.user) {
      router.push("/auth/sign-in")
      return
    }
    setLoading(true)
    toast.info("You will be redirected to Razorpay for payment", {
      duration: 2000
    })

    const planId = billingInterval === "month" ? premiumPlan.monthly?.plan_id : premiumPlan.yearly?.plan_id
    const price = billingInterval === "month" ? String(premiumPlan.monthly?.price) : String(premiumPlan.yearly?.price)
    if (subscription.subscriptionId) {
      cancelSubscription(subscription.subscriptionId, 0)
    }
    if (planId) {
      const sub = await createSubscription(planId, session.user.email || ("" as string))
      if (!sub) {
        toast.error("Something went wrong while creating subscription. Please try again.")
        setLoading(false)
        return
      }

      const { data } = await apolloClient.mutate({
        mutation: createSubscriptionMutation,
        variables: {
          payload: {
            planId: planId,
            subscriptionId: sub.id,
            interval: billingInterval === "month" ? "MONTHLY" : "YEARLY",
            plan: "PREMIUM" as Plan,
            price: price,
            shortUrl: sub.short_url
          }
        },
      })

      if (!data?.createSubscription) {
        toast.error("Something went wrong while creating subscription. Please try again.")
        setLoading(false)
        return
      } else {
        await apolloClient.resetStore();
        await queryclient.invalidateQueries({ queryKey: ["subscription"] })
        window.open(sub.short_url, "_blank")
      }
      
      setLoading(false)
      setShowUpgradeDialog(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!session?.user) {
      router.push("/auth/sign-in")
      return
    }
    if(cancelOption === "end-of-cycle" && !subscription.autorenew) {
      toast.error("Your subscription is already set to not auto-renew.")
      return
    }
    setLoading(true)
    try {
      if (subscription.subscriptionId) {
        await cancelSubscription(subscription.subscriptionId, cancelOption === "now" ? 0 : 1)
      }
      if (subscription.subscriptionId) {
        await apolloClient.mutate({
          mutation: cancelSubscriptionMutation,
          variables: {
            subscriptionId: subscription.subscriptionId,
            option: cancelOption === "now" ? 0 : 1,
          },
        })
      }
      setShowCancelDialog(false)
      setLoading(false)
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["subscription"] })
      toast.success("Subscription cancelled accordingly")
    } catch (error) {
      console.error("Error cancelling subscription:", error)
    }
  }

  return (
    <>
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
        className="w-full max-w-md mx-auto mb-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          >
            <Image
              src={"/user.png"}
              alt="Profile"
              width={40}
              height={40}
              className="rounded-full border-2 border-white/20"
            />
          </motion.div>
          )
          <motion.h1
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Hello ,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {user?.name || user?.userName}
            </span>
            !
          </motion.h1>
        </div>
        <motion.p
          className="text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Here's your current subscription details
        </motion.p>
      </motion.div>

      <div className="w-full max-w-md mx-auto relative">
        <Card className="w-full overflow-hidden border-2 border-black bg-black text-white">
          <div className={cn("h-1 w-full bg-gradient-to-r", planDetails.gradientColor)} />

          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon className={cn("w-6 h-6", planDetails.textColor)} />
                <CardTitle className="text-xl font-bold">{planDetails.name} Plan</CardTitle>
              </div>
              {subscription.active && (
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Active
                </span>
              )}
            </div>

            <CardDescription className="text-white/70 mt-1">
              {subscription.interval === "MONTHLY" ? "Monthly" : "Yearly"} billing •
              {subscription.autorenew ? " Auto-renews" : " Does not auto-renew"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-white/80">
                <CalendarDays className="w-4 h-4" />
                <span>Started: {formatDate(subscription.startDate)}</span>
              </div>
              <div className="text-white/80">Renews: {formatDate(subscription.endDate)}</div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-white/70">
                <span>Billing cycle progress</span>
                <span>{daysRemaining} days remaining</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progressPercentage}%`,
                    background:
                      planKey === "Basic"
                        ? "linear-gradient(to right, #2563eb, #9333ea, #db2777)"
                        : "linear-gradient(to right, #d97706, #ef4444, #f97316)",
                  }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="text-sm font-medium mb-2">Subscription details</div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-white/70">Plan</div>
                <div className="font-medium">{planDetails.name}</div>

                <div className="text-white/70">Price</div>
                <div className="font-medium">
                  {subscription.price ? `₹${subscription.price}` : "N/A"}
                  <span className="text-white/70 text-xs ml-1">/{subscription.interval === "MONTHLY" ? " month" : " year"}</span>
                </div>

                <div className="text-white/70">Status</div>
                <div className="font-medium">{subscription.active ? "Active" : "Inactive"}</div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col border-t border-white/10 pt-4">
            <div className="w-full space-y-4">
              {subscription.plan === Plan.Basic ? (
                <>
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className={cn("w-5 h-5", plans.Premium.textColor)} />
                    <span className="font-medium">Upgrade to Premium Plan</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      disabled={loading}
                      onClick={() => setShowUpgradeDialog(true)}
                      className="w-full"
                      style={{
                        background: "linear-gradient(to right, #d97706, #ef4444, #f97316)",
                        color: "white",
                      }}
                    >
                      Upgrade
                    </Button>

                    <Button
                      disabled={loading}
                      onClick={() => setShowCancelDialog(true)}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10"
                    >
                      Cancel Plan
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => setShowCancelDialog(true)}
                  variant="outline"
                  disabled={loading}
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>

        <DialogContent className="sm:max-w-md bg-zinc-900 text-white border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Crown className={cn("w-6 h-6", premiumPlan.textColor)} />
              Upgrade to Premium
            </DialogTitle>
            <DialogDescription className="text-white/70">Unlock all premium features and benefits</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative flex bg-white/10 backdrop-blur-sm rounded-full p-1 mb-4">
              <button
                onClick={() => setBillingInterval("month")}
                disabled={loading}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 w-1/2",
                  billingInterval === "month" ? "bg-white text-black shadow" : "text-white",
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval("year")}
                disabled={loading}
                className={cn(
                  "px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 w-1/2",
                  billingInterval === "year" ? "bg-white text-black shadow" : "text-white",
                )}
              >
                Yearly
              </button>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={cn("text-xl font-bold", premiumPlan.textColor)}>Premium Plan</h3>
                  <p className="text-sm text-white/70">{premiumPlan.description}</p>
                </div>
                <div className="text-right">
                  <div className={cn("text-2xl font-bold", premiumPlan.textColor)}>
                    ₹{billingInterval === "month" ? premiumPlan.monthly?.price : premiumPlan.yearly?.price}
                    <span className="text-sm font-normal text-white/70">/{billingInterval}</span>
                  </div>
                  {billingInterval === "year" && (
                    <p className="text-xs text-white/70">
                      Save ₹{(premiumPlan.monthly?.price || 0) * 12 - (premiumPlan.yearly?.price || 0)} per year
                    </p>
                  )}
                </div>
              </div>

              <ul className="space-y-2">
                {premiumPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-white/80">
                    <CheckIcon className={cn("w-4 h-4", premiumPlan.textColor)} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div className="rounded-md border border-red-500 bg-red-500/10 p-4">
                <p className="text-sm text-red-400 font-semibold">
                  ⚠️ Important:
                </p>
                <p className="text-sm text-red-200 pt-1">
                  Upgrading now will <span className="font-semibold text-red-100">cancel your current subscription immediately</span> and start a new one.
                  <br />
                  If you prefer, you can wait until the end of your billing cycle to avoid overlapping charges.
                </p>
              </div>
            </div>
          </div>

          <Loader state={loading} className="text-center">
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpgrade}
                disabled={loading}
                style={{
                  background: "linear-gradient(to right, #d97706, #ef4444, #f97316)",
                  color: "white",
                }}
              >
                Upgrade Now
              </Button>
            </DialogFooter>
          </Loader>
        </DialogContent>
      </Dialog>

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>

        <DialogContent className="sm:max-w-md bg-zinc-900 text-white border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-red-400">
              <XCircle className="w-6 h-6 text-red-400" />
              Cancel Subscription
            </DialogTitle>
            <DialogDescription className="text-white/70">
              We're sorry to see you go. Please confirm your cancellation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-white/90">
                <p className="font-medium mb-1">Are you sure you want to cancel?</p>
                <p className="text-white/70">
                  {planKey === "Premium"
                    ? "You'll lose access to all Premium features including ad-free experience, unlimited post length, and 24/7 support."
                    : "You'll lose access to all Basic features including unlimited bookmarks, edit posts, and priority feed access."}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">When would you like to cancel?</p>
              <RadioGroup
                defaultValue="end-of-cycle"
                value={cancelOption}
                onValueChange={(value) => setCancelOption(value as CancelOption)}
                className="grid grid-cols-2 gap-2"
              >
                {subscription.autorenew && <div className="flex items-center space-x-2">
                  <RadioGroupItem value="end-of-cycle" id="cancel-end-of-cycle" />
                  <Label htmlFor="cancel-end-of-cycle" className="text-sm text-white/80">
                    At end of cycle
                    <span className="block text-xs text-white/60">Access until {formatDate(subscription.endDate)}</span>
                  </Label>
                </div>
                }
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="now" id="cancel-now" />
                  <Label htmlFor="cancel-now" className="text-sm text-white/80">
                    Right now
                    <span className="block text-xs text-white/60">Immediate cancellation</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Loader state={loading} className="text-center">
            <DialogFooter className="sm:justify-between">
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Subscription
              </Button>
              <Button
                disabled={loading}
                onClick={handleCancelSubscription}
                variant="destructive"
                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0"
              >
                Cancel Subscription
              </Button>
            </DialogFooter>
          </Loader>
        </DialogContent>
      </Dialog>

    </>
  )
}
