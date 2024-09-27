import { Button } from "@/components/ui/button";
import React from "react";
import { CgProfile } from "react-icons/cg";
import { CiCircleMore } from "react-icons/ci";
import { FaHome, FaSearch } from "react-icons/fa";
import { FaBell, FaXTwitter } from "react-icons/fa6";
import { MdOutlineMailOutline, MdPeopleOutline } from "react-icons/md";


interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}

const sideBarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <FaHome className="text-3xl  " />,
  },
  {
    title: "Explore",
    icon: <FaSearch className="text-3xl" />,
  },
  {
    title: "Notifications",
    icon: <FaBell className="text-3xl" />,
  },
  {
    title: "Message",
    icon: <MdOutlineMailOutline className="text-3xl" />,
  },
  {
    title: "Community",
    icon: <MdPeopleOutline className="text-3xl" />,
  },
  {
    title: "Premium",
    icon: <FaXTwitter className="text-3xl" />,
  },
  {
    title: "Profile",
    icon: <CgProfile className="text-3xl" />,
  },
  {
    title: "More",
    icon: <CiCircleMore className="text-3xl" />,
  },
];

const SideBar: React.FC = () => {
  return (
    <>
      <div className="text-6xl p-3 h-fit w-fit rounded-full hover:bg-gray-900 cursor-pointer transition-all">
        <FaXTwitter className="text-3xl" />
      </div>
      <div className="mt-1 text-xl">
        <ul className="mb-3">
          {sideBarMenuItems.map((item) => (
            <li
              key={item.title}
              className="flex p-3 pr-5 justify-start items-center gap-5 w-fit rounded-full hover:bg-gray-900 cursor-pointer transition-all"
            >
              <span className="font-normal">{item.icon}</span>
              <span>{item.title}</span>
            </li>
          ))}
        </ul>
        <div className="pr-10 font-bold">
          <Button
            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-blue-300 rounded-full py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Post
          </Button>
        </div>
      </div>
    </>
  );
};

export default SideBar;
