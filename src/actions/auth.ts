"use client";

import { apolloClient } from "@/clients/api";
import { QueryClient } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export const handleGoogleSignIn = async (queryclient: QueryClient) => {
  try {
    await signIn("google", { callbackUrl: "/" });
    await apolloClient.resetStore();
    await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
  } catch (err) {
    toast.error("Google Sign In Failed", {
      duration: 2000,
    });
    console.error("Google Sign In Error", err);
  }
};
