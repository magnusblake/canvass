"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Story } from "@/lib/types"
import Link from "next/link"

interface StoriesProps {
  stories: Story[]
}

export default function Stories({ stories: initialStories }: StoriesProps) {
  const [stories] = useState(initialStories)
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number | null>(null)
  const [currentStoryProgress, setCurrentStoryProgress] = useState(0)
  const [direction, setDirection] = useState(0)
  const [viewedStories, setViewedStories] = useState<Set<string>>(new Set())
  const [isPaused, setIsPaused] = useState(false)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const storyDuration = 5000 // 5 seconds per story

  const openStory = useCallback((index: number) => {
    setCurrentStoryIndex(index)
    setDirection(0)
    setCurrentStoryProgress(0)
  }, [])

  const closeStory = useCallback(() => {
    setCurrentStoryIndex(null)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
  }, [])

  const navigateStory = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < stories.length) {
        setDirection(newIndex > currentStoryIndex! ? 1 : -1)
        setCurrentStoryIndex(newIndex)
        setCurrentStoryProgress(0)
      } else {
        closeStory()
      }
    },
    [closeStory, currentStoryIndex, stories.length],
  )

  const startProgressTimer = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    progressInterval.current = setInterval(() => {
      if (!isPaused) {
        setCurrentStoryProgress((prev) => {
          if (prev >= 100) {
            if (currentStoryIndex! < stories.length - 1) {
              navigateStory(currentStoryIndex! + 1)
            } else {
              closeStory()
            }
            return 0
          }
          return prev + (100 / storyDuration) * 100
        })
      }
    }, 100)
  }, [isPaused, currentStoryIndex, stories.length, navigateStory, closeStory])

  const handleMouseDown = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsPaused(false)
  }, [])

  const handlePrevStory = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigateStory(currentStoryIndex! - 1)
    },
    [navigateStory, currentStoryIndex],
  )

  const handleNextStory = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      navigateStory(currentStoryIndex! + 1)
    },
    [navigateStory, currentStoryIndex],
  )

  useEffect(() => {
    if (currentStoryIndex !== null) {
      setViewedStories((prev) => new Set(prev).add(stories[currentStoryIndex].id))
      startProgressTimer()
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [currentStoryIndex, stories, startProgressTimer])

  return (
    <div className="mb-8 m-4">
      {" "}
      {/* Added horizontal margin */}
      <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
        {stories.map((story, index) => (
          <div key={story.id} className="flex-shrink-0 cursor-pointer" onClick={() => openStory(index)}>
            <div
              className={`w-20 h-20 rounded-lg overflow-hidden ${
                viewedStories.has(story.id) ? "" : "ring-2 ring-primary"
              }`}
            >
              <Image
                src={story.imageUrl || "/placeholder.svg"}
                alt={story.title}
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence initial={false} custom={direction}>
        {currentStoryIndex !== null && (
          <motion.div
            key={currentStoryIndex}
            custom={direction}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeStory}
          >
            <motion.div
              className="relative bg-background overflow-hidden rounded-lg"
              style={{
                width: "375px",
                height: "667px",
                maxHeight: "90vh",
                maxWidth: "90vw",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 z-10 flex p-2">
                {stories.map((_, i) => (
                  <div key={i} className="flex-1 h-1 bg-gray-200 mr-1">
                    {i === currentStoryIndex && (
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${currentStoryProgress}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                      />
                    )}
                    {i < currentStoryIndex && <div className="h-full bg-primary" />}
                  </div>
                ))}
              </div>
              <div
                className="relative w-full h-full"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchEnd={handleMouseUp}
              >
                <Image
                  src={stories[currentStoryIndex].imageUrl || "/placeholder.svg"}
                  alt={stories[currentStoryIndex].title}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40" />
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <div className="mb-4">
                    <h3 className="text-white text-xl font-bold mb-2">{stories[currentStoryIndex].title}</h3>
                    <p className="text-white text-sm">{stories[currentStoryIndex].content}</p>
                  </div>
                  <Link href={stories[currentStoryIndex].link}>
                    <Button className="w-full">Подробнее</Button>
                  </Link>
                </div>
              </div>
              <button className="absolute top-4 right-4 text-white" onClick={closeStory}>
                <X size={24} />
              </button>
              {currentStoryIndex > 0 && (
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
                  onClick={handlePrevStory}
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              {currentStoryIndex < stories.length - 1 && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2"
                  onClick={handleNextStory}
                >
                  <ChevronRight size={24} />
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

