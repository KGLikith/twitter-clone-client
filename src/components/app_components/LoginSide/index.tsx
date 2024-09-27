"use client";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { graphqlClient } from "@/clients/api";
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user";

const Login = () => {
  const handleLogin = useCallback(async (cred: CredentialResponse) => {
    const googleToken = cred.credential;
    console.log(cred);

    if (!googleToken) {
      return toast({
        variant: "destructive",
        title: "Google Token Not Found",
      });
    }
    const { verifyGoogleToken } = await graphqlClient.request(
      verifyUserGoogleTokenQuery,
      { token: googleToken }
    );

    toast({
      variant: "default",
      title: "Verified Successfully",
    });

    if(verifyGoogleToken) window.localStorage.setItem("__twitter_token", verifyGoogleToken);

  }, []);

  const { toast } = useToast();
  return (
    <>
      <div className="p-3 pr-5 border flex flex-col border-gray-800 rounded-2xl space-y-4">
        <h1 className="font-bold text-xl">New to X?</h1>
        <p className="text-xs text-gray-500">
          Sign up now to get your own personalized timeline!
        </p>
        <div className=" rounded-full overflow-hidden p-2 shadow-lg flex justify-center">
          <GoogleLogin
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
    </>
  );
};

export default Login;
