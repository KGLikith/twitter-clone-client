import SideBar from "../components/app_components/SideBar";
import React from "react";
import FeedCard from "@/components/app_components/FeedCard";
import Login from "@/components/app_components/LoginSide";


export default function Home() {
    return (
    <>
        <div className="grid grid-cols-12 h-full w-full px-24 ">
          <div className="col-span-3 flex flex-col justify-start pt-2 pl-16 ">
            <SideBar />
          </div>

          <div className="col-span-5 border-x-[1px] border-gray-800 h-screen overflow-auto no-scrollbar transition-all">
            <div className="h-full ">
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
              <FeedCard />
            </div>
          </div>

          <div className="col-span-4 mx-6 my-4 mr-20">
            <Login />
          </div>
        </div>
    </>
  );
}
