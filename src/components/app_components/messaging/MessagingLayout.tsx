"use client"
import type React from "react"
import { useEffect, useState } from "react"
import Sidebar from "@/components/app_components/Sidebar-comp"
import { useGetPaginatedConversations } from "@/hooks/user"
import type { Conversation } from "@/gql/graphql"
import ConversationList from "./conversation-list"
import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"

type Props = {
    children: React.ReactNode
}

export default function MessagingLayout({ children }: Props) {
    const [isClosed, setIsClosed] = useState<boolean | undefined>(false)
    const [isConvoClosed, setIsConvoClosed] = useState<boolean | null>(false)
  const { data: session } = useSession()
    const userId = session?.user?.id

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: conversationsLoading,
    } = useGetPaginatedConversations()
    

    const { conversationId } = useParams()

    const conversationsData = data?.pages.flatMap((page) => page.conversations) || []

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 1280) {
                setIsClosed(true)
            } else {
                setIsClosed(false)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth
            if (width < 1024) {
                setIsConvoClosed(true)
            } else {
                setIsConvoClosed(false)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <>
            <div className="font-sans text-base bg-gradient-to-br from-black via-zinc-900 to-black text-gray-100 h-screen">
                <div className="grid grid-cols-12 h-full w-full xl:pl-12 xl:pr-12">
                    <div className="col-span-2 sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-3 flex justify-center md:justify-end pt-4 p-2">
                        <div className="h-full bg-black/40 text-white w-full sm:w-fit transition-all duration-300">
                            <Sidebar isClosed={isClosed} />
                        </div>
                    </div>

                    <div
                        className="col-span-10 xs:col-span-10 sm:col-span-10 md:col-span-11 lg:col-span-11 xl:col-span-9
                            border-x border-gray-800 h-full overflow-y-auto no-scrollbar 
                            bg-black/30 backdrop-blur-md"
                        id="scrollable-middle"
                    >
                        <div className="h-full flex flex-col overflow-hidden">
                            <div className="h-full w-full grid grid-cols-8">
                                <div
                                    className={`h-full overflow-y-auto ${isConvoClosed && conversationId ? "hidden md:col-span-1 md:flex justify-center items-center" : "col-span-8 md:col-span-7 lg:col-span-3"} border-r border-gray-800`}
                                >
                                    <ConversationList
                                        selectedConversationId={conversationId as string}
                                        isClosed={!!(isConvoClosed && conversationId)}
                                        conversations={conversationsData as Conversation[]}
                                        isLoading={conversationsLoading}
                                        fetchNextPage={fetchNextPage}
                                        hasNextPage={hasNextPage}
                                        isFetchingNextPage={isFetchingNextPage}
                                        // userId={userId as string}
                                    />
                                </div>
                                <div
                                    className={`h-full w-full overflow-y-auto no-scrollbar ${isConvoClosed && conversationId ? "col-span-8 md:col-span-7" : "hidden lg:block lg:col-span-5"}`}
                                >
                                    {children}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
