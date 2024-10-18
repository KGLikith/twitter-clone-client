"use client";
import { Button } from "@/components/ui/button";
import React, {  useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { CiCircleMore } from "react-icons/ci";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaBell, FaXTwitter } from "react-icons/fa6";
import { MdOutlineMailOutline, MdPeopleOutline } from "react-icons/md";
import Badge from "../normal_comp/Badge";
import { useCurrentUser } from "@/hooks/user";
import Link from "next/link";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  link: string;
}

const SideBar: React.FC = () => {
  const { user: currentUser } = useCurrentUser();
  const [user, setUser] = useState(currentUser);
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
    }
  }, [currentUser]);

 

  const sideBarMenuItems: TwitterSidebarButton[] = [
    {
      title: "Home",
      icon: <FaHome className="text-3xl  " />,
      link: "/",
    },
    {
      title: "Explore",
      icon: <FaSearch className="text-3xl" />,
      link: `${user ? `/explore` : "/not_authorised"}`
    },
    {
      title: "Notifications",
      icon: <FaBell className="text-3xl" />,
      link: `${user ? `/notifications` : "/not_authorised"}`
    },
    {
      title: "Message",
      icon: <MdOutlineMailOutline className="text-3xl" />,
      link: `${user ? `/messages` : "/not_authorised"}`
    },
    {
      title: "Community",
      icon: <MdPeopleOutline className="text-3xl" />,
      link: `${user ? `/community` : "/not_authorised"}`
    },
    {
      title: "Premium",
      icon: <FaXTwitter className="text-3xl" />,
      link: `${user ? `/premium` : "/not_authorised"}`
    },
    {
      title: "Profile",
      icon: <CgProfile className="text-3xl" />,
      link: `${user ? `/user/${user.id}` : "/not_authorised"}`,
    },
    {
      title: "More",
      icon: <CiCircleMore className="text-3xl" />,
      link: `${user ? `/more` : "/not_authorised"}`
    },
  ];

  return (
    <>
      <div className="relative h-[90vh] flex flex-col justify-between pr-2">
        <div>
          <div className="text-6xl py-3 sm:pl-1 md:p-3 h-fit w-fit rounded-full hover:bg-gray-900 cursor-pointer transition-all">
            <FaXTwitter className="text-3xl" />
          </div>
          <div className="mt-1 text-xl">
            <ul className="mb-3">
              {sideBarMenuItems.map((item) => (
                <Link key={item.title} href={item.link}>
                  <li className="flex py-3 md:p-3 sm:pr-1 sm:pl-1 md:pr-5 justify-start items-center gap-5 w-fit rounded-full hover:bg-gray-900 cursor-pointer transition-all">
                    <span className="font-normal">{item.icon}</span>
                    <span className="hidden sm:inline">{item.title}</span>
                  </li>
                </Link>
              ))}
            </ul>
            <div className="hidden sm:inline font-bold">
              <Button className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 rounded-full py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Post
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full">
          
              <Badge />
            
        </div>
      </div>
    </>
  );
};

export default SideBar;
