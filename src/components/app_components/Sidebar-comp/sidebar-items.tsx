"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { motion } from "framer-motion"
import { User } from "@/gql/graphql"

type Props = {
  icon: React.ReactNode
  title: string
  href: string
  selected: boolean
  notifications?: number
  activeColor?: string
  hoverColor?: string
  textColor?: string
  isMobile?: boolean
}

const SidebarItem = ({
  href,
  icon,
  selected,
  title,
  activeColor,
  hoverColor,
  textColor,
  notifications,
  isMobile = false,
}: Props) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <li className="cursor-pointer my-[5px]">
      <Link
        key={href}
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md transition-all duration-200 group relative",
          isActive ? activeColor : "hover:" + hoverColor,
          isMobile ? "justify-center py-3 px-2" : "px-3 py-2.5",
        )}
      >
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className={cn(
              "absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-md",
              isMobile && "h-1 w-8  left-1/4 top-auto bottom-0 rounded-t-md",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        {icon}
        {!isMobile && <span className={cn(textColor, isActive && "!text-orange-400 font-medium")}>{title}</span>}
        {!isMobile && isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500"></div>}
        {notifications && notifications > 0 && (
          <div
            className={cn(
              "flex items-center justify-center bg-orange-500 text-white rounded-full text-xs font-medium",
              isMobile ? "absolute -top-1 -right-1 min-w-5 h-5" : "ml-auto min-w-5 h-5",
            )}
          >
            {notifications}
          </div>
        )}
      </Link>
    </li>
  )
}

export default SidebarItem
