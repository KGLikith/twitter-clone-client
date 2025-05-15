import { Skeleton } from "@/components/ui/skeleton"

export function ConversationSkeleton({ isClosed = false }: { isClosed?: boolean }) {
  if (isClosed) {
    return (
      <div className="flex flex-col h-full  gap-4 py-4 justify-start items-center w-16">
        <Skeleton className="h-12 w-12 mb-10 rounded-full bg-gray-500/20" />
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 rounded-full bg-gray-500/20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3 p-4 gap-6">
      <Skeleton className="h-[50px] w-full rounded-xl bg-gray-500/20" />
      <Skeleton className="h-[50px] w-full rounded-xl bg-gray-500/20" />
      <div className="flex flex-col gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 bg-gray-500/20" />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-6 w-24 bg-gray-500/20" />
                <Skeleton className="h-4 w-12 bg-gray-500/20" />
              </div>
              <Skeleton className="h-4 w-full bg-gray-500/20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
