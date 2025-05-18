import React from "react"

interface MessageContentProps {
  content: string
  isDeleted?: boolean
}

export default function MessageContent({ content, isDeleted }: MessageContentProps) {
  if (isDeleted) {
    return <span className="italic text-muted-foreground w-fit">This message was deleted</span>
  }

  const linkifyText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    const parts = text.split(urlRegex)

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline w-fit"
          >
            {part}
          </a>
        )
      }
      return part
    })
  }

  const formatText = (text: string) => {
    const trimmedContent = text.replace(/^\s+/, "");
    const lines = trimmedContent.split("\n")

    return lines.map((line, index) => (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {linkifyText(line)}
      </React.Fragment>
    ))
  }

  return <span className="w-fit leading-relaxed text-gray-100 whitespace-pre-wrap break-words">{formatText(content)}</span>
}
