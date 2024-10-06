"use server";
import React, { lazy, Suspense } from "react";
import SideBar from "../app_components/SideBar";
import Skel from "../normal_comp/Skeleton";
const Login = lazy(() => import("../app_components/LoginSide"));

interface TwitterLayoutProps {
  children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="font-sans text-base bg-black">
        <div className="grid grid-cols-12 h-full w-full md:px-24 ">
          <div className="col-span-2 sm:col-span-3 flex justify-center md:justify-end md:pr-8 pt-2  ">
            <SideBar />
          </div>
          <div className="col-span-10 sm:col-span-9 md:col-span-7 lg:col-span-5 border-x-[1px] border-gray-800 h-screen overflow-auto no-scrollbar transition-all">
            {children}
          </div>

          <div className="hidden md:inline col-span-0 md:col-span-4 mx-6 my-4 mr-20">
            <Suspense fallback={<Skel />}>
              <Login />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default TwitterLayout;
