import { Participants } from "@/app/(full_page)/call/[callId]/page"
import { Call, User } from "@/gql/graphql"
import { useEffect, useRef, useState } from "react"

export function useCallTimer(call: Call, currentUser: User, participants: Participants[]) {
  const [callDuration, setCallDuration] = useState(0)
  const [timerStarted, setTimerStarted] = useState(false)
  const animationFrameRef = useRef<number | null>(null)
  const callStartTimeRef = useRef<number | null>(null)

  useEffect(() => {
    const currentUserParticipant = participants.find((p) => p.userId === currentUser.id)
    const isHost = currentUserParticipant?.userId === call.callerId
    const nonHostParticipants = participants.filter((p) => p.userId !== currentUser.id)
    const shouldStartTimer = nonHostParticipants.length > 0 || call.callPickedAt

    if (shouldStartTimer && !timerStarted) {
      const baseStartTime = new Date(isHost ? call.callPickedAt : currentUserParticipant?.joinedAt).getTime()
      callStartTimeRef.current = baseStartTime + callDuration * 1000
      setTimerStarted(true)
    } else if (!shouldStartTimer && timerStarted) {
      setTimerStarted(false)
      setCallDuration(0)
      callStartTimeRef.current = null
    }
  }, [participants, currentUser.id])

  useEffect(() => {
    if (!timerStarted || !callStartTimeRef.current) return
    const updateDuration = () => {
      const now = Date.now()
      const durationInSeconds = Math.floor((now - callStartTimeRef.current!) / 1000)
      setCallDuration(durationInSeconds)
      animationFrameRef.current = requestAnimationFrame(updateDuration)
    }
    animationFrameRef.current = requestAnimationFrame(updateDuration)
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [timerStarted])

  return { callDuration, timerStarted }
}
