"use client";

import React, { lazy, Suspense } from "react";
import Skel from "../global/Skeleton/Skeleton";
import Sidebar from "../app_components/Sidebar-comp";

const Login = lazy(() => import("../app_components/LoginSide"));

interface TwitterLayoutProps {
  children: React.ReactNode;
}

const TwitterLayout: React.FC<TwitterLayoutProps> = ({ children }) => {
  return (
    <div className="font-sans text-base bg-gradient-to-br from-black via-zinc-900 to-black text-gray-100 h-screen">
      <div className="grid grid-cols-12 h-full w-full md:pl-20 lg:pr-2 lg:pl-8 md:pr-0 xl:px-24">
        
        <div className="col-span-2 sm:col-span-4 md:col-span-3 flex justify-center md:justify-end pt-4 p-2">
          <div className="h-full bg-black/40 text-white">
            <Sidebar />
          </div>
        </div>

        <div
          className="col-span-10 xs:col-span-9 sm:col-span-8 md:col-span-7 lg:col-span-6 xl:col-span-5 
          border-x border-gray-800 h-full overflow-y-auto no-scrollbar 
          bg-black/30 backdrop-blur-md"
          id="scrollable-middle"
        >
          {children}
        </div>

        <div className="hidden md:inline col-span-0 md:col-span-4 lg:col-span-3 xl:col-span-4 ml-6 my-4 sm:mr-0 md:mr-1 xl:mr-20">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-orange-100/50 shadow-[0_0_12px_#a78bfa33] p-4">
            <Suspense fallback={<Skel />}>
              <Login />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
