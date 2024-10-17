import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { FaHeart, FaRegComment, FaUser } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiBookmark, CiHeart, CiMenuKebab } from "react-icons/ci";
import { VscGraph } from "react-icons/vsc";
import { GoUpload } from "react-icons/go";
import { Tweet, User } from "@/gql/graphql";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  deleteTweetMutation,
  likeTweetMutation,
  unlikeTweetMutation,
} from "@/graphql/mutation/tweet";
import queryclient from "@/clients/queryClient";
import { useCurrentUser } from "@/hooks/user";
import { MdDelete } from "react-icons/md";
import {
  RiUserFollowFill,
  RiUserFollowLine,
  RiUserUnfollowFill,
} from "react-icons/ri";
import { FollowUser, UnFollowUser } from "@/actions/follow_unfollow";
import { dislike, like } from "@/actions/liket_dislike";
import { deletePost } from "@/actions/deletePost";

interface FeedCardProps {
  tweet: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = ({ tweet }) => {
  const { user: currentUser } = useCurrentUser();
  const [user, setUser] = useState<User | undefined>();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser as User);
      if (tweet.likes?.includes((currentUser as User)?.id)) setLiked(true);
      else setLiked(false);
    }
  }, [currentUser, tweet]);

  const handleLike = useCallback(
    async () => await like(user as User, tweet, setLiked, liked),
    [user, tweet]
  );

  const handledislike = useCallback(
    async () => await dislike(user as User, tweet, setLiked, liked),
    [user, tweet]
  );

  const handleDeletePost = useCallback(
    async () => await deletePost(tweet),
    [tweet]
  );

  const handleUnfollowUser = useCallback(
    async () => await UnFollowUser((tweet as Tweet).user, () => {}),
    [tweet.user]
  );

  const handleFollowUser = useCallback(
    async () => await FollowUser((tweet as Tweet).user, () => {}),
    [tweet.user]
  );

  return (
    <>
      <div className="border  border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606] ">
        <div className="grid grid-cols-12 gap-2">
          <Link href={`/user/${tweet.user.id}`}>
            <div className="col-span-1  ">
              {tweet.user?.profileImageUrl && (
                <Image
                  className="rounded-full"
                  src={tweet.user.profileImageUrl}
                  alt="user-image"
                  height={50}
                  width={50}
                />
              )}
            </div>
          </Link>
          <div className="col-span-11 space-y-3">
            <div className="flex justify-between items-center">
              <Link href={`/user/${tweet.user.id}`}>
                <h5 className="font-bold hover:underline w-fit">
                  {tweet.user.firstName} {tweet.user.lastName}
                </h5>
              </Link>
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="p-1 py-2 rounded-full hover:bg-gray-900 hover:text-[#1d9bf0]">
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
                      <Link href={`/user/${tweet.user.id}/posts/${tweet.id}`}>
                        <DropdownMenuItem className="flex justify-between items-center px-4 hover:bg-gray-900">
                          <FaUser className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                      </Link>

                      <Link href={`/user/${tweet.user.id}`}>
                        <DropdownMenuItem className="flex justify-between items-center px-4 hover:bg-gray-900">
                          <FaUser className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                      </Link>
                      {user?.id === tweet.user.id ? (
                        <DropdownMenuItem
                          className="flex justify-between items-center px-4 hover:bg-gray-900"
                          onClick={handleDeletePost}
                        >
                          <MdDelete className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      ) : (
                        <>
                          {user?.following?.findIndex(
                            (el) => el?.id === tweet.user.id
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
            <p>{tweet.content}</p>
            {tweet.imageUrl && (
              <div>
                <Image
                  src={tweet.imageUrl}
                  alt="tweet-image"
                  width={400}
                  height={400}
                  className="rounded-lg"
                />
              </div>
            )}
            <div className="flex justify-between mt-4 text-xl">
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
              <div className="rounded-full  p-2 gap-2 flex justify-center items-center transition-all hover:text-[#f91880]">
                {liked ? (
                  <>
                    <div className="text-[#f91880]  flex gap-2  justify-center items-center transition-all">
                      <FaHeart
                        onClick={handledislike}
                        size={20}
                        // className="text-[#f91880]"
                      />
                      <p className=" text-center text-sm ">
                        {tweet.likes?.length | 0}
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
                        {tweet.likes?.length | 0}
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

export default FeedCard;
