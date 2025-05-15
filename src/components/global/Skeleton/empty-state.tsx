import { MessageCircle } from 'lucide-react'

interface EmptyStateProps {
  type: "conversations" | "messages"
}

export function EmptyState({ type }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
        <MessageCircle className="h-8 w-8 text-orange-500" />
      </div>
      
      {type === "conversations" ? (
        <>
          <h3 className="text-lg font-medium text-white mb-2">No conversations yet</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Start a new conversation by clicking the plus button above
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium text-white mb-2">No messages yet</h3>
          <p className="text-sm text-gray-400 max-w-xs">
            Start the conversation by sending a message below
          </p>
        </>
      )}
    </div>
  )
}
