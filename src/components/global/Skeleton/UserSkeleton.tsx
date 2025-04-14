import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const UserSkel = () => {
    return (
        <div className='m-4'>
            <div className="flex flex-col space-y-3 ">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[100px] w-full" />
                <Skeleton className="h-[125px] w-full" />
            </div>
        </div>
    )
}

export default UserSkel