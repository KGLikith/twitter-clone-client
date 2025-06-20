"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Phone, Video, X, PhoneCall, UserIcon, Users } from "lucide-react"
import { toast } from "sonner"
import { useOnCallEndedSubscription, useOnIcomingCallSubscription } from "@/hooks/subscriptions"
import { type Call, CallStatus, CallType, type User } from "@/gql/graphql"
import { acceptCallMutation, declineCallMutation, missedCallMutation } from "@/graphql/mutation/user"
import { apolloClient } from "@/clients/api"
import { useCurrentUser } from "@/hooks/user"

export default function IncomingCallNotification() {
  const router = useRouter()
  const { user, isLoading } = useCurrentUser()
  const [currentUser, setUser] = useState<User | null>(null)
  const [incomingCall, setIncomingCall] = useState<Call | null>(null)
  const [caller, setCaller] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [acceptedParticipants, setAcceptedParticipants] = useState<User[]>([])
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { data: incomingCallData } = useOnIcomingCallSubscription(currentUser?.id as string)
  const { data: callEndedData } = useOnCallEndedSubscription(incomingCall?.id || null);

  useEffect(() => {
    if (user && !isLoading) {
      setUser(user as User)
    }
  }, [user, isLoading])

  useEffect(() => {
    if (!incomingCall || !currentUser) return

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        await apolloClient.mutate({
          mutation: missedCallMutation,
          variables: { callId: incomingCall.id },
        })
        toast.info("Missed call", {
          duration: 2000,
        })
        setIncomingCall(null)
        setCaller(null)
        setAcceptedParticipants([])
      } catch (err) {
        console.error("Failed to mark call as missed", err)
      }
    }, 30000)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [incomingCall, currentUser])


  useEffect(() => {
    if (incomingCallData?.onIncomingCall) {
      const call = incomingCallData.onIncomingCall as Call
      if (
        !currentUser ||
        call.callerId === currentUser.id ||
        !(call.status === CallStatus.Standby || call.status === CallStatus.Ongoing)
      ) {
        return
      }

      const callerParticipant = call.participants?.find((p) => p.user.id === call.callerId)
      if (callerParticipant) {
        setCaller(callerParticipant.user as User)
      }

      const accepted =
        call.participants
          ?.filter((p) => p.accepted && p.user.id !== currentUser.id && p.user.id !== call.callerId)
          .map((p) => p.user as User) || []

      setAcceptedParticipants(accepted)
      setIncomingCall(call)
    }
  }, [incomingCallData, currentUser?.id])

  useEffect(() => {

    if (callEndedData?.onCallEnded) {
      const endedCall = callEndedData.onCallEnded
      if (endedCall.callId === incomingCall?.id) {
        toast.info("Call has ended by the host.", {
          duration: 2000,
        })
        setIncomingCall(null)
        setCaller(null)
        setAcceptedParticipants([])
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }

  }, [callEndedData?.onCallEnded])

  const handleAccept = async () => {
    if (incomingCall) {
      setLoading(true)
      const { data } = await apolloClient.mutate({
        mutation: acceptCallMutation,
        variables: { callId: incomingCall.id },
      })
      if (data) {
        router.push(`/call/${incomingCall.id}`)
        toast.success("Call accepted", {
          duration: 2000,
        })
        setIncomingCall(null)
        setCaller(null)
        setAcceptedParticipants([])
      }
      setLoading(false)
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleReject = async () => {
    if (incomingCall) {
      setLoading(true)
      const { data } = await apolloClient.mutate({
        mutation: declineCallMutation,
        variables: { callId: incomingCall.id },
      })
      if (data) {
        toast.success("Call declined", {
          duration: 2000,
        })
        setIncomingCall(null)
        setCaller(null)
        setAcceptedParticipants([])
      }
      setLoading(false)
    }
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  if (!incomingCall || !caller || isLoading || !currentUser) {
    return null
  }

  const isGroupCall = (incomingCall.participants?.length || 0) > 2
  const conversationName = incomingCall.conversation?.name

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 w-[350px] shadow-lg overflow-hidden animate-in slide-in-from-bottom-5 ${isGroupCall ? "border-2 border-stone-200" : "border-2 border-stone-200"
        }`}
    >
      <CardHeader
        className={`p-4 pb-3 space-y-0 ${isGroupCall ? "bg-gradient-to-r from-stone-800 to-stone-700" : "bg-gradient-to-r from-stone-800 to-stone-700"}`}
      >
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-2">
            {incomingCall.type === CallType.Video ? (
              <Video className="h-5 w-5 text-white animate-pulse" />
            ) : (
              <PhoneCall className="h-5 w-5 text-white animate-pulse" />
            )}
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">
                {incomingCall.type === CallType.Video ? "Video Call" : "Audio Call"}
              </h3>
              {isGroupCall && <Badge className="bg-stone-600 hover:bg-stone-700 text-white text-xs">Group Call</Badge>}
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={handleReject}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3 space-y-3">
        <div className="flex items-center gap-3">
          <Avatar className={`h-14 w-14 border-2 ${isGroupCall ? "border-stone-200" : "border-stone-200"}`}>
            <AvatarImage src={caller.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${caller.profileImageUrl}` : "/user.png"} />
            <AvatarFallback>{caller.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>

            <p className="font-medium text-base text-stone-400"> <span className="text-stone-100">{caller.name}</span> is calling you...</p>
            {isGroupCall ? (
              <div>
                {conversationName && (
                  <p className="text-sm font-medium text-zinc-400">
                    Group: <span className="text-zinc-100 font-semibold">{conversationName}</span>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">is calling you...</p>
            )}
          </div>
        </div>

        {isGroupCall && (
          <div
            className={`rounded-lg p-3 ${acceptedParticipants.length > 0 ? "bg-stone-50 border border-stone-100" : ""}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-sm text-zinc-400">Participants</h4>
            </div>

            {acceptedParticipants.length > 0 ? (
              <>
                <p className="text-xs text-stone-800 mb-2 flex items-center gap-1.5">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span className="font-medium text-stone-900">{acceptedParticipants.length} people</span> already
                  joined
                </p>
                <div className="flex -space-x-3 overflow-hidden">
                  {acceptedParticipants.slice(0, 5).map((participant) => (
                    <Avatar key={participant.id} className="h-8 w-8 border-2 border-white">
                      <AvatarImage src={participant.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.profileImageUrl}` : "/user.png"} />
                      <AvatarFallback>{participant.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  ))}
                  {acceptedParticipants.length > 5 && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-stone-100 text-xs font-medium border-2 border-white text-stone-900">
                      +{acceptedParticipants.length - 5}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-xs text-muted-foreground">No one has joined yet</p>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-2 flex gap-3">
        <Button
          variant="outline"
          className="flex-1 gap-2 border-stone-200 hover:bg-stone-800 hover:text-red-600 text-red-500 font-medium"
          onClick={handleReject}
          disabled={loading}
        >
          <X className="h-4 w-4" />
          Decline
        </Button>
        <Button
          variant="default"
          className="flex-1 gap-2 bg-green-700 hover:bg-green-800 font-medium"
          onClick={handleAccept}
          disabled={loading}
        >
          {incomingCall.type === CallType.Video ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
          Accept
        </Button>
      </CardFooter>
    </Card>
  )
}
