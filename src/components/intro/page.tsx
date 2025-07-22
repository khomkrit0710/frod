'use client'

import { useState, useEffect } from 'react'

interface IntroSlide {
  id: number
  image: string
}

interface IntroData {
  slides: IntroSlide[]
}

export default function IntroPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [introData, setIntroData] = useState<IntroData>({ slides: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIntroData()
  }, [])

  const loadIntroData = async () => {
    try {
      const response = await fetch('/api/data/intro')
      const data = await response.json()
      setIntroData(data)
    } catch (error) {
      console.error('Error loading intro data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (introData.slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % introData.slides.length)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [introData.slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <section id="intro" className="relative h-80 bg-white overflow-hidden flex items-center justify-center">
        <div className="text-gray-500">กำลังโหลด...</div>
      </section>
    )
  }

  if (introData.slides.length === 0) {
    return (
      <section id="intro" className="relative h-80 bg-gray-100 overflow-hidden flex items-center justify-center">
        <div className="text-gray-500">ไม่มีสไลด์แสดง</div>
      </section>
    )
  }

  return (
    <section id="intro" className="relative h-80 bg-white overflow-hidden">
      <div className="relative h-full">
        {introData.slides.map((slide, index) => (
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
        {introData.slides.map((_, index) => (
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
