import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Comment, Tweet, User } from "@/gql/graphql";
import { CiMenuKebab } from "react-icons/ci";
import { FaUser } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { RiUserUnfollowFill, RiUserFollowFill } from "react-icons/ri";
import { FollowUser, UnFollowUser } from "@/actions/follow_unfollow";
import { apolloClient } from "@/clients/api";
import {
  deleteCommentMutation,
  likeCommentMutation,
  unlikeCommentMutation,
} from "@/graphql/mutation/tweet";
import PostMenu from "@/components/global/postMenu";
import { formatTweetContent } from "@/components/global/postMenu/handleSelect";
import { useQueryClient } from "@tanstack/react-query";
import { formatRelativeTime, runTypedMutation } from "@/actions/helperFxns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { bookmark, unBookmark } from "@/actions/bookmarks";
import { dislikeComment, likeComment } from "@/actions/like_dislike";
import { toast } from "sonner";

const CommentFile = ({
  comment,
  user,
  tweet,
  isBookmark
}: {
  comment: Comment;
  user: User;
  tweet: Tweet;
  isBookmark?: boolean;
}) => {
  const queryclient = useQueryClient()

  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [isBookmarkAnimating, setIsBookmarkAnimating] = useState(false)

  const handleAnimationEnd = () => {
    setIsLikeAnimating(false)
  }
  useEffect(() => {
    setLiked(comment?.likes?.findIndex((el) => el === user?.id) !== -1);
    setBookmarked(user?.bookmark?.bookmarks ? (user.bookmark.bookmarks?.findIndex((el) => el?.commentId === comment.id) !== -1) : false || false)
  }, [comment, user]);

  const handleUnfollowUser = useCallback(
    async () => await UnFollowUser(user.id,comment.user.id, () => { }, queryclient),
    [comment.user]
  );

  const handleFollowUser = useCallback(
    async () => await FollowUser(user.id,comment.user.id, () => { }, queryclient),
    [comment.user]
  );

  const handleDeleteComment = useCallback(async () => {
    const { errors, data } = await apolloClient.mutate({
      mutation: deleteCommentMutation,
      variables: {
        commentId: comment.id,
      },
    });
    if (errors && errors[0] || !data?.deleteComment) toast("Error deleting the comment",{ description:"Please try again later." , duration: 1000 });
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweet", tweet.id] });
    await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
  }, [comment, tweet.id]);

  const handleLike = useCallback(async () => {
    await likeComment(comment.id, comment.user.id, tweet.id, setLiked, liked, queryclient)
  }, [comment, tweet.id, liked]);

  const handledislike = useCallback(async () => {
    await dislikeComment(comment.id, tweet.id, setLiked, liked, queryclient)
  }, [comment, tweet.id, liked]);

  const handleBookmark = useCallback(async () => await bookmark(undefined, comment.id, user.id, setBookmarked, bookmarked, queryclient), [comment, user, bookmarked])

  const handleRemoveBookmark = useCallback(async () => await unBookmark(undefined, comment.id, user.id, setBookmarked, bookmarked, queryclient), [comment, user, bookmarked])

  return (
    <>
      <div className="border  border-gray-800 p-4 py-3 pb-0 cursor-pointer hover:bg-[#0a0606] ">
        <div className="grid grid-cols-12 gap-2">
          <Link href={`/user/${comment.user.id}`}>
            <div className="col-span-1  ">
              <Avatar className="h-8 w-8 border-2 border-zinc-700 rounded-full overflow-hidden">
                <AvatarImage
                  src={comment.user.profileImageUrl?`${process.env.NEXT_PUBLIC_CDN_URL || ""}${comment.user.profileImageUrl}` : "/user.png"}
                  alt="Profile"
                  className="object-cover"
                />
                <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl flex items-center justify-center">
                  {user.name.slice(1)[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>
          <div className="col-span-11 ">
            <div className="flex flex-col gap-2">
              <div className="flex flex-col ">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <Link className="flex justify-center items-center gap-2" href={user ? `/user/${tweet.user.id}` : "/not_authorised"}>
                      <h5 className="font-bold hover:underline w-fit mt-1">
                        {comment.user.name}
                      </h5>
                      <p className="text-sm text-gray-500">@{comment.user.userName}</p>
                    </Link>
                    <span className="text-gray-500">·</span>
                    <div className="text-xs text-gray-500 ">{formatRelativeTime(comment.createdAt)}</div>
                  </div>
                  {user && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div className="p-1 rounded-full hover:bg-gray-900 hover:text-[#1d9bf0]">
                          <CiMenuKebab />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-36 bg-black "
                        style={{
                          boxShadow:
                            "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px",
                        }}
                      >
                        <DropdownMenuGroup>
                          <Link href={`/user/${comment.user.id}`}>
                            <DropdownMenuItem className="flex justify-between items-center px-4 hover:bg-gray-900">
                              <FaUser className="mr-2 h-4 w-4" />
                              <span>Profile</span>
                            </DropdownMenuItem>
                          </Link>
                          {user?.id === comment.user.id ? (
                            <DropdownMenuItem
                              className="flex justify-between items-center px-4 hover:bg-gray-900"
                              onClick={handleDeleteComment}
                            >
                              <MdDelete className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          ) : (
                            <>
                              {user?.following?.findIndex(
                                (el) => el === comment.user.id
                              ) !== -1 ? (
                                <DropdownMenuItem
                                  className="flex justify-between items-center px-4 hover:bg-gray-900"
                                  onClick={handleUnfollowUser}
                                >
                                  <RiUserUnfollowFill className="mr-2 h-4 w-4" />
                                  <span>Unfollow</span>
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  className="flex justify-between items-center px-4 hover:bg-gray-900"
                                  onClick={handleFollowUser}
                                >
                                  <RiUserFollowFill className="mr-2 h-4 w-4" />
                                  <span>Follow</span>
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div>
                  {isBookmark && (
                    <Link href={`/posts/${tweet.id}`} className="text-sm text-gray-500 hover:underline flex gap-1">
                      Replying to <p className="text-orange-500 hover:underline">@{tweet.user.userName}</p>
                    </Link>
                  )}
                </div>
              </div>
              <div className="break-words whitespace-pre-wrap text-base text-zinc-300 font-sans" dangerouslySetInnerHTML={{ __html: formatTweetContent(comment.content) }} />
              {comment.mediaUrl && comment.mediaType === "image" && (
                <div className="relative w-full">
                  <div className="group relative w-fit">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_CDN_URL}${comment.mediaUrl}` || "/placeholder.svg"}
                      alt="tweet-media"
                      width={300}
                      height={300}
                      className="rounded-lg"
                      unoptimized
                    />
                  </div>
                </div>
              )}
              {comment.mediaUrl && comment.mediaType === "video" && (
                <div className="relative w-full">
                  <div className="group relative w-fit">
                    <video controls className="w-full max-w-md rounded-lg">
                      <source src={`${process.env.NEXT_PUBLIC_CDN_URL}${comment.mediaUrl}`} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}

              <PostMenu
                userId={user.id}
                comment={comment}
                isBookmarkAnimating={isBookmarkAnimating}
                isLikeAnimating={isLikeAnimating}
                liked={liked}
                bookmarked={bookmarked}
                handleUnBookmark={handleRemoveBookmark}
                handleBookmark={handleBookmark}
                handleLike={handleLike}
                handledislike={handledislike}
                handleAnimationEnd={handleAnimationEnd}
              />

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentFile;
