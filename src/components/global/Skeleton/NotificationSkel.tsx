import React from 'react'
import { Skeleton } from '../../ui/skeleton'

const NotificalSkel = () => {
    return (
        <div className='m-4'>
            <div className="flex flex-col space-y-3 ">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-[100px] w-full rounded-xl" />
                <Skeleton className="h-[125px] w-full" />
                <Skeleton className="h-[75px] w-full" />
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[125px] w-full" />
            </div>
        </div>
    )
}

export default NotificalSkel