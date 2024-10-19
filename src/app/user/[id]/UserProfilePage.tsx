"use client";
import { FollowUser, UnFollowUser } from "@/actions/follow_unfollow";
import FeedCard from "@/components/normal_comp/FeedCard";
import Skel from "@/components/normal_comp/Skeleton";
import { Button } from "@/components/ui/button";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUser, useCurrentUserById } from "@/hooks/user";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

interface UserProfilePageProps {
  id: string;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ id }) => {
  const router = useRouter();
  const { user: USER,isLoading } = useCurrentUser();
  const { user: currentUser } = useCurrentUserById(id);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();
  const [buttonLoading, setButtonLoading] = useState(false);

  const amIFollowing = useMemo(() => {
    const ind = USER?.following?.findIndex((el) => {
      return el?.id === user?.id;
    });
    if (ind == null) return false;
    return ind >= 0;
  }, [USER?.following, user]);

  useEffect(() => {
    if(!USER  && !isLoading) router.push('/not_authorised')
    if(!isLoading) {
      if(USER?.id === id) setUser(USER as User)
    }
    if (currentUser !== undefined) {
      setUser(currentUser as User);
      setLoading(false);
    }
  }, [currentUser, USER,router,isLoading]);

  const handleFollowUser = useCallback(()=>FollowUser(user, setButtonLoading), [
    user,
  ]);

  const handleunFollowUser = useCallback(()=>UnFollowUser(user, setButtonLoading), [
    user,
  ]);

  if (loading || isLoading) {
    return <Skel />;
  }
  if(!USER || USER==undefined) return null
  if (!user) return <h1 className="text-center h-full flex justify-center items-center">Page Not Done Yet or User Not Found</h1>;

  return (
    <>
      <div>
        <nav className="border flex items-center gap-8 px-3 py-1">
          <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-3 transition-all" onClick={()=>{
            router.push('/')}}>
            <FaArrowLeftLong size={15}  />
          </div>
          <div>
            <h1 className="font-bold text-xl">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-gray-500">
              {user.tweets?.length ?? 0}{" "}
              {user.tweets && user.tweets.length > 1 ? "posts" : "post"}
            </p>
          </div>
        </nav>
        <div className="p-4 border space-y-3">
          {user?.profileImageUrl && (
            <Image
              src={user.profileImageUrl}
              alt="Profile Image"
              className="rounded-full"
              width={100}
              height={100}
              quality={75}
              priority={true}
              onError={(err) => {
                console.log(err);
              }}
            />
          )}
          <div>
            <h1 className="text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-500">
              @{user?.firstName}
              {user?.lastName}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-gray-500">
              <span className="flex gap-1">
                <p className="font-bold text-white">{user.following?.length}</p>
                Following
              </span>
              <span className="flex gap-1">
                <p className="font-bold text-white">
                  {user.followers?.length || 0}
                </p>
                {user.followers?.length && user.followers?.length>1 ? "Followers" : "Follower"}
              </span>
            </div>
            {USER?.id !== user.id ? (
              <>
                {buttonLoading ? (
                  <Button disabled className="rounded-full font-bold px-4 py-1">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <>
                    {amIFollowing ? (
                      <div>
                        <Button
                          variant={"default"}
                          className="rounded-full font-bold px-4 py-1"
                          onClick={handleunFollowUser}
                        >
                          Unfollow
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant={"default"}
                          className="rounded-full font-bold px-4 py-1"
                          onClick={handleFollowUser}
                        >
                          Follow
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {user?.tweets &&
          user?.tweets
            ?.filter((tweet): tweet is Tweet => tweet !== null)
            .map((tweet: Tweet) => {
              return <FeedCard key={tweet.id} tweet={tweet} />;
            })}
      </div>
    </>
  );
};

export default UserProfilePage;
