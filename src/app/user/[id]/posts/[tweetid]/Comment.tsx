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
import { AiOutlineRetweet } from "react-icons/ai";
import { CiMenuKebab, CiHeart, CiBookmark } from "react-icons/ci";
import {  FaUser, FaRegComment, FaHeart } from "react-icons/fa";
import { GoUpload } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { RiUserUnfollowFill, RiUserFollowFill } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import { FollowUser, UnFollowUser } from "@/actions/follow_unfollow";
import { apolloClient } from "@/clients/api";
import {
  deleteCommentMutation,
  likeCommentMutation,
  unlikeCommentMutation,
} from "@/graphql/mutation/tweet";
import queryclient from "@/clients/queryClient";
import { toast } from "@/hooks/use-toast";

const CommentFile = ({
  comment,
  user,
  tweet,
}: {
  comment: Comment;
  user: User;
  tweet: Tweet;
}) => {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (comment?.likes?.findIndex((el) => el === user?.id) !== -1) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);

  const handleUnfollowUser = useCallback(
    async () => await UnFollowUser(comment.user, () => {}),
    [comment.user]
  );

  const handleFollowUser = useCallback(
    async () => await FollowUser(comment.user, () => {}),
    [comment.user]
  );

  const handleDeleteComment = useCallback(async () => {
    const {errors}=await apolloClient.mutate({
      mutation: deleteCommentMutation,
      variables: {
        commentId: comment.id,
      },
    });
    if(errors && errors[0]) toast({ variant: "destructive", description: errors[0].message, duration: 1000 });
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweet", tweet.id] });
    await queryclient.invalidateQueries({ queryKey: ["curre"] });
  }, [comment]);

  const handleLike = useCallback(async () => {
    const { data, errors } = await apolloClient.mutate({
      mutation: likeCommentMutation,
      variables: {
        commentId: comment.id,
      },
    });
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweet", tweet.id] });
    queryclient.invalidateQueries({ queryKey: ["tweets"] });
    if (data.likeComment) setLiked(true);
    else if (errors) console.log(errors[0]?.message);
  }, [comment]);

  const handledislike = useCallback(async () => {
    const { data, errors } = await apolloClient.mutate({
      mutation: unlikeCommentMutation,
      variables: {
        commentId: comment.id,
      },
    });
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["tweet", tweet.id] });
    queryclient.invalidateQueries({ queryKey: ["tweets"] });
    if (data.unlikeComment) setLiked(false);
    else if (errors) console.log(errors[0]?.message);
  }, [comment]);

  return (
    <>
      <div className="border  border-gray-800 p-4 py-3 pb-2 cursor-pointer hover:bg-[#0a0606] ">
        <div className="grid grid-cols-12 gap-2">
          <Link href={`/user/${comment.user.id}`}>
            <div className="col-span-1  ">
              {comment.user?.profileImageUrl && (
                <Image
                  className="rounded-full"
                  src={comment.user.profileImageUrl}
                  alt="user-image"
                  height={50}
                  width={50}
                />
              )}
            </div>
          </Link>
          <div className="col-span-11 ">
            <div className="flex justify-between items-start">
              <Link href={`/user/${comment.user.id}`}>
                <h5 className="font-bold hover:underline w-fit">
                  {comment.user.firstName} {comment.user.lastName}
                </h5>
              </Link>
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
                            (el) => el?.id === comment.user.id
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
            <p className="text-base">{comment.content}</p>
            <div className="flex justify-between text-xl">
              <div className="rounded-full  p-2 flex justify-center items-center">
                <FaRegComment
                  size={20}
                  className="text-[#959494] hover:text-[#1d9bf0] "
                />
              </div>
              <div className=" rounded-full  p-2 flex justify-center items-center">
                <AiOutlineRetweet
                  size={20}
                  className="text-[#959494] hover:text-[#00ba7c]"
                />
              </div>
              <div className="rounded-full  p-2 gap-2 flex justify-center items-center transition-all hover:text-[#f91880] transform-all">
                {liked ? (
                  <>
                    <div className="text-[#f91880]  flex gap-2  justify-center items-center transition-all">
                      <FaHeart
                        onClick={handledislike}
                        size={20}
                        // className="text-[#f91880]"
                      />
                      <p className=" text-center text-sm ">
                        {comment?.likes?.length ?? 0}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2 justify-center items-center transition-all ">
                      <CiHeart
                        onClick={handleLike}
                        size={20}
                        className="text-[#959494] hover:text-[#f91880] "
                      />
                      <p className="text-[#959494]  text-center text-sm ">
                        {comment?.likes?.length ?? 0}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="rounded-full  p-2 flex justify-center items-center">
                <VscGraph
                  size={20}
                  className="text-[#959494] hover:text-[#1d9bf0]"
                />
              </div>
              <div className="flex gap-2">
                <div className="rounded-full  p-2 flex justify-center items-center">
                  <CiBookmark
                    size={20}
                    className="text-[#959494] hover:text-[#1d9bf0] "
                  />
                </div>
                <div className="rounded-full  p-2 flex justify-center items-center">
                  <GoUpload
                    size={20}
                    className="text-[#959494] hover:text-[#1d9bf0]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentFile;
