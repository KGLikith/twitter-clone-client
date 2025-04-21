"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type React from "react"
import { motion } from "framer-motion"
import { Bookmark } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
  const isBookmarkRelated = title.toLowerCase().includes("more")

  const renderContent = () => {
    if (isBookmarkRelated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus:outline-none">
            <div className={linkClasses}>{linkContent}</div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobile ? "center" : "start"} side={isMobile ? "right" : "bottom"}>
            <DropdownMenuItem asChild>
              <Link href="/bookmarks" className={linkClasses}>
                <Bookmark className="mr-2 h-4 w-4" />
                <span>View Bookmarks</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Link key={href} href={href} className={linkClasses}>
        {linkContent}
      </Link>
    )
  }

  const linkClasses = cn(
    "flex items-center gap-3 rounded-md transition-all duration-200 group relative cursor-pointer ",
    isActive ? activeColor : "hover:" + hoverColor,
    isMobile ? "justify-center py-3 px-2" : "px-3 py-2.5",
  )

  const linkContent = (
    <>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r-md",
            isMobile && "h-1 w-8 left-1/4 top-auto bottom-0 rounded-t-md",
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
    </>
  )

  return (
    <li className="cursor-pointer my-[5px]">
      {isMobile ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>{renderContent()}</TooltipTrigger>
            <TooltipContent side="right" align="center" className="font-medium">
              {title}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        renderContent()
      )}
    </li>
  )
}

export default SidebarItem
