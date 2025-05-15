import { BadgePlus, Bell, Chat, CreditCard, Explore, FileDuoToneBlack, Home, Settings, ZapDouToneBlack } from "@/components/icons"
import { Mail, MoreHorizontal } from "lucide-react"

export const loggedOutmenuItems = [
  {
    title: "Home",
    href: `/`,
    icon: <Home className="h-5 w-5 text-orange-400 group-hover:text-orange-300 " />,
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
]

export const LoggedInmenuItems = [
  {
    title: "Home",
    href: `/`,
    icon: <Home className="h-5 w-5 text-orange-400 group-hover:text-orange-300  group-hover:stroke-orange-400" />,
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Explore",
    href: `/explore`,
    icon: (
      <div className="h-5 w-5 group-hover:text-orange-300  group-hover:stroke-orange-400">
        <Explore />
      </div>
    ),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Messages",
    href: `/messages`,
    icon: (
      <div className="h-5 w-5  group-hover:text-orange-300  group-hover:stroke-orange-400">
        <Chat />
      </div>),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Notifications",
    href: `/notifications`,
    icon: <Bell className="h-5 w-5 text-orange-400 group-hover:text-orange-300  group-hover:stroke-orange-400" />,
    notifications: 0,
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Billing",
    href: `/billing`,
    icon: (
      <div className="h-5 w-5 text-orange-400 group-hover:text-orange-300  group-hover:stroke-orange-400">
        <CreditCard />
      </div>
    ),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Profile",
    href: `/profile`,
    icon: (
      <div className="h-5 w-5 text-orange-400 group-hover:text-orange-300  group-hover:stroke-orange-400">
        <ZapDouToneBlack />
      </div>),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "Settings",
    href: `/settings`,
    icon: (
      <div className="h-5 w-5 text-orange-400 group-hover:text-orange-300  group-hover:stroke-orange-400">
        <Settings />
      </div>
    ),
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
  {
    title: "More",
    href: `/bookmarks`,
    icon: <MoreHorizontal className="h-5 w-5 text-gray-700 group-hover:text-orange-300  group-hover:stroke-orange-400" />,
    activeColor: "bg-orange-500/10",
    hoverColor: "bg-orange-500/5",
    textColor: "text-gray-200 group-hover:text-orange-300",
  },
]
