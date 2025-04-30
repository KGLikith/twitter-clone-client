"use client";
import { User } from "@/gql/graphql";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { FollowUser } from "@/actions/follow_unfollow";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Avatar, AvatarImage } from "../ui/avatar";

const RecommendedUsers = ({  currentUser, recommendedUsers }: {  currentUser: User, recommendedUsers: User[] }) => {
  const queryclient = useQueryClient();
  const [LoadingButton, setLoadingButton] = useState(false);
  const handleFollowUser = async (userId: string) => {
    await FollowUser(currentUser.id, userId, setLoadingButton, queryclient);
    queryclient.invalidateQueries({ queryKey: ["currentUserById", currentUser.id] });
  }
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
                className="flex gap-2 py-1 md:px-3 items-center cursor-pointer transition-all w-full rounded-full"
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
                  <div>
                    {LoadingButton ? (
                      <Button
                        disabled
                        variant={"ghost"}
                        className="rounded-full font-bold px-4 py-1 flex justify-center items-center"
                      >
                        <Loader2 className=" h-4 w-4 animate-spin text-center" />
                      </Button>
                    ) : (
                      <div>
                        <Button
                          variant={"ghost"}
                          className="rounded-full font-bold px-4"
                          onClick={()=> handleFollowUser(rec_user.id) }
                        >
                          Follow
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recommendedUsers.length === 0 && (
              <div className="flex justify-center items-center text-gray-400 text-sm">
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
