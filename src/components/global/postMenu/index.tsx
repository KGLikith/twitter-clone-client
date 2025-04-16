import { Comment, Tweet } from '@/gql/graphql'
import Link from 'next/link'
import React from 'react'
import { AiOutlineRetweet } from 'react-icons/ai'
import { CiBookmark, CiHeart } from 'react-icons/ci'
import { FaHeart, FaRegComment } from 'react-icons/fa6'
import { GoUpload } from 'react-icons/go'
import { VscGraph } from 'react-icons/vsc'

type Props = {
    tweet?: Tweet
    userId?: string
    comment?: Comment
    liked: boolean
    handleLike: () => Promise<void>
    handledislike: () => Promise<void>
    isAnimating: boolean
    handleAnimationEnd: () => void
}

export default function PostMenu({ comment, tweet, userId, liked, handleLike, handledislike, handleAnimationEnd, isAnimating }: Props) {
    const iconColor = "text-gray-500"
    const likedColor = "text-pink-500"
    const likedHoverColor = "text-pink-300"
    return (
        <div className="flex justify-between my-2 text-lg">
            <Link href={userId ? (tweet ? `/posts/${tweet?.id}` : "#") : "not_authorised"}>
                <div className="rounded-full gap-2 p-2 flex justify-center items-center">
                    <FaRegComment size={16} className={`${iconColor} hover:text-orange-500`} />
                    <p className="text-center text-xs text-gray-500">{tweet?.comments?.length || 0}</p>
                </div>
            </Link>
            <div className="rounded-full p-2 flex justify-center items-center">
                <AiOutlineRetweet size={16} className={`${iconColor} hover:text-orange-500`} />
            </div>
            <div className="rounded-full p-2 gap-2 flex justify-center items-center">
                {liked ? (
                    <>
                        <div className={`${likedColor} flex gap-2 justify-center items-center`}>
                            <div
                                className={`heart-icon ${isAnimating ? "heart-pop" : ""}`}
                                onAnimationEnd={handleAnimationEnd}
                            >
                                <FaHeart
                                    onClick={handledislike}
                                    size={18}
                                    className={`${likedColor} hover:${likedHoverColor}`}
                                />
                            </div>
                            <p className="text-center text-xs">{tweet ? tweet.likes?.length || 0 : comment?.likes?.length || 0}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2 justify-center items-center">
                            <div
                                className={`heart-icon ${isAnimating ? "heart-empty-pop" : ""}`}
                                onAnimationEnd={handleAnimationEnd}
                            >
                                <CiHeart onClick={handleLike} size={18} className={`${iconColor} hover:text-pink-500`} />
                            </div>
                            <p className={`${iconColor} text-center text-xs`}>{tweet ? tweet.likes?.length || 0 : comment?.likes?.length || 0}</p>
                        </div>
                    </>
                )}
            </div>
            <div className="rounded-full p-2 flex justify-center items-center">
                <VscGraph size={16} className={`${iconColor} hover:text-orange-500`} />
            </div>
            <div className="flex gap-2">
                <div className="rounded-full p-2 flex justify-center items-center">
                    <CiBookmark size={16} className={`${iconColor} hover:text-orange-500`} />
                </div>
                <div className="rounded-full p-2 flex justify-center items-center">
                    <GoUpload size={16} className={`${iconColor} hover:text-orange-500`} />
                </div>
            </div>
        </div>
    )
}