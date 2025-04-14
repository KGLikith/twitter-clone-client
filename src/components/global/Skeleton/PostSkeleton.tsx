import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const PostSkel = () => {
    return (
        <div className='m-4'>
            <div className="flex flex-col space-y-3 ">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[275px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-[125px] w-full" />
                <Skeleton className="h-[125px] w-full" />
                <Skeleton className="h-[125px] w-full" />
            </div>
        </div>
    )
}

export default PostSkel