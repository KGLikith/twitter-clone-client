"use client";
import { User } from "@/gql/graphql";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { FollowUser } from "@/actions/follow_unfollow";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const RecommendedUsers = ({ user, currentUser }: { user: User, currentUser: User }) => {
  const queryclient = useQueryClient();
  const [LoadingButton, setLoadingButton] = useState(false);
  const handleFollowUser = async () => { 
    await FollowUser(user.id, setLoadingButton, queryclient);
    queryclient.invalidateQueries({ queryKey: ["currentUserById",currentUser.id] });
  }
  return (
    <>
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
            onClick={handleFollowUser}
          >
            Follow
          </Button>
        </div>
      )}
    </>
  );
};

export default RecommendedUsers;
