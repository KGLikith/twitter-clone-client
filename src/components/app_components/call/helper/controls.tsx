import { Participants } from '@/app/(full_page)/call/[callId]/page'
import { apolloClient } from '@/clients/api'
import { Button } from '@/components/ui/button'
import { Call } from '@/gql/graphql'
import { endCallMutation, hideVideoMutation, muteAudioMutation, showVideoMutation, unmuteAudioMutation } from '@/graphql/mutation/user'
import { Mic, MicOff, Phone, Video, VideoOff } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  call: Call
  videoCallComponent: Boolean
  audioPermissationGranted: boolean
  videoPermissationGranted?: boolean
  currentUserParticipant: Participants
  isMuted: boolean
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>
  setIsVideoOn: React.Dispatch<React.SetStateAction<boolean>>
  isVideoOn: boolean
}

export default function Controls({ call, videoCallComponent, audioPermissationGranted, currentUserParticipant, videoPermissationGranted,isMuted, isVideoOn, setIsMuted, setIsVideoOn }: Props) {
  

  useEffect(() => {
    if (audioPermissationGranted && currentUserParticipant.audio) {
      setIsMuted(false)
    }
    if (videoPermissationGranted && currentUserParticipant.video) {
      setIsVideoOn(true)
    }
  }, [audioPermissationGranted, videoPermissationGranted, currentUserParticipant.audio, currentUserParticipant.video])

  const handleEndCall = async () => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: endCallMutation,
        variables: {
          callId: call.id,
        },
      })

      if (!data?.endCall) {
        toast.error("Failed to end the call. Please try again. Sorry for the inconvenience.", {
          duration: 2000,
        })
      }
    } catch (err) {
      toast.error("An error occurred while ending the call. Please try again later.", {
        duration: 2000,
      })
    }
  }

  const toggleMute = async () => {
    try {
      if (!audioPermissationGranted && isMuted) {
        toast.error("You need to grant microphone permissions to toggle mute.", {
          duration: 2000,
        })
        return;
      }
      await apolloClient.mutate({
        mutation: isMuted ? unmuteAudioMutation : muteAudioMutation,
        variables: { callId: call.id },
      })
      setIsMuted(!isMuted)
    } catch (err) {
      console.error("Error toggling mute:", err)
      toast.error("Failed to toggle mute. Please try again.", {
        duration: 2000,
      })
    }
  }

  const toggleVideo = async () => {
    try {
      if (!videoPermissationGranted && !isVideoOn) {
        toast.error("You need to grant camera permissions to toggle video.", {
          duration: 2000,
        })
        return;
      }
      if (!setIsVideoOn) return;
      await apolloClient.mutate({
        mutation: isVideoOn ? hideVideoMutation : showVideoMutation,
        variables: { callId: call.id },
      })
      setIsVideoOn && setIsVideoOn(!isVideoOn)
    } catch (err) {
      console.error("Error toggling video:", err)
      toast.error("Failed to toggle video. Please try again.", {
        duration: 2000,
      })
    }
  }
  return (
    <div className="p-4 bg-card flex items-center justify-center gap-4">
      <Button
        variant={isMuted ? "destructive" : "secondary"}
        size="icon"
        className="rounded-full h-12 w-12"
        onClick={toggleMute}
      >
        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      <Button variant="destructive" size="icon" className="rounded-full h-14 w-14" onClick={handleEndCall}>
        <Phone className="h-6 w-6 rotate-135" />
      </Button>

      {videoCallComponent &&
        <Button
          variant={isVideoOn ? "secondary" : "destructive"}
          size="icon"
          className="rounded-full h-12 w-12"
          onClick={toggleVideo}
        >
          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
        </Button>}
    </div>
  )
}