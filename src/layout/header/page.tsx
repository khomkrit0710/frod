
'use client'

import { useState } from 'react'

export default function page() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1e3b6d] shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div>
        <img 
          src="/image_test/logo.png" 
          alt="Ford Logo"
          width={70}
          height={35}
          className="cursor-pointer"
          onClick={() => scrollToSection('intro')}
        />
      </div>
      <div>
        <ul className="flex gap-4 text-sm font-light text-white">
          <li>
            <button 
              onClick={() => scrollToSection('intro')}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              หน้าหลัก
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('working')}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              ผลงานของเรา
            </button>
          </li>
          <li className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
            >
              โปรโมชั่น
              <svg className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-blue-100 overflow-hidden">
                <button 
                  onClick={() => {
                    scrollToSection('promotion-ranger')
                    setIsDropdownOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  Ranger
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('promotion-everest')
                    setIsDropdownOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  Everest
                </button>
                <button 
                  onClick={() => {
                    scrollToSection('promotion-raptor')
                    setIsDropdownOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                >
                  Raptor
                </button>
              </div>
            )}
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('products')}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              อุปกรณ์ตกแต่ง
            </button>
          </li>
          <li>
            <button 
              onClick={() => scrollToSection('contact')}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              ติดต่อเรา
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
