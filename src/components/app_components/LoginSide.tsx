"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useCurrentUser, useGetRecommendedUsers } from "@/hooks/user";
import { User } from "@/gql/graphql";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import Skel from "../global/Skeleton/Skeleton";
import RecommendedUsers from "@/components/_components/RecommendedUsers";
import { Button } from "@/components/ui/button"; // Assuming shadcn/ui Button
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Login = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();
  const { user: currentUser } = useCurrentUser();
  const { data } = useGetRecommendedUsers();

  const recommendedUsers = data?.pages.flatMap((page) => page.users) ?? [];

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser as User);
      setLoading(false);
    }
  }, [currentUser]);

  const handleGoogleSignIn = useCallback(async () => {
    toast.info("Google Sign-In not wired yet", { duration: 2000 });
  }, []);

  if (loading) {
    return (
      <div>
        <Skel />
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <div className="p-4 pr-5 border flex flex-col border-gray-800 rounded-2xl space-y-4">
          <h1 className="font-bold text-xl text-center">Join X Today</h1>

          {/* Google Sign In Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 bg-white text-black hover:text-gray-900 hover:bg-gray-300"
          >
            <FcGoogle className="h-5 w-5" />
            Continue with Google
          </Button>

          {/* Divider text */}
          <p className="text-center text-xs text-gray-500">
            Don't want to use Google?{" "}
            <Link
              href="/auth/sign-up"
              className="font-bold text-blue-500 hover:underline"
            >
              Sign up with Email
            </Link>
          </p>

          {/* Already have an account */}
          <p className="text-center text-xs text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-bold text-blue-500 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      ) : (
        <>
          <RecommendedUsers recommendedUsers={recommendedUsers as User[]} currentUser={currentUser as User} />
        </>
      )}
    </>
  );
};

export default Login;
