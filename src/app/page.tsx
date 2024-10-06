
import TwitterLayout from "@/components/Layout/TwitterLayout";
import Skel from "@/components/normal_comp/Skeleton";
import React, { lazy, Suspense } from "react";
import TweetModal from "@/components/normal_comp/TweetModal"
// const UseFeedCard = lazy(()=>import("@/components/app_components/UseFeedCard"))
import UseFeedCard from "@/components/app_components/UseFeedCard";

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
