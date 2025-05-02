"use client";
import { User } from "@/gql/graphql";

import React from "react";
import Link from "next/link";
import FollowButton from "./follow_button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const RecommendedUsers = ({  currentUser, recommendedUsers }: {  currentUser: User, recommendedUsers: User[] }) => {
  
  return (
    <>
      {recommendedUsers && (
        <div className="p-3 border flex flex-col border-gray-800 rounded-2xl space-y-2">
          <h1 className="font-bold text-xl text-center">
            You might know?!
          </h1>
          <div className="space-y-1">
            {recommendedUsers.map((rec_user) => (
              <div
                key={rec_user?.id}
                className="flex gap-2 py-1 md:px-3 items-center cursor-pointer transition-all w-full rounded-full hover:bg-zinc-900"
              >
                <Link href={`/${rec_user?.id}`}>
                  <Avatar className="h-8 w-8 border-2 border-zinc-700 rounded-full overflow-hidden">
                    <AvatarImage
                      src={rec_user.profileImageUrl ? `${process.env.NEXT_PUBLIC_CDN_URL || ""}${rec_user.profileImageUrl}` : "/user.png"}
                      alt="Profile"
                      className="object-cover"
                    />
                  </Avatar>
                </Link>
                <div className="hidden sm:flex justify-between w-full items-center">
                  <div>
                    <Link href={`/user/${rec_user?.id}`}>
                      <h3 className="text-white text-md hover:underline">
                        {rec_user?.name}
                      </h3>
                    </Link>
                    <h3 className="text-gray-400 text-sm">
                      @{rec_user?.userName}
                    </h3>
                  </div>
                  <FollowButton rec_userId={rec_user.id} currentUserId={currentUser.id} />
                </div>
              </div>
            ))}
            {recommendedUsers.length === 0 && (
              <div className="flex justify-center items-center text-gray-400 text-sm my-4">
                Sorry, we don't have any recommendations for you yet.
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
};

export default RecommendedUsers;
