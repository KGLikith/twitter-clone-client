import TwitterLayout from '@/components/layout/TwitterLayout'
import React from 'react'
import { TokenSyncer } from '../tokenSycer'

type Props = {
    children: React.ReactNode
}

export default function layout({ children }: Props) {
    return (
        <>
            <TokenSyncer />
            <TwitterLayout>
                {children}
            </TwitterLayout>

        </>
    )
}