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
    if (token && token !== previousToken.current) {
      previousToken.current = token;
      localStorage.setItem("__twitter_token", token);

      client()
    }
    async function client() {
      await apolloClient.resetStore();
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

    }
  }, [session?.backendToken]);
};
