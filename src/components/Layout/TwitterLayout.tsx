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
        <div className="grid grid-cols-12 h-full w-full  md:pl-20  lg:pr-2 lg:pl-8 md:pr-0 xl:px-24 ">
          <div className="col-span-2 sm:col-span-4 md:col-span-3 flex justify-center md:justify-end  md:p-2 md:pr-4 lg:pr-4 xl:pr-8 pt-2 p-2 ">
            <SideBar />
          </div>
          <div className="col-span-10 xs:col-span-9 sm:col-span-8 md:col-span-7 lg:col-span-6 xl:col-span-5 border-x-[1px] border-gray-800 h-screen overflow-auto no-scrollbar transition-all">
            {children}
          </div>

          <div className="hidden md:inline col-span-0 md:col-span-4 lg:col-span-3 xl:col-span-4 ml-6 my-4 sm:mr-0 md:mr-1 xl:mr-20">
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
