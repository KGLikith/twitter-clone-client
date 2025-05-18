import React from 'react'
import { HiOutlinePhotograph } from 'react-icons/hi'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AiOutlineGif } from 'react-icons/ai'
import { Input } from '@/components/ui/input'
import { FiSmile } from 'react-icons/fi'
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"

type Props = {
  handleSelectImage: () => void
  showGifPicker: boolean
  setShowEmojiPicker: (show: boolean) => void
  setShowGifPicker: (show: boolean) => void
  gifSearchTerm: string
  setGifSearchTerm: (term: string) => void
  gifs: any[]
  handleEmojiSelect: (emoji: any) => void
  showEmojiPicker: boolean
  handleGifSelect: (gif: any) => void
  searchGifs: () => void
}

export default function TweetMenu({
  showGifPicker,
  showEmojiPicker,
  searchGifs,
  handleSelectImage,
  setShowEmojiPicker,
  setShowGifPicker,
  gifSearchTerm,
  setGifSearchTerm,
  gifs,
  handleEmojiSelect,
  handleGifSelect
}: Props) {
  return (
    <>
      <div className="flex items-center text-xl text-orange-400">

        <div
          onClick={handleSelectImage}
          className="hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer"
        >
          <HiOutlinePhotograph />
        </div>

        <Popover open={showGifPicker} onOpenChange={setShowGifPicker}>
          <PopoverTrigger asChild>
            <div className="hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer">
              <AiOutlineGif />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[300px]">
            <Input
              placeholder="Search GIFs"
              className="mb-2"
              value={gifSearchTerm}
              onChange={(e) => setGifSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchGifs()}
            />
            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
              {gifs.map((gif) => (
                <img
                  key={gif.id}
                  src={gif.images.fixed_height_small.url}
                  alt="gif"
                  className="cursor-pointer rounded-md"
                  onClick={() => {setShowGifPicker(false); handleGifSelect(gif) }}
                />
              ))}
            </div>
            {
              !gifSearchTerm && (
                <div className="text-center py-4 text-gray-400">
                  Search for GIFs. Press Enter after typing.
                </div>
              )
            }
            {gifs.length === 0 && gifSearchTerm && (
              <div className="text-center py-4 text-gray-400">
                No GIFs found. Try a different search term or please press enter.
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <div className="hover:bg-gray-900 rounded-full p-2 transition-all cursor-pointer">
              <FiSmile />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-gray-700">
            <Picker data={data} onEmojiSelect={(emoji: any) => {
              handleEmojiSelect(emoji)
            }} theme="dark" />
          </PopoverContent>
        </Popover>
      </div>
    </>)
}