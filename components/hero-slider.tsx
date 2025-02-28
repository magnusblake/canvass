"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  { id: 1, image: "/hero-slide-1.jpg" },
  { id: 2, image: "/hero-slide-2.jpg" },
  { id: 3, image: "/hero-slide-3.jpg" },
]

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [])

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-lg">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={slides[currentSlide].image || "/placeholder.svg"}
          alt="Background"
          fill
          className="object-cover filter blur-lg scale-110 opacity-50 transition-all duration-1000"
        />
      </div>
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image src={slide.image || "/placeholder.svg"} alt={`Slide ${index + 1}`} fill className="object-contain" />
        </div>
      ))}
      {currentSlide > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 text-gray-800"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      {currentSlide < slides.length - 1 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/80 text-gray-800"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

