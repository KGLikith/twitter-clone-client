"use client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { apolloClient } from "@/clients/api";
import queryclient from "@/clients/queryClient";
import { User } from "@/gql/graphql";
import Skel from "../normal_comp/Skeleton";
import { ToastAction } from "@radix-ui/react-toast";
import RecommendedUsers from "../normal_comp/RecommendedUsers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Login = () => {
  const { toast } = useToast();
  const router= useRouter()

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();
  const { user: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser as User);
      setLoading(false);
      // console.log(currentUser?.recommendedUsers)
    }
  }, [currentUser]);

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
          router.push('/')
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
    [toast]
  );

  if (loading) {
    return <Skel />;
  }

  return (
    <>
      {!user ? (
        <div className="p-3 pr-5 border flex flex-col border-gray-800 rounded-2xl space-y-4">
          <h1 className="font-bold text-xl">New to X?</h1>
          <p className="text-xs text-gray-500">
            Sign up now to get your own personalized timeline!
          </p>
          <div className=" rounded-full overflow-hidden p-2 shadow-lg flex justify-center">
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
          <p className="text-xs text-gray-500">
            By signing up, you agree to the{" "}
            <span className="text-blue-600">Terms of Service</span> and{" "}
            <span className="text-blue-600">Privacy Policy</span>, including{" "}
            <span className="text-blue-600">Cookie Use.</span>
          </p>
        </div>
      ) : (
        <>
          {/* <Searchbar></Searchbar> */}
          {user?.recommendedUsers && user.recommendedUsers.length > 0 && (
            <>
              <div className="p-3 border flex flex-col border-gray-800 rounded-2xl space-y-2">
                <h1 className="font-bold text-xl text-center">
                  You might know?!
                </h1>
                <div className="space-y-1">
                  {user.recommendedUsers?.map((rec_user) => (
                    <div key={rec_user?.id} className=" flex gap-2 py-1 md:px-3 items-center hover:bg-gray-900 cursor-pointer transition-all w-full rounded-full ">
                      {rec_user?.profileImageUrl && (
                        <Link href={`/${rec_user?.id}`} >
                          <Image
                            src={rec_user.profileImageUrl}
                            alt="Profile Image"
                            width={30}
                            height={30}
                            className="rounded-full "
                          />
                        </Link>
                      )}
                      <div className="hidden sm:flex justify-between w-full items-center ">
                        <div>
                          <Link href={`/user/${rec_user?.id}`}>
                            <h3 className="text-white text-md hover:underline">
                              {rec_user?.firstName} {rec_user?.lastName}
                            </h3>
                          </Link>
                          <h3 className="text-gray-400 text-sm">
                            @{rec_user?.firstName}
                            {rec_user?.lastName}
                          </h3>
                        </div>
                        <div>
                          <RecommendedUsers user={rec_user as User} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Login;
