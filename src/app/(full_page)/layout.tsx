import React from 'react'
import { TokenSyncer } from '../tokenSycer'
import IncomingCallNotification from '@/components/app_components/call/incomingCall'

type Props = {
    children: React.ReactNode
}

export default function layout({ children }: Props) {
    return (
        <>
            <TokenSyncer />
            <div className='relative font-sans text-base bg-gradient-to-br from-black via-zinc-900 to-black text-gray-100 h-screen'>
                {children}
                <IncomingCallNotification />

            </div>
        </>
    )
}