import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaHeart, FaRegComment } from "react-icons/fa6";
import { AiOutlineRetweet } from "react-icons/ai";
import { CiBookmark, CiHeart } from "react-icons/ci";
import { VscGraph } from "react-icons/vsc";
import { GoUpload } from "react-icons/go";
import { Tweet, User } from "@/gql/graphql";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { apolloClient } from "@/clients/api";
import {
  likeTweetMutation,
  unlikeTweetMutation,
} from "@/graphql/mutation/tweet";
import queryclient from "@/clients/queryClient";
import { useCurrentUser } from "@/hooks/user";

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

  const handleLike = async () => {
    if (!user){
      return toast({
        variant: "destructive",
        description: "Please login to like the tweet",
        duration: 1000
      });}
    try {
      if (liked) return;
      await apolloClient.mutate({
        mutation: likeTweetMutation,
        variables: { tweetId: tweet.id },
      });
      setLiked(true);
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["tweets"] });
      await queryclient.invalidateQueries({ queryKey: ["currentUserById",tweet.user.id] });
    } catch (error) {
      toast({
        variant: "destructive",
        description: (error as Error).message,
        duration: 1000
      });
    }
  };
  const dislike = async () => {
    if (!user){ 
      return toast({
        variant: "destructive",
        description: "Please login to like the tweet",
      });}
    try {
      await apolloClient.mutate({
        mutation: unlikeTweetMutation,
        variables: { tweetId: tweet.id },
      });
      setLiked(false);
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["tweets"] });
      await queryclient.invalidateQueries({ queryKey: ["currentUserById",tweet.user.id] });

    } catch (error) {
      toast({
        variant: "destructive",
        description: (error as Error).message,
      });
    }
  };
  return (
    <>
      <div className="border  border-gray-800 p-4 cursor-pointer hover:bg-[#0a0606] ">
        <div className="grid grid-cols-12 gap-2">
          <Link href={`/${tweet.user.id}`}>
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
            <Link href={`/${tweet.user.id}`}>
              <h5 className="font-bold hover:underline w-fit">
                {tweet.user.firstName} {tweet.user.lastName}
              </h5>
            </Link>
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
                        onClick={dislike}
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
                      onClick={() => {
                        handleLike();
                      }}
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
    </>
  );
};

export default FeedCard;
