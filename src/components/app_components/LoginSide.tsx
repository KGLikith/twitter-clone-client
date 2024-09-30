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

const Login = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | undefined>();
  const { user: currentUser } = useCurrentUser();

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser || undefined);
      setLoading(false); 
    }
  }, [currentUser]);

  const handleLogin = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential;

    if (!googleToken) {
      return toast({
        variant: "destructive",
        title: "Google Token Not Found",
      });
    }

    try {
      const { data } = await apolloClient.query({
        query: verifyUserGoogleTokenQuery,
        variables: { token: googleToken },
      });

      const { verifyGoogleToken } = data;
      if (verifyGoogleToken) {
        window.localStorage.setItem("__twitter_token", verifyGoogleToken);

        await apolloClient.resetStore();
        await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
        await queryclient.invalidateQueries({ queryKey: ["tweets"] });
        
        toast({
          variant: "default",
          title: "Verified Successfully",
        });
      } else {
        toast({ variant: "destructive", title: "Verification Failed" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({ variant: "destructive", title: "An error occurred", action: <ToastAction altText="Try again">Try again</ToastAction>, });
    }
  }, []);

  if (loading) {
    // Optionally, you can show a loading spinner or simply return null while loading
    return <Skel />;
  }

  return (
    <>
      {!user && (
        <div className="p-3 pr-5 border flex flex-col border-gray-800 rounded-2xl space-y-4">
          <h1 className="font-bold text-xl">New to X?</h1>
          <p className="text-xs text-gray-500">
            Sign up now to get your own personalized timeline!
          </p>
          <div className=" rounded-full overflow-hidden p-2 shadow-lg flex justify-center">
            <GoogleLogin
              onError={() => console.log("Login failed")}
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
      )}
    </>
  );
};

export default Login;
