"use client"
import { useCallback, useEffect, useState } from "react"
import type { User } from "@/gql/graphql"
import { useCurrentUser } from "@/hooks/user"
import type { CredentialResponse } from "@react-oauth/google"
import { apolloClient } from "@/clients/api"
import { verifyUserGoogleTokenQuery } from "@/graphql/query/user"
import { useRouter } from "next/navigation"
import { LogIn, LogOut, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useQueryClient } from "@tanstack/react-query"
import { signOut } from "next-auth/react"
import { toast } from "sonner"

const Badge = () => {
  const queryclient = useQueryClient()

  const router = useRouter()
  const [user, setUser] = useState<User | undefined>()
  const { user: currentUser } = useCurrentUser()
  useEffect(() => {
    if (currentUser !== undefined) {
      setUser((currentUser as User) || undefined)
    }
  }, [currentUser])

  const handleLogout = useCallback(async () => {
    localStorage.removeItem("__twitter_token")
    await signOut();
    await apolloClient.resetStore()
    await queryclient.invalidateQueries()
    
    toast.success("Logged out successfully",{
      duration: 2000,
    })
  }, [router])

  const handleLogin = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential

      if (!googleToken) {
        return toast.error("Google Token Not Found",{
          duration: 2000
        })
      }

      try {
        const { data } = await apolloClient.query({
          query: verifyUserGoogleTokenQuery,
          variables: { token: googleToken },
        })

        const { verifyGoogleToken } = data
        if (verifyGoogleToken) {
          window.localStorage.setItem("__twitter_token", verifyGoogleToken.token)

          await apolloClient.resetStore()
          await queryclient.invalidateQueries({ queryKey: ["currentUser"] })

          toast.info("Verified Successfully",{
            duration: 1000,
          })
          router.push("/")
        } else {
          toast.error("Verification Failed",{
            description: "Please try again",            
            duration: 1000,
          })
        }
      } catch (error) {
        console.log("Error verifying token", error)
        toast.error("Error verifying token",{
          description: "Please try again",
          duration: 2000,
        })
      }
    },
    [router],
  )

  return (
    <>
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full focus-visible:outline-none">
            <div className="flex items-center hover:bg-gray-900 border-2 border-zinc-800 cursor-pointer transition-all w-full text-center rounded-full p-2 justify-center md:justify-start md:gap-2 md:px-3 md:py-3">
              <Avatar className="h-8 w-8 border-2 border-zinc-200 ">
                <AvatarImage src={user.profileImageUrl?`${process.env.NEXT_PUBLIC_CDN_URL || ""}${user.profileImageUrl}` : "/user.png"}
                />
                <AvatarFallback className="bg-orange-500/20 text-orange-500">
                  {user.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="hidden sm:flex justify-between w-full items-center">
                <div className="text-left">
                  <h3 className="text-white text-sm font-medium">
                    {user.name}
                  </h3>
                  <h3 className="text-gray-400 text-xs">
                    @{user.userName}
                  </h3>
                </div>
                <div>
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-48">
            <DropdownMenuItem className="flex w-full items-center cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-orange-500" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex justify-center items-center p-2 w-full md:px-3 md:py-3 lg:hidden">
          <button
            onClick={() => router.push("/auth/sign-in")}
            className="p-2 w-full gap-4 rounded-full bg-orange-500 flex items-center justify-center text-white"
          >
            <>
              <LogIn className="h-5 w-5 " />
              <p className="font-bold hidden sm:flex "> Login </p>
            </>
          </button>
        </div>
      )}
    </>
  )
}

export default Badge
