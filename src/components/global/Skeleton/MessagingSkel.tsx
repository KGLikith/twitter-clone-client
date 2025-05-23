import { Skeleton } from "@/components/ui/skeleton"

export function MessageSkeleton() {
  return (
    <div className="flex flex-col p-4 pt-2 space-y-reverse space-y-4 justify-between h-full">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className={`flex mb-2 ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
        >
          {i % 2 !== 0 && (
            <Skeleton className="h-10 w-10 rounded-full mr-2 flex-shrink-0 self-end mb-1 bg-gray-500/20" />
          )}

          <div className={`max-w-[75%] ${i % 2 !== 0 && i > 0 && i % 3 !== 0 ? "" : ""}`}>
            {i % 2 !== 0 && (
              <Skeleton className="h-3 w-16 mb-1 ml-1 bg-gray-500/20" />
            )}

            <Skeleton
              className={`h-8 w-36 rounded-lg ${i % 2 === 0 ? "rounded-br-none bg-gray-500/20" : "rounded-bl-none bg-gray-500/20"}`}
            />

            <div className={`mt-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
              <Skeleton className="h-3 w-10 inline-block bg-gray-500/20" />
            </div>
          </div>
        </div>
      ))}
      <div className="flex mb-2 justify-between gap-3">
        <Skeleton className="h-[40px] w-11/12 rounded-xl bg-gray-500/20" />
        <Skeleton className="h-[40px] w-1/12 rounded-xl bg-gray-500/20" />
      </div>
    </div>
  )
}
