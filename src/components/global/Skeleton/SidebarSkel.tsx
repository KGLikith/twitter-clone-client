import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const SideabrSkel = ({ isClosed = false }: { isClosed?: boolean }) => {
  if (isClosed) {
    return (
      <div className="flex flex-col h-full gap-4 py-4 justify-start items-center w-[70px]">
        <Skeleton className="h-10 w-10 rounded-full bg-gray-500/20 mb-4" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-full bg-gray-500/20" />
        ))}
        <div className="mt-auto mb-4">
          <Skeleton className="h-8 w-8 rounded-full bg-gray-500/20" />
        </div>
      </div>
    )
  }

  return (
    <div className="m-4 w-full justify-between flex flex-col">
      <div className="flex flex-col space-y-3 w-full px-2 ">
        <Skeleton className="h-[70px] w-full rounded-xl mb-4" />
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-[30px] w-full" />
        ))}
      </div>
      <Skeleton className="h-[30px] w-full" />
    </div>
  )
}

export default SideabrSkel
