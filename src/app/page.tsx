// import TwitterLayout from "@/components/Layout/TwitterLayout";
// import Skel from "@/components/normal_comp/Skeleton";
import React from "react";
import TweetModal from "@/components/normal_comp/TweetModal";
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
