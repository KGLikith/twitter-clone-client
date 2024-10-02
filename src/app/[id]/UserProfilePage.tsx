"use client";
import FeedCard from "@/components/normal_comp/FeedCard";
import Skel from "@/components/normal_comp/Skeleton";
import { Tweet, User } from "@/gql/graphql";
import { useCurrentUserById } from "@/hooks/user";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

interface UserProfilePageProps {
  id: string;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ id }) => {
  const { user: currentUser } = useCurrentUserById(id);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser as User);
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <Skel />;
  }
  if (!user) return <h1>User Not Found</h1>;

  return (
    <>
      <div>
        <nav className="border flex items-center gap-8 px-3 py-1">
          <div className="hover:border hover:bg-gray-900 hover:border-none rounded-full p-3 transition-all">
            <FaArrowLeftLong size={15} />
          </div>
          <div>
            <h1 className="font-bold text-xl">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-sm text-gray-500"> 10 posts posts</p>
          </div>
        </nav>
        <div className="p-4 border">
          {user && user.profileImageUrl && (
            <Image
              src={user.profileImageUrl}
              alt="Profile Image"
              className="rounded-full"
              width={100}
              height={100}
            />
          )}
          <h1 className="text-xl font-bold">
            {user?.firstName} {user?.lastName}
          </h1>
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
