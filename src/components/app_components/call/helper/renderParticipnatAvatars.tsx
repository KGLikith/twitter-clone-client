
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Call, CallParticipants, User, UserInfo } from "@/gql/graphql"
import { cn } from "@/lib/utils"

type Props = {
  isGroupCall: boolean,
   callerId: string, 
   recieverUser: UserInfo, 
   currentUser: User, 
   allParticipants: CallParticipants[]
}

export default function RenderParticipantAvatars({isGroupCall, callerId, recieverUser, currentUser, allParticipants }: Props) {
  if (!isGroupCall) {
    return (
      <div className="flex items-center justify-center">
        <Avatar
          className={cn("h-16 w-16 shadow-lg", recieverUser?.id === currentUser.id ? "ring-2 ring-primary" : "")}
        >
          <AvatarImage
            src={
              recieverUser?.profileImageUrl
                ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${recieverUser.profileImageUrl}`
                : "/user.png"
            }
          />
          <AvatarFallback className={"text-lg font-semibold"}>
            {recieverUser?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    )
  }

  const visibleParticipants = allParticipants.filter((p) => p.userId != callerId).slice(0, 5)
  const remainingCount = allParticipants.length - 6

  return (
    <div className="flex items-center justify-center">
      <div className="flex -space-x-3">
        {visibleParticipants.map((participant, index) => (
          <Avatar
            key={participant.userId}
            className="h-12 w-12 border-4 border-background shadow-lg relative z-10"
            style={{ zIndex: visibleParticipants.length - index }}
          >
            <AvatarImage
              src={
                participant.user.profileImageUrl
                  ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${participant.user.profileImageUrl}`
                  : "/user.png"
              }
            />
            <AvatarFallback className="text-sm font-semibold">
              {participant.user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div className="h-12 w-12 rounded-full bg-muted border-4 border-background shadow-lg flex items-center justify-center relative z-0">
            <span className="text-sm font-semibold">+{remainingCount}</span>
          </div>
        )}
      </div>
    </div>
  )
}