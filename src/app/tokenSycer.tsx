// components/TokenSyncer.tsx
"use client";
import { useAuthToken } from "@/hooks/useAuthToken";

export const TokenSyncer = () => {
  useAuthToken();
  return null; // we don't need to render anything
};
