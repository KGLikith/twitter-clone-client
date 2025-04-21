"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, Hash, X, ArrowLeft, MoreHorizontal } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { debounce } from "@/utils/debounce"

// Mock data - replace with actual API calls
const TRENDING_TOPICS = [
  { id: 1, name: "#JavaScript", count: "125K", category: "Technology" },
  { id: 2, name: "#ReactJS", count: "89K", category: "Programming" },
  { id: 3, name: "#NextJS", count: "56K", category: "Programming" },
  { id: 4, name: "#AI", count: "203K", category: "Technology" },
  { id: 5, name: "#MachineLearning", count: "78K", category: "Technology" },
  { id: 6, name: "#WebDevelopment", count: "45K", category: "Programming" },
  { id: 7, name: "#UXDesign", count: "32K", category: "Design" },
  { id: 8, name: "#Blockchain", count: "67K", category: "Technology" },
  { id: 9, name: "#Cybersecurity", count: "91K", category: "Technology" },
  { id: 10, name: "#DataScience", count: "112K", category: "Technology" },
]

const MOCK_USERS = [
  {
    id: "1",
    name: "John Doe",
    userName: "johndoe",
    profileImageUrl: "/placeholder.svg?height=40&width=40",
    followers: 1200,
    verified: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    userName: "janesmith",
    profileImageUrl: "/placeholder.svg?height=40&width=40",
    followers: 3400,
    verified: false,
  },
  {
    id: "3",
    name: "Alex Johnson",
    userName: "alexj",
    profileImageUrl: "/placeholder.svg?height=40&width=40",
    followers: 5600,
    verified: true,
  },
  {
    id: "4",
    name: "Sam Wilson",
    userName: "samwilson",
    profileImageUrl: "/placeholder.svg?height=40&width=40",
    followers: 890,
    verified: false,
  },
  {
    id: "5",
    name: "Taylor Swift",
    userName: "taylorswift",
    profileImageUrl: "/placeholder.svg?height=40&width=40",
    followers: 92000000,
    verified: true,
  },
]

// Mock recent searches
const RECENT_SEARCHES = ["javascript tutorial", "#WebDevelopment", "react hooks"]

const CATEGORIES = [
  { id: "for-you", name: "For You" },
  { id: "trending", name: "Trending" },
  { id: "news", name: "News" },
  { id: "sports", name: "Sports" },
  { id: "entertainment", name: "Entertainment" },
]

export default function ExplorePage() {
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("for-you")
  const [isLoading, setIsLoading] = useState(true)
  const [filteredUsers, setFilteredUsers] = useState<typeof MOCK_USERS>([])
  const [filteredHashtags, setFilteredHashtags] = useState<typeof TRENDING_TOPICS>([])
  const [showSearchDropdown, setShowSearchDropdown] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Debounced search preview function
  const updateSearchPreview = useCallback(
    debounce((query: string) => {
      if (query) {
        // Filter users for preview
        const users = MOCK_USERS.filter(
          (user) =>
            user.name.toLowerCase().includes(query.toLowerCase()) ||
            user.userName.toLowerCase().includes(query.toLowerCase()),
        )
        setFilteredUsers(users)

        // Filter hashtags for preview
        const hashtags = TRENDING_TOPICS.filter((topic) => topic.name.toLowerCase().includes(query.toLowerCase()))
        setFilteredHashtags(hashtags)
        setShowSearchDropdown(true)
      } else {
        setFilteredUsers([])
        setFilteredHashtags([])
        setShowSearchDropdown(false)
      }
    }, 300),
    [],
  )

  useEffect(() => {
    updateSearchPreview(searchQuery)

    // Cleanup function
    return () => {
      updateSearchPreview.cancel()
    }
  }, [searchQuery, updateSearchPreview])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleClearSearch = () => {
    setSearchQuery("")
    setShowSearchDropdown(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearchDropdown(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center p-2 gap-2">
          <Button variant="ghost" size="icon" className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div ref={searchContainerRef} className="relative flex-1">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (searchQuery) setShowSearchDropdown(true)
                }}
                className="w-full bg-gray-900 border-gray-700 pl-10 pr-10 py-2 text-white placeholder:text-gray-500 focus-visible:ring-blue-500 rounded-full"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 hover:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </form>

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden max-h-[80vh] overflow-y-auto z-20">
                {/* Recent searches */}
                {searchQuery === "" && RECENT_SEARCHES.length > 0 && (
                  <div className="p-2">
                    <h3 className="text-sm text-gray-500 px-3 py-1">Recent</h3>
                    {RECENT_SEARCHES.map((term, index) => (
                      <button
                        key={index}
                        className="flex items-center w-full px-3 py-2 hover:bg-gray-900 rounded-md"
                        onClick={() => {
                          setSearchQuery(term)
                          handleSearchSubmit()
                        }}
                      >
                        <Search className="h-4 w-4 text-gray-500 mr-3" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Search suggestions */}
                {searchQuery && (
                  <>
                    {/* Top search terms */}
                    <div className="border-b border-gray-800">
                      {[searchQuery, `#${searchQuery.toUpperCase()}`, searchQuery.toLowerCase()].map((term, index) => (
                        <button
                          key={index}
                          className="flex items-center w-full px-3 py-3 hover:bg-gray-900"
                          onClick={() => {
                            setSearchQuery(term)
                            handleSearchSubmit()
                          }}
                        >
                          <Search className="h-5 w-5 text-gray-500 mr-3" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>

                    {/* User results */}
                    {filteredUsers.length > 0 && (
                      <div className="border-b border-gray-800">
                        {filteredUsers.slice(0, 5).map((user) => (
                          <Link href={`/user/${user.id}`} key={user.id} className="block">
                            <div className="flex items-center justify-between px-3 py-3 hover:bg-gray-900">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={user.profileImageUrl || "/placeholder.svg"} alt={user.name} />
                                  <AvatarFallback className="bg-gray-800">{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-1">
                                    <p className="font-semibold">{user.name}</p>
                                    {user.verified && (
                                      <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                      </svg>
                                    )}
                                  </div>
                                  <p className="text-gray-500 text-sm">@{user.userName}</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full border-gray-700 hover:bg-gray-800 text-white"
                              >
                                Follow
                              </Button>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* Hashtag results */}
                    {filteredHashtags.length > 0 && (
                      <div>
                        {filteredHashtags.slice(0, 3).map((topic) => (
                          <Link href={`/hashtag/${topic.name.substring(1)}`} key={topic.id} className="block">
                            <div className="flex items-center px-3 py-3 hover:bg-gray-900">
                              <Hash className="h-5 w-5 text-gray-500 mr-3" />
                              <div>
                                <p className="font-semibold text-blue-400">{topic.name}</p>
                                <p className="text-gray-500 text-xs">{topic.count} posts</p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Go to full search */}
                <div className="p-3 border-t border-gray-800">
                  <Button
                    onClick={handleSearchSubmit}
                    variant="ghost"
                    className="w-full justify-start text-blue-500 hover:bg-gray-900"
                  >
                    Search for "{searchQuery}"
                  </Button>
                </div>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>

        {!showSearchDropdown && (
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full h-full">
            <TabsList className="w-full bg-transparent border-b border-gray-800 justify-start overflow-x-auto overflow-y-hidden">
              {CATEGORIES.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-white rounded-none px-6 py-3 text-gray-400"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
      </div>

      {/* Main content */}
      <div className="p-0">
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="for-you" className="mt-0">
            <TrendingSection isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="trending" className="mt-0">
            <TrendingSection isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="news" className="mt-0">
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="text-xl font-semibold mb-2">News coming soon</h2>
              <p className="text-gray-400 text-center">We're working on bringing you the latest news.</p>
            </div>
          </TabsContent>
          <TabsContent value="sports" className="mt-0">
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="text-xl font-semibold mb-2">Sports coming soon</h2>
              <p className="text-gray-400 text-center">We're working on bringing you the latest sports updates.</p>
            </div>
          </TabsContent>
          <TabsContent value="entertainment" className="mt-0">
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="text-xl font-semibold mb-2">Entertainment coming soon</h2>
              <p className="text-gray-400 text-center">We're working on bringing you the latest entertainment news.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function TrendingSection({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="divide-y divide-gray-800">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="p-4">
            <Skeleton className="h-4 w-24 bg-gray-800 mb-2" />
            <Skeleton className="h-5 w-48 bg-gray-800 mb-1" />
            <Skeleton className="h-4 w-32 bg-gray-800" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-800">
      <div className="p-4 bg-gray-900">
        <h2 className="text-xl font-bold mb-1">Trends for you</h2>
        <p className="text-gray-400 text-sm">Trending topics in your area and topics you might be interested in</p>
      </div>

      {TRENDING_TOPICS.map((topic) => (
        <Link href={`/hashtag/${topic.name.substring(1)}`} key={topic.id}>
          <div className="p-4 hover:bg-gray-900 transition-colors">
            <p className="text-gray-500 text-xs">{topic.category} · Trending</p>
            <p className="font-bold text-lg my-1">{topic.name}</p>
            <p className="text-gray-500 text-sm">{topic.count} posts</p>
          </div>
        </Link>
      ))}

      <Link href="/trending/more" className="block p-4 text-blue-500 hover:bg-gray-900 transition-colors">
        Show more
      </Link>
    </div>
  )
}
