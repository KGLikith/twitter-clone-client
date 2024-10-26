"use client";
import Skel from "@/components/normal_comp/Skeleton";
import { Tweet, User } from "@/gql/graphql";
import { useGetTweet } from "@/hooks/tweets";
import { useCurrentUser } from "@/hooks/user";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import {  useEffect, useState } from "react";
import {
  FaArrowLeftLong,
} from "react-icons/fa6";
import TweetPage from "./tweetPage";

interface TweetPageProps {
  params: {
    id: string;
    tweetid: string;
  };
}

const Page: NextPage<TweetPageProps> = ({ params }) => {
  const { user: USER,isLoading } = useCurrentUser();
  const {  tweetid } = params;
  const router = useRouter();
  const { tweet: currentTweet } = useGetTweet(tweetid, USER?.id);
  const [loading, setLoading] = useState(true);
  const [tweet, setTweet] = useState<Tweet | undefined>();
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    if (USER == undefined && !isLoading) {
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
  }, [currentTweet, USER,router,loading]);


  if (loading) {
    return <Skel />;
  }
  if(!user) return null

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
      <TweetPage tweet={tweet as Tweet} user={user as User} liked={liked} setLiked={setLiked} />
    </div>
  );
};
export default Page;
