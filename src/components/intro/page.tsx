'use client'

import { useState, useEffect } from 'react'
import introData from '../../data/intro.json'

export default function IntroPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { slides } = introData

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <section id="intro" className="relative h-80 bg-white overflow-hidden">
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-full h-full">
              <img 
                src={slide.image} 
                alt="banner"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
