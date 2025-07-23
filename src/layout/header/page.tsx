
'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { promotionService, Category } from '../../lib/supabase-services'

interface ImageData {
  logo: string
  footerLogo: string
  banner: string
}

export default function Page() {
  const router = useRouter()
  const pathname = usePathname()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [imageData, setImageData] = useState<ImageData>({
    logo: '/logo/logo2.png',
    footerLogo: '/image_test/logo.png',
    banner: '/logo/banner.jpg'
  })
  const [promotionCategories, setPromotionCategories] = useState<Category[]>([])

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
      const categories = await promotionService.getCategories()
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

  const handlePromotionCategory = (categoryName: string) => {
    const sectionId = `promotion-${categoryName.toLowerCase()}`
    
    // ถ้าไม่ได้อยู่ในหน้าหลัก ให้กลับไปหน้าหลักพร้อมกับ scroll
    if (pathname !== '/') {
      router.push(`/?section=${sectionId}`)
      setIsDropdownOpen(false)
      setIsMobileMenuOpen(false)
      return
    }
    
    // ถ้าอยู่ในหน้าหลักแล้ว ให้ scroll ไปยังส่วนนั้น
    scrollToSection(sectionId)
    setIsDropdownOpen(false)
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = (action: () => void) => {
    action()
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="bg-[#1e3b6d] shadow-sm border-b border-blue-100 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 md:px-10">
        {/* Logo */}
        <div>
          <img 
            src={imageData.logo} 
            alt="Ford Logo"
            width={56}
            height={35}
            className="cursor-pointer"
            onClick={() => scrollToSection('intro')}
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:block">
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
                      key={category.id}
                      onClick={() => handlePromotionCategory(category.name)}
                      className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                      {category.name}
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

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#1e3b6d] border-t border-blue-100">
          <div className="px-4 py-2 space-y-1">
            <button 
              onClick={() => handleNavClick(() => scrollToSection('intro'))}
              className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              หน้าหลัก
            </button>
            <button 
              onClick={() => handleNavClick(() => scrollToSection('working'))}
              className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              ผลงานของเรา
            </button>
            
            {/* Mobile Promotion Dropdown */}
            <div>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
              >
                โปรโมชั่น
                <svg className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {promotionCategories.map((category) => (
                    <button 
                      key={category.id}
                      onClick={() => handlePromotionCategory(category.name)}
                      className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button 
              onClick={() => handleNavClick(() => router.push('/contact'))}
              className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-700 rounded-md transition-colors duration-200"
            >
              ติดต่อเรา
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
