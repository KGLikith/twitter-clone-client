import React from 'react'
import { Skeleton } from '../ui/skeleton'

const Skel = () => {
  return (
    <div className='m-4'>
        <div className="flex flex-col space-y-3 ">
        <Skeleton className="h-[125px] w-full rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  )
}

export default Skel