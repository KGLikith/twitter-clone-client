"use client";
import { apolloClient } from "@/clients/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export const useAuthToken = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const previousToken = useRef<string | null>(null);

  useEffect(() => {
    const token = session?.backendToken;
    console.log("Token from session:", token);
    if (token && token !== previousToken.current) {
      previousToken.current = token;
      console.log("Token updated:", token);
      localStorage.setItem("__twitter_token", token);

      apolloClient.resetStore();
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  }, [session?.backendToken]);
};
