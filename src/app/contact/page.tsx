'use client'

import { useState, useEffect } from 'react'
import Header from '../../layout/header/page'
import FooterPage from '../../layout/footer/page'
import introData from '../../data/intro.json'
import MapPage from '../../layout/map/page'
interface ContactData {
  contacts: Array<{
    id: number
    name: string
    type: string
    qrCode: string
    description: string
    url: string
  }>
}

interface CompanyData {
  companyInfo: {
    name: string
    description: string
    phone: string
    email: string
    address: string
  }
  workingHours: {
    weekdays: string
    weekends: string
  }
  socialMedia: Array<{
    id: number
    name: string
    url: string
    icon: string
  }>
}

export default function ContactPage() {
  const [contactData, setContactData] = useState<ContactData>({ contacts: [] })
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [selectedQR, setSelectedQR] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const { slides } = introData

  useEffect(() => {
    loadContactData()
    loadCompanyData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const loadContactData = async () => {
    try {
      const response = await fetch('/api/data/contact')
      const data = await response.json()
      setContactData(data)
    } catch (error) {
      console.error('Error loading contact data:', error)
    }
  }

  const loadCompanyData = async () => {
    try {
      const response = await fetch('/api/data/company')
      const data = await response.json()
      setCompanyData(data)
    } catch (error) {
      console.error('Error loading company data:', error)
    }
  }

  const ContactCard = ({ contact }: { contact: { id: number; name: string; type: string; qrCode: string; description: string; url: string } }) => (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">{contact.name}</h3>
        <p className="text-sm md:text-base text-gray-600 mb-4">{contact.description}</p>
        <div 
          className="relative overflow-hidden rounded-lg mb-4 cursor-pointer inline-block"
          onClick={() => setSelectedQR(contact.qrCode)}
        >
          <img 
            src={contact.qrCode}
            alt={`${contact.name} QR Code`}
            className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover mx-auto transition-transform duration-300 hover:scale-105"
          />
        </div>
        <p className="text-xs md:text-sm text-gray-500 mb-2">สแกน QR Code หรือคลิ๊กเพื่อติดต่อ</p>
        {contact.url && (
          <a
            href={contact.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors duration-200"
          >
            เยื่ยมชม {contact.name}
          </a>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="pt-2 md:pt-4">

      {/* Content */}
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Top Section: Image Slider (Left) + Company Information (Right) */}
        <div className="bg-white rounded-lg shadow-md mb-6 md:mb-8 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[300px] md:min-h-[400px]">
            {/* Left Side - Image Slider */}
            <div className="relative h-full bg-gray-50">
              <div className="relative h-full min-h-[300px] md:min-h-[400px]">
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
                        alt="company banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ))}
                
                {/* Slide Indicators */}
                {slides.length > 1 && (
                  <div className="absolute bottom-2 md:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
                )}
              </div>
            </div>
            
            {/* Right Side - Company Information */}
            <div className="p-4 md:p-6 lg:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">ข้อมูลติดต่อ</h2>
              {companyData && (
                <div className="space-y-4 md:space-y-6">
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">เกี่ยวกับเรา</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{companyData.companyInfo.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">ติดต่อเรา</h3>
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-sm md:text-base text-gray-600 flex items-center gap-2 md:gap-3">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="break-all">{companyData.companyInfo.phone}</span>
                      </p>
                      <p className="text-sm md:text-base text-gray-600 flex items-center gap-2 md:gap-3">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="break-all">{companyData.companyInfo.email}</span>
                      </p>
                      <p className="text-sm md:text-base text-gray-600 flex items-start gap-2 md:gap-3">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{companyData.companyInfo.address}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 md:mb-3">เวลาทำการ</h3>
                    <div className="space-y-1 md:space-y-2">
                      <p className="text-sm md:text-base text-gray-600 flex items-center gap-2 md:gap-3">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{companyData.workingHours.weekdays}</span>
                      </p>
                      <p className="text-sm md:text-base text-gray-600 flex items-center gap-2 md:gap-3">
                        <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{companyData.workingHours.weekends}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* QR Codes Section */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-4">ช่องทางติดต่อ QR Code</h2>
          <p className="text-sm md:text-base text-gray-600">สแกน QR Code หรือคลิ๊กปุ่มเพื่อติดต่อกับเราผ่านช่องทางต่าง ๆ</p>
        </div>

        {contactData.contacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {contactData.contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-500 text-base md:text-lg">ไม่พบข้อมูลช่องทางติดต่อ</p>
          </div>
        )}
        </div>
      </div>

      {/* QR Code Popup Modal */}
      {selectedQR && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedQR(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedQR}
              alt="QR Code"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedQR(null)}
              className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors text-lg md:text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <MapPage />

      <FooterPage />
    </div>
  )
}
