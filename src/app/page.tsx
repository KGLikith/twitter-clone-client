// import TwitterLayout from "@/components/Layout/TwitterLayout";
// import Skel from "@/components/_components/Skeleton";
import React from "react";
import TweetModal from "@/components/_components/TweetModal";
// const UseFeedCard = lazy(()=>import("@/components/app_components/UseFeedCard"))
import UseFeedCard from "@/components/app_components/UseFeedCard";

const App = () => {
  return (
    <>
      <TweetModal />
      <UseFeedCard />
    </>
  );
};

export default App;
