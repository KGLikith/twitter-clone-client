"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface AnimatedSeenTextProps {
  text: string | null
  className?: string
}

export default function EnhancedAnimatedSeenText({ text, className = "" }: AnimatedSeenTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const prevTextRef = useRef(text)

  const getTextArray = (text: string | null) => {
    if (!text) return []
    return text.split("")
  }

  const currentTextArray = getTextArray(text)
  const prevTextArray = getTextArray(prevTextRef.current)

  useEffect(() => {
    if (text !== prevTextRef.current) {
      prevTextRef.current = text
      setDisplayText(text)
    }
  }, [text])

  if (!text) return null

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex">
        {currentTextArray.map((char, index) => {
          const hasChanged = index >= prevTextArray.length || char !== prevTextArray[index]

          return (
            <motion.span
              key={`${index}-${char}`}
              initial={hasChanged ? { y: 20, opacity: 0 } : { y: 0, opacity: 1 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.02, 
                ease: "easeOut",
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          )
        })}
      </div>
    </div>
  )
}
