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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

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
            <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-50 to-white">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="text-gray-800">
                    <h2 className="text-sm text-red-600 font-light mb-2">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-2xl md:text-3xl font-light text-blue-900 mb-3">
                      {slide.title}
                    </h1>
                    <p className="text-sm mb-4 text-gray-600 leading-relaxed">
                      {slide.description}
                    </p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-light hover:bg-blue-700 transition-colors duration-200">
                      {slide.buttonText}
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="max-w-xs w-full h-auto object-cover rounded-md shadow-sm"
                    />
                  </div>
                </div>
              </div>
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
