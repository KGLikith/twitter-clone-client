import { Skeleton } from "@/components/ui/skeleton"

export function ConversationInfoSkeleton() {
  return (
    <div className="p-4 border-b border-gray-800 flex items-center gap-3 w-full">
      <div className="relative h-10 w-10 flex-shrink-0">
        <Skeleton className="absolute top-0 left-0 h-8 w-8 rounded-full border border-black bg-gray-500/20" />
        <Skeleton className="absolute bottom-0 right-0 h-8 w-8 rounded-full border border-black bg-gray-500/20" />
      </div>

      <div className="flex-1 flex justify-between items-center">
        <div className="flex flex-col items-start justify-between">
          <Skeleton className="h-6 w-32 bg-gray-500/20" />
          <Skeleton className="h-5 w-20 mt-1 bg-gray-500/20" />
        </div>
        <Skeleton className="h-7 w-7 rounded-full bg-gray-500/20" />
      </div>
    </div>
  )
}
