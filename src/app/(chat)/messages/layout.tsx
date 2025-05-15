import { TokenSyncer } from '@/app/tokenSycer'
import MessagingLayout from '@/components/app_components/messaging/MessagingLayout'
import React from 'react'

type Props = {
    children: React.ReactNode
}

export default function layout({ children }: Props) {
    
    return (
        <>
            <TokenSyncer />
            <MessagingLayout>
                {children}
            </MessagingLayout>
        </>
    )
}