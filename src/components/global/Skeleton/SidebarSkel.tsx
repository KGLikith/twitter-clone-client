import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const SideabrSkel = () => {
    return (
        <div className='m-4 w-full justify-between flex flex-col'>
            <div className="flex flex-col space-y-3 w-full px-2 ">
                <Skeleton className="h-[70px] w-full rounded-xl mb-4" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
                <Skeleton className="h-[30px] w-full" />
            </div>
            <Skeleton className="h-[30px] w-full" />
        </div>
    )
}

export default SideabrSkel