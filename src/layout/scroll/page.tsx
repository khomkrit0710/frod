'use client'

import { useRef, ReactNode, Children } from 'react'

interface ScrollContainerProps {
  children: ReactNode
  className?: string
}

export default function ScrollContainer({ children, className = '' }: ScrollContainerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const childrenCount = Children.count(children)
  const showScrollButtons = childrenCount > 5

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -400,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 400,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="relative">
      {/* Scroll Left Button - แสดงเฉพาะเมื่อมีรายการมากกว่า 5 */}
      {showScrollButtons && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 border border-blue-100 opacity-30 hover:opacity-100"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Scroll Right Button - แสดงเฉพาะเมื่อมีรายการมากกว่า 5 */}
      {showScrollButtons && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-200 border border-blue-100 opacity-30 hover:opacity-100"
        >
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Scrollable Content Container */}
      <div 
        ref={scrollContainerRef}
        className={`flex gap-3 overflow-x-auto scrollbar-hide ${showScrollButtons ? 'px-8' : 'px-0'} ${className}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>
    </div>
  )
}
