import React, { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Camera, Upload } from "lucide-react"
import { Button } from "../ui/button"

export default function ProfileImageUpload({
    imageUrl,
    onImageChange,
}: {
    imageUrl?: string | null
    onImageChange: (file: File | null) => void
}) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [isHovering, setIsHovering] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        // Set the initial image URL from props
        if (imageUrl?.startsWith("/")) {
            setPreviewUrl(`${process.env.NEXT_PUBLIC_CDN_URL}${imageUrl}`)
        }else if(imageUrl){
            setPreviewUrl(imageUrl)
        }else{
            setPreviewUrl("/user.png")
        }
    }, [imageUrl])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)
            onImageChange(file)

            return () => URL.revokeObjectURL(objectUrl)
        }
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={() => fileInputRef.current?.click()}
            >
                <Avatar className="h-24 w-24 border-2 border-zinc-700">
                    <AvatarImage src={previewUrl || "/user.png"} alt="Profile" className="object-cover" />
                    <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xl">{previewUrl ? "" : "?"}</AvatarFallback>
                </Avatar>

                {isHovering && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center transition-all">
                        <Camera className="h-8 w-8 text-zinc-200" />
                    </div>
                )}
            </div>

            {previewUrl && previewUrl!="/user.png" && <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-zinc-100"
                onClick={() => { onImageChange(null); setPreviewUrl(null) }}
            >
                <Upload className="mr-2 h-4 w-4" />
                Remove Photo
            </Button>}

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>
    )
}