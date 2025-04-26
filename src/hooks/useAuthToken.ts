"use client";
import { apolloClient } from "@/clients/api";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export const useAuthToken = () => {
  const { data: session } = useSession();
  const queryclient = useQueryClient();
  useEffect(() => {
    async function resetClients() {
      await apolloClient.resetStore();
      await queryclient.invalidateQueries({ queryKey: ["currentUser"] });
    }
    if (session?.backendToken) {
      localStorage.setItem("__twitter_token", session.backendToken);
      resetClients();
    }
  }, [session?.backendToken]);
};
