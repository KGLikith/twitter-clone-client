import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'


export default function SettingsSkel() {
    return (
        <div className='m-4 h-full'>
            <div className="flex flex-col space-y-3 h-full">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-full w-full " />
            </div>
        </div>
    )
}