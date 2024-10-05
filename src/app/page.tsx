"use server";
import UseFeedCard from "@/components/app_components/UseFeedCard";
import TwitterLayout from "@/components/Layout/TwitterLayout";
import React, { lazy } from "react";
const TweetModal = lazy(() => import("@/components/normal_comp/TweetModal"));

const App = () => {
  return (
    <>
      <TwitterLayout>
          <TweetModal />
          <UseFeedCard />
      </TwitterLayout>
    </>
  );
};

export default App;