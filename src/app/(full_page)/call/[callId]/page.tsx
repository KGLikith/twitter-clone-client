"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useCurrentUser, useGetCallDetails } from "@/hooks/user"
import type { Call, CallParticipants, User, UserInfo } from "@/gql/graphql"
import {
  useOnCallAnswerSubscription,
  useOnCallEndedSubscription,
  useOnParticipantLeftSubscription,
} from "@/hooks/subscriptions"
import { toast } from "sonner"
import CallSummary from "@/components/app_components/call/call-summary"
import { apolloClient } from "@/clients/api"
import { endCallMutation } from "@/graphql/mutation/user"
import { usePathname } from "next/navigation"
import CallDialing from "@/components/app_components/call/call-dialing"
import CallComponent from "@/components/app_components/call/callComponent"

export type Participants = {
  userId: string
  joinedAt: string
  audio: boolean
  video: boolean
  user: UserInfo
}

export default function CallPage() {
  const { callId } = useParams()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [callType, setCallType] = useState<"AUDIO" | "VIDEO">("AUDIO")
  const [call, setCall] = useState<Call | null>(null)
  const [callEnded, setCallEnded] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [hostEnded, setHostEnded] = useState(false)
  const [declinedParticipants, setDeclinedParticipants] = useState<string[]>([])
  const [callEndedParticipants, setCallEndedParticipants] = useState<string[]>([])
  const [participants, setParticipants] = useState<Participants[]>([])

  const { callDetails, isLoading, refetch } = useGetCallDetails(callId as string)
  const { user: userDetails, isLoading: userLoading } = useCurrentUser()
  const { data } = useOnCallAnswerSubscription(callId as string)
  const { data: callEndedData } = useOnCallEndedSubscription(callId as string)
  const { data: callParticipantLeftData } = useOnParticipantLeftSubscription(callId as string)
  const pathname = usePathname()
  const prevPathRef = useRef(pathname)

  useEffect(() => {
    if (!call || !user) return

    const handleUnload = () => {
      // if (!call?.endedAt) {
      //   apolloClient.mutate({
      //     mutation: endCallMutation,
      //     variables: { callId: call.id },
      //   }).catch((err) => console.error("Call end error:", err))
      // }
    }

    window.addEventListener("beforeunload", handleUnload)

    if (prevPathRef.current !== pathname) {
      if (!call.endedAt)
        apolloClient
          .mutate({
            mutation: endCallMutation,
            variables: { callId: call.id },
          })
          .catch((err) => console.error("Call end error:", err))
    }

    prevPathRef.current = pathname

    return () => {
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [call?.id, call?.callerId, call?.endedAt, user?.id, pathname])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (call?.participants.length != 2 && participants.length === 1 && call && !call.endedAt) {
      timeoutRef.current = setTimeout(async () => {
        try {
          await apolloClient.mutate({
            mutation: endCallMutation,
            variables: { callId: call.id },
          })

          setCallEnded(true)
          toast.info("Call ended due to no participants.", {
            duration: 2000
          })
        } catch (err) {
          console.error("Auto-end call error:", err)
        }
      }, 30000)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [participants.length, call])

  useEffect(() => {
    if (!user) return
    if (callDetails) {
      if (
        callDetails.endedAt ||
        callDetails.participants.find((p: CallParticipants) => p.userId === user.id && p.leftAt)
      ) {
        setCall(callDetails as Call)
        setCallType(callDetails.type)
        setCallEnded(true)
        setDeclinedParticipants(
          callDetails.participants.filter((p: CallParticipants) => !p.accepted).map((p: any) => p.userId),
        )
        setCallEndedParticipants(
          callDetails.participants.filter((p: CallParticipants) => p.leftAt).map((p: any) => p.userId),
        )
        return
      }
      setCall(callDetails as Call)
      setCallType(callDetails.type)
      setParticipants(
        callDetails.participants
          .filter((p: CallParticipants) => p.accepted && !p.leftAt)
          .map((p: any) => ({
            userId: p.userId,
            joinedAt: p.joinedAt,
            leftAt: p.leftAt ?? null,
            accepted: p.accepted,
            audio: p.audioEnabled,
            video: p.videoEnabled,
            user: p.user,
          })),
      )
    }
  }, [callDetails, user])

  useEffect(() => {
    if (data?.onCallAnswer) {
      const answeredCallDetails = data.onCallAnswer
      if (answeredCallDetails.accepted && answeredCallDetails.callId === callId) {
        refetch()
        toast.info(
          `${call?.participants.find((p: CallParticipants) => p.userId === answeredCallDetails.userId)?.user.name} has joined the call.`,
          {
            duration: 2000,
          }
        )
      } else {
        setDeclinedParticipants((prev) => [...prev, answeredCallDetails.userId])
        if (answeredCallDetails.declined)
          toast.error(
            `${call?.participants.find((p: CallParticipants) => p.userId === answeredCallDetails.userId)?.user.name} has declined the call.`, {
            duration: 2000,
          }
          )
        else
          toast.error(
            `${call?.participants.find((p: CallParticipants) => p.userId === answeredCallDetails.userId)?.user.name} has missed the call.`, {
            duration: 2000,
          }
          )
      }
    }
  }, [data?.onCallAnswer])

  useEffect(() => {
    if (callEndedData?.onCallEnded) {
      const endedCallDetails = callEndedData.onCallEnded
      if (endedCallDetails.callId === callId) {
        refetch()
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setCallEndedParticipants((prev) => [...prev, ...participants.map((p) => p.userId)])
        setParticipants([])
        setCallEnded(true)
        if (endedCallDetails.host) {
          setHostEnded(true)
          if (call?.callerId === user?.id) {
            return
          }
          toast.info("The host has ended the call.", {
            duration: 2000,
          })
        } else {
          toast.info("The call has ended.", {
            duration: 2000,
          })
          setHostEnded(false)
        }
      }
    }
  }, [callEndedData])

  useEffect(() => {
    if (callParticipantLeftData?.onParticipantLeft) {
      const leftParticipantDetails = callParticipantLeftData.onParticipantLeft
      if (leftParticipantDetails.callId === callId) {
        setCallEndedParticipants((prev) => [...prev, leftParticipantDetails.userId])
        setParticipants((prev) => prev.filter((p) => p.userId !== leftParticipantDetails.userId))

        if (leftParticipantDetails.userId === user?.id) {
          refetch()
          setCallEnded(true)
          return
        }
        toast.info(
          `${call?.participants.find((p: CallParticipants) => p.userId === leftParticipantDetails.userId)?.user.name} has left the call.`, {
          duration: 2000,
        }
        )
      }
    }
  }, [callParticipantLeftData])

  useEffect(() => {
    if (userDetails && !userLoading) {
      setUser(userDetails as User)
    }
  }, [userDetails, userLoading])

  useEffect(() => {
    if (!call || !user) return
    if (declinedParticipants.length + callEndedParticipants.length === call.participants.length - 1) {
      setCallEnded(true)
    }
  }, [declinedParticipants, callEndedParticipants])

  if (isLoading || userLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">Seems like you are not logged in!!</div>
      </>
    )
  }

  if (!call) {
    return (
      <>
        <div className="flex items-center justify-center h-screen">This call does not exist</div>
      </>
    )
  }

  if (callEnded || call.endedAt) {
    return (
      <CallSummary
        call={call}
        currentUser={user}
        participants={participants}
        declinedParticipants={declinedParticipants}
        callEndedParticipants={callEndedParticipants}
        callType={callType}
        showCallAgainOptions={true}
        hostEnded={hostEnded}
      />
    )
  }

  if (call && !call.callPickedAt) {
    const recipient = call.participants.find((p: CallParticipants) => p.userId !== user.id)?.user

    if (!recipient) {
      return (
        <div className="flex items-center justify-center h-screen">No recipient found for this call.</div>
      )
    }
    return (
      <CallDialing recipient={recipient as UserInfo} setCallEnded={setCallEnded} callType={callType} callId={call.id} callerId={call.callerId} userId={user.id} />
    )
  }

  return (
    <>
      {user &&
        call &&
        callType &&
        <div className="h-screen bg-background">
          <CallComponent
            call={call}
            currentUser={user as User}
            participants={participants}
            setParticipants={setParticipants}
            video={callType === "VIDEO"}
          />
        </div>

      }
    </>
  )
}
