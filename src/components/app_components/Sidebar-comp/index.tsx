"use client"

import { Separator } from "@/components/ui/separator"
import { usePathname, useRouter, } from "next/navigation"
import SidebarItem from "./sidebar-items"
import { cn } from "@/lib/utils"
import { useState, useEffect, useCallback } from "react"
import { loggedOutmenuItems, LoggedInmenuItems } from "./constants"
import Badge from "@/components/_components/Badge"
import { useCurrentUser } from "@/hooks/user"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import SideabrSkel from "@/components/global/Skeleton/SidebarSkel"
import { useSession } from "next-auth/react"

const Sidebar = () => {
  const { user: currentUser, isLoading } = useCurrentUser();
  const [user, setUser] = useState(currentUser);
  const pathName = usePathname()
  const [isMobile, setIsMobile] = useState(true)
  const [menuItems, setMenu] = useState(loggedOutmenuItems)
  const [dialog, setDialog] = useState(false)
  const router = useRouter();
  const { data: session } = useSession()

  useEffect(() => {
    if (currentUser !== undefined) {
      setUser(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    if (user || session?.user) {
      setDialog(false)
    }else if (!isLoading && !user) {
      setDialog(true)
    }
  }, [user, session, isLoading])

  useEffect(() => {
    if (user || session?.user) {
      setMenu(LoggedInmenuItems)
    } else {
      setMenu(loggedOutmenuItems)
    }
  }, [user])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  if (isLoading) return <>
  <div className="w-full sm:min-w-[250px] h-full flex  justify-center">
    <SideabrSkel />
  </div>
  </>

  return (
    <div className="h-full">
      <div
        className={cn(
          "flex-none overflow-y-auto relative h-full no-scrollbar flex flex-col gap-4 items-center bg-gradient-to-l from-black/40 via-black/60 to-inherit rounded-md",
          isMobile ? "w-[70px] p-2" : "w-full min-w-[220px] md:min-w-[250px] lg:min-w-[270px]  p-2",
        )}
      >
        <div
          className={cn(
            "p-4 flex gap-2 justify-center items-center ",
            isMobile ? "w-full" : " top-0 left-0 right-0",
          )}
        >
          {/* Logo placeholder */}
          {!isMobile && <span className="text-white font-bold">AppName</span>}
        </div>

        <p className={cn("text-muted-foreground font-bold pl-3", isMobile ? "sr-only" : "w-full")}>Menu</p>

        <nav className="w-full">
          <ul>
            {menuItems.map((item) => (
              <SidebarItem
                href={user ? item.href == '/profile' ? `/user/${user.id}` : item.href : (item.href === "/" ? '/' : '/not_authorised')}
                icon={item.icon}
                selected={pathName === item.href}
                title={item.title}
                key={item.title}
                activeColor={item.activeColor}
                hoverColor={item.hoverColor}
                textColor={item.textColor}
                isMobile={isMobile}
              />
            ))}
          </ul>
        </nav>

        <Separator className={cn("w-4/5", isMobile && "w-full")} />
        {
          user ? (
            <div className="w-full">
            </div>
          ) : (
            !isMobile && <div className="w-full text-center text-sm hidden sm:flex sm:text-base text-zinc-800 bg-zinc-200 border border-gray-200 rounded-xl p-4 mt-4">
              <p>
                <span className="font-semibold">Please login/register</span> to post and explore the app's features.
              </p>
            </div>
          )
        }

        <div className="mt-auto mb-4 w-full">
          <Badge></Badge>
        </div>
      </div>
      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="bg-black border border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Sign Up</DialogTitle>
            <DialogDescription className="text-gray-400">
              <span className="font-semibold">Please login/register</span> to post and explore the app's features.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/auth/sign-in')}
              className="border-gray-700 text-white hover:bg-gray-900 hover:text-white"
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => router.push('/auth/sign-up')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Sign Up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Sidebar
