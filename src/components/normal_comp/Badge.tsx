"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@/gql/graphql";
import { useCurrentUser } from "@/hooks/user";
import { CiMenuKebab } from "react-icons/ci";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { ToastAction } from "../ui/toast";
import { toast } from "@/hooks/use-toast";
import { apolloClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import queryclient from "@/clients/queryClient";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Badge = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | undefined>();
  const { user: currentUser } = useCurrentUser();
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser((currentUser as User) || undefined);
    }
  }, [currentUser]);

  const handleLogout = useCallback(async () => {
    router.push("/");
    window.localStorage.removeItem("__twitter_token");
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
    toast({
      title: "Logged out successfully",
      duration: 2000,
    });
  },[router]);

  const handleLogin = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      // console.log(googleToken);

      if (!googleToken) {
        return toast({
          variant: "destructive",
          title: "Google Token Not Found",
          duration: 2000,
        });
      }

      try {
        const { data } = await apolloClient.query({
          query: verifyUserGoogleTokenQuery,
          variables: { token: googleToken },
        });
        // console.log(data);

        const { verifyGoogleToken } = data;
        if (verifyGoogleToken) {
          window.localStorage.setItem("__twitter_token", verifyGoogleToken);

          await apolloClient.resetStore();
          await queryclient.invalidateQueries({ queryKey: ["currentUser"] });

          toast({
            variant: "default",
            title: "Verified Successfully",
            duration: 1000,
          });
          router.push("/");
        } else {
          toast({
            variant: "destructive",
            title: "Verification Failed",
            duration: 1000,
          });
        }
      } catch (error) {
        // console.error("Error during login:", error);
        toast({
          variant: "destructive",
          title: (error as Error).message,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
          duration: 2000,
        });
      }
    },
    [router]
  );

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus-visible:none focus-visible:outline-none focus-visible:border-none">
            <div className=" flex gap-2 py-3 md:px-3 items-center hover:bg-gray-900 cursor-pointer transition-all w-full rounded-full ">
              {user.profileImageUrl && (
                <Image
                  src={user.profileImageUrl}
                  alt="Profile Image"
                  width={40}
                  height={40}
                  className="rounded-full "
                />
              )}
              <div className="hidden sm:flex justify-between w-full items-center ">
                <div>
                  <h3 className="text-white text-lg">
                    {user.firstName} {user.lastName}
                  </h3>
                  <h3 className="text-gray-400 text-sm">
                    @{user.firstName}
                    {user.lastName}
                  </h3>
                </div>
                <div>
                  <CiMenuKebab size={20} />
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 rounded-full">
            <DropdownMenuItem
              className="flex justify-center items-center"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <div className="hidden sm:flex md:flex lg:hidden rounded-full overflow-hidden p-2 shadow-lg justify-center">
            <GoogleLogin
              onError={() => {
                toast({
                  title: "Login Failed",
                  action: (
                    <ToastAction altText="Try again">Try again</ToastAction>
                  ),
                  duration: 2000,
                });
                return;
              }}
              onSuccess={(cred) => {
                handleLogin(cred);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default Badge;
