"use client"
import NotificalSkel from "@/components/global/Skeleton/NotificationSkel"
import type { Notification } from "@/gql/graphql"
import { useCurrentUser, useGetNotifications } from "@/hooks/user"
import Link from "next/link"
import { useEffect, useState } from "react"
import NotificationPage from "./NotificationPage"
import { useQueryClient } from "@tanstack/react-query"
import { apolloClient } from "@/clients/api"
import { updateAllNotificationsMutation } from "@/graphql/mutation/user"
import { toast } from "@/hooks/use-toast"

const Page = () => {
  const { user, isLoading } = useCurrentUser()
  const { notifications, isLoading: notificationLoading,refetch } = useGetNotifications()
  const [notific, setNotific] = useState<Notification[]>([])

  useEffect(() => {
    if (notifications) {
      setNotific(notifications as Notification[])
    }
  }, [notifications])

  const handleClearNotifications = async () => {
    try {
      await apolloClient.mutate({
        mutation: updateAllNotificationsMutation
      })
      await apolloClient.resetStore();
      refetch();
      toast({
        title: "Notifications cleared successfully",
        duration: 1000,
      })
    } catch (error) {
      console.error("Failed to clear notifications:", error)
      return Promise.reject(error)
    }
  }

  if (isLoading || notificationLoading) {
    return (
      <div className="h-full w-full">
        <NotificalSkel />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="h-full w-full my-2 mx-2 flex justify-center items-center">
        <h1 className="font-bold text-2xl">
          You are not logged in. Go to{" "}
          <Link className="text-blue-600" href={"/"}>
            home
          </Link>
        </h1>
      </div>
    )
  }

  return (
    <>
      <NotificationPage notifications={notific as Notification[]} onClearNotifications={handleClearNotifications} />
    </>
  )
}

export default Page
