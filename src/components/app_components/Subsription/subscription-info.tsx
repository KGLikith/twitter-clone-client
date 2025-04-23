"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Calendar, CreditCard, AlertCircle, CheckCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export default function SubscriptionInfo({ subscription }: { subscription: any | null }) {
  const [timeLeft, setTimeLeft] = useState("")
  const [daysLeft, setDaysLeft] = useState(0)
  const [hoursLeft, setHoursLeft] = useState(0)
  const [minutesLeft, setMinutesLeft] = useState(0)
  const [progress, setProgress] = useState(100)
  const [status, setStatus] = useState<"active" | "expiring" | "expired">("active")
  const { theme } = useTheme()
  const isLightMode = theme === "light"

  useEffect(() => {
    if (!subscription?.currentPeriodEndDate) return

    const updateTimeLeft = () => {
      const now = new Date()
      const startDate = subscription.currentPeriodStartDate ? new Date(subscription.currentPeriodStartDate) : now
      const expiryDate = new Date(subscription.currentPeriodEndDate? subscription.currentPeriodEndDate : now)
      const timeDiff = expiryDate.getTime() - now.getTime()
      const totalDuration = expiryDate.getTime() - startDate.getTime()
      const timeElapsed = now.getTime() - startDate.getTime()

      // Calculate progress (remaining percentage)
      const calculatedProgress = Math.max(0, Math.min(100, 100 - (timeElapsed / totalDuration) * 100))
      setProgress(calculatedProgress)

      // Calculate time components
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      setDaysLeft(days)
      setHoursLeft(hours)
      setMinutesLeft(minutes)

      // Set status
      if (timeDiff <= 0) {
        setStatus("expired")
        setTimeLeft("Expired")
      } else if (days < 7) {
        setStatus("expiring")
        if (days > 1) {
          setTimeLeft(`${days} days`)
        } else if (days === 1) {
          setTimeLeft(`1 day and ${hours} hours`)
        } else {
          setTimeLeft(`${hours} hours and ${minutes} minutes`)
        }
      } else {
        setStatus("active")
        setTimeLeft(`${days} days`)
      }
    }

    updateTimeLeft()
    const timer = setInterval(updateTimeLeft, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [subscription?.currentPeriodEndDate, subscription?.currentPeriodStartDate])

  if (!subscription) return null

  const statusColors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
    expiring: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
    expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  }

  const statusIcons = {
    active: <CheckCircle className="h-4 w-4 mr-1" />,
    expiring: <AlertCircle className="h-4 w-4 mr-1" />,
    expired: <AlertCircle className="h-4 w-4 mr-1" />,
  }

  const statusText = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired",
  }

  return (
    <Card className={cn("w-full max-w-md h-fit shadow-md", isLightMode ? "bg-white border-gray-200" : "")}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className={cn("flex items-center gap-2", isLightMode ? "text-gray-800" : "")}>
            <CreditCard className={cn("h-5 w-5", isLightMode ? "text-gray-600" : "")} />
            Subscription
          </CardTitle>
          <Badge className={statusColors[status]}>
            {statusIcons[status]}
            {statusText[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className={cn("rounded-lg p-3", isLightMode ? "bg-gray-50" : "bg-gray-800")}>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-medium text-lg">{subscription.plan}</p>
          </div>
          <div className={cn("rounded-lg p-3", isLightMode ? "bg-gray-50" : "bg-gray-800")}>
            <p className="text-sm text-muted-foreground">Status</p>
            <p className="font-medium text-lg capitalize">{status || "Active"}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className={cn("text-sm font-medium", isLightMode ? "text-gray-700" : "")}>Subscription Period</p>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {subscription.currentPeriodStartDate
                  ? new Date(subscription.currentPeriodStartDate).toLocaleDateString()
                  : "N/A"}{" "}
                -{" "}
                {subscription.currentPeriodEndDate
                  ? new Date(subscription.currentPeriodEndDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Started</span>
            <span>Expires</span>
          </div>
        </div>

        <div
          className={cn(
            "mt-3 text-center p-3 rounded-lg",
            isLightMode
              ? "bg-primary/5 text-primary-foreground border border-primary/10"
              : "bg-primary/10 text-primary-foreground border border-primary/20",
          )}
        >
          <p className="text-sm font-medium text-muted-foreground">Total Time Remaining</p>
          <p className="text-3xl font-bold text-black dark:text-white">
            {daysLeft} {daysLeft === 1 ? "day" : "days"}
          </p>
        </div>

        {/* {status !== "expired" && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Time Remaining</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={cn("rounded-md p-2", isLightMode ? "bg-primary/10" : "bg-primary/20")}>
                <p className="text-2xl font-bold">{daysLeft}</p>
                <p className="text-xs text-muted-foreground">Days</p>
              </div>
              <div className={cn("rounded-md p-2", isLightMode ? "bg-primary/10" : "bg-primary/20")}>
                <p className="text-2xl font-bold">{hoursLeft}</p>
                <p className="text-xs text-muted-foreground">Hours</p>
              </div>
              <div className={cn("rounded-md p-2", isLightMode ? "bg-primary/10" : "bg-primary/20")}>
                <p className="text-2xl font-bold">{minutesLeft}</p>
                <p className="text-xs text-muted-foreground">Minutes</p>
              </div>
            </div>
          </div>
        )} */}

          <div
            className={cn(
              "p-3 rounded-md mt-2",
              isLightMode ? "bg-yellow-50 text-yellow-800" : "bg-yellow-900/30 text-yellow-200",
            )}
          >
            <p className="text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              Your subscription will not renew automatically
            </p>
          </div>
      </CardContent>
      {/* <CardFooter className="pt-0">
        <div className="w-full text-sm text-muted-foreground flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </CardFooter> */}
    </Card>
  )
}

