
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface ImageData {
  logo: string
  footerLogo: string
  banner: string
}

interface PromotionData {
  [key: string]: Array<{
    id: number
    image: string
  }>
}

export default function page() {
  const router = useRouter()
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageData, setImageData] = useState<ImageData>({
    logo: '/logo/logo2.png', // default fallback
    footerLogo: '/image_test/logo.png',
    banner: '/logo/banner.jpg'
  })
  const [promotionCategories, setPromotionCategories] = useState<string[]>([])

  useEffect(() => {
    loadImageData()
    loadPromotionCategories()
  }, [])

  const loadImageData = async () => {
    try {
      const response = await fetch('/api/data/images')
      const data = await response.json()
      setImageData(data)
    } catch (error) {
      console.error('Error loading image data:', error)
    }
  }

  const loadPromotionCategories = async () => {
    try {
      const response = await fetch('/api/data/promotion')
      const data: PromotionData = await response.json()
      const categories = Object.keys(data)
      setPromotionCategories(categories)
    } catch (error) {
      console.error('Error loading promotion categories:', error)
    }
  }

  const scrollToSection = (sectionId: string) => {
    // ถ้าไม่ได้อยู่ในหน้าหลัก ให้กลับไปหน้าหลักพร้อมกับ scroll
    if (pathname !== '/') {
      router.push(`/?section=${sectionId}`)
      return
    }
    
    // ถ้าอยู่ในหน้าหลักแล้ว ให้ scroll ไปยังส่วนนั้น
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handlePromotionCategory = (category: string) => {
    const sectionId = `promotion-${category.toLowerCase()}`
    
    // ถ้าไม่ได้อยู่ในหน้าหลัก ให้กลับไปหน้าหลักพร้อมกับ scroll
    if (pathname !== '/') {
      router.push(`/?section=${sectionId}`)
      setIsDropdownOpen(false)
      return
    }
    
    // ถ้าอยู่ในหน้าหลักแล้ว ให้ scroll ไปยังส่วนนั้น
    scrollToSection(sectionId)
    setIsDropdownOpen(false)
  }

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-[#1e3b6d] shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div>
        <img 
          src={imageData.logo} 
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
                {promotionCategories.map((category) => (
                  <button 
                    key={category}
                    onClick={() => handlePromotionCategory(category)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </li>
          <li>
            <button 
              onClick={() => router.push('/contact')}
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
