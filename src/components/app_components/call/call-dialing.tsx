import { apolloClient } from '@/clients/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CallParticipants, UserInfo } from '@/gql/graphql'
import { endCallMutation } from '@/graphql/mutation/user'
import { Phone, PhoneOff, Video } from 'lucide-react'
import React from 'react'

type Props = {
    recipient: UserInfo
    setCallEnded: (ended: boolean) => void
    callType: "AUDIO" | "VIDEO"
    callId: string
    callerId: string
    userId: string

}

export default function CallDialing({ recipient, setCallEnded,callType, callId, callerId, userId }: Props) {
    return (
        <div className="h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center space-y-6 max-w-md w-full">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                        <Avatar className={`h-full w-full object-cover ring-2 ring-primary`}>
                            <AvatarImage
                                src={recipient?.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${recipient.profileImageUrl}` : "/user.png"}
                                alt={recipient?.name}
                            />
                            <AvatarFallback>{recipient?.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        {callType === "AUDIO" ? (
                            <Phone className="h-6 w-6 rotate-135 text-black" />
                        ) : (
                            <Video className="h-6 w-6 text-black" />
                        )}
                    </div>
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">{recipient?.name || "Unknown"}</h2>
                    <p className="text-muted-foreground">{callerId === userId ? "Calling..." : "Incoming call..."}</p>
                </div>

                <div className="flex space-x-2 mt-4">
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    <div className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>

                <div className="flex space-x-6 mt-8">
                    <button
                        onClick={async () => {
                            try {
                                await apolloClient.mutate({
                                    mutation: endCallMutation,
                                    variables: { callId: callId },
                                })
                                setCallEnded(true)
                            } catch (err) {
                                console.error("End call error:", err)
                            }
                        }}
                        className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                        <PhoneOff className="h-8 w-10 rounded-full text-black" />
                    </button>
                </div>
            </div>
        </div>
    )
}