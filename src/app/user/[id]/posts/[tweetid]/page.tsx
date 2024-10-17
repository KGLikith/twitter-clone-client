"use client";
import Skel from "@/components/normal_comp/Skeleton";
import { Tweet, User } from "@/gql/graphql";
import { useGetTweet } from "@/hooks/tweets";
import { useCurrentUser, useCurrentUserById } from "@/hooks/user";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  FaArrowLeftLong,
  FaHeart,
  FaRegComment,
  FaUser,
} from "react-icons/fa6";
import { UnFollowUser, FollowUser } from "@/actions/follow_unfollow";
import { like, dislike } from "@/actions/liket_dislike";

import { AiOutlineRetweet } from "react-icons/ai";
import { CiMenuKebab, CiHeart, CiBookmark } from "react-icons/ci";
import { GoUpload } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { RiUserUnfollowFill, RiUserFollowFill } from "react-icons/ri";
import { VscGraph } from "react-icons/vsc";
import Image from "next/image";
import { deletePost } from "@/actions/deletePost";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface TweetPageProps {
  params: {
    id: string;
    tweetid: string;
  };
}

const Page: NextPage<TweetPageProps> = ({ params }) => {
  const { user: USER } = useCurrentUser();
  const { id, tweetid } = params;
  const router = useRouter();
  const { tweet: currentTweet } = useGetTweet(tweetid);
  const [loading, setLoading] = useState(true);
  const [tweet, setTweet] = useState<Tweet | undefined>();
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    if (USER == undefined && !loading) {
      router.push("/not_authorised");
    }
    if (currentTweet !== undefined) {
      setTweet(currentTweet as Tweet);
      if (currentTweet?.likes?.includes((USER as User)?.id)) setLiked(true);
      else setLiked(false);
      setLoading(false);
    }
    if (USER !== undefined) {
      setUser(USER as User);
      if (currentTweet?.likes?.includes((USER as User)?.id)) setLiked(true);
      else setLiked(false);
    }
  }, [currentTweet, USER]);

  const handleLike = useCallback(
    async () => await like(user as User,tweet as Tweet, setLiked,liked),
    [user, tweet]
  );

  const handledislike = useCallback(
    async () => await dislike(user as User, tweet as Tweet, setLiked,liked),
    [user, tweet]
  );

  const handleDeletePost = useCallback(
    async () => await deletePost(tweet as Tweet),
    [tweet]
  );

  const handleUnfollowUser = useCallback(
    async () => await UnFollowUser((tweet as Tweet).user, () => {}),
    [(tweet as Tweet)?.user]
  );

  const handleFollowUser = useCallback(
    async () => await FollowUser((tweet as Tweet).user, () => {}),
    [(tweet as Tweet)?.user]
  );

  if (loading) {
    return <Skel />;
  }

  if (!tweet)
    return (
      <h1 className="text-center h-full flex justify-center items-center">
        Tweet Not Found
      </h1>
    );

  return (
    <div>
      <nav className="border flex items-center gap-8 px-3 py-2">
        <div
          className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-3 transition-all"
          onClick={() => {
            router.push("/");
          }}
        >
          <FaArrowLeftLong size={15} />
        </div>
        <div>
          <h1 className="font-bold text-xl">Post</h1>
        </div>
      </nav>
      <div className="border border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606] ">
        <div className="grid grid-cols-12 gap-2">
          <Link href={`user/${tweet.user.id}`}>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="p-1 py-2 rounded-full hover:bg-gray-900 hover:text-[#1d9bf0]">
                    <CiMenuKebab />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-40  bg-black "
                  style={{
                    boxShadow:
                      "rgba(255, 255, 255, 0.2) 0px 0px 15px, rgba(255, 255, 255, 0.15) 0px 0px 3px 1px",
                  }}
                >
                  <DropdownMenuGroup>
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
              <div>
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
      </div>
    </div>
  );
};
export default Page;
