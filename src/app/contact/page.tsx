'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../layout/header/page'
import FooterPage from '../../layout/footer/page'

interface ContactData {
  contacts: Array<{
    id: number
    name: string
    type: string
    qrCode: string
    description: string
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
  const router = useRouter()
  const [contactData, setContactData] = useState<ContactData>({ contacts: [] })
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)
  const [selectedQR, setSelectedQR] = useState<string | null>(null)

  useEffect(() => {
    loadContactData()
    loadCompanyData()
  }, [])

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

  const ContactCard = ({ contact }: { contact: any }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{contact.name}</h3>
        <p className="text-gray-600 mb-4">{contact.description}</p>
        <div 
          className="relative overflow-hidden rounded-lg mb-4 cursor-pointer inline-block"
          onClick={() => setSelectedQR(contact.qrCode)}
        >
          <img 
            src={contact.qrCode}
            alt={`${contact.name} QR Code`}
            className="w-48 h-48 object-cover mx-auto transition-transform duration-300 hover:scale-105"
          />
        </div>
        <p className="text-sm text-gray-500">สแกน QR Code เพื่อติดต่อ</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="pt-4">

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Company Information Section */}
        {companyData && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">ข้อมูลติดต่อ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">เกี่ยวกับเรา</h3>
                <p className="text-gray-600 mb-4">{companyData.companyInfo.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">ติดต่อเรา</h3>
                <div className="space-y-2">
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {companyData.companyInfo.phone}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {companyData.companyInfo.email}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {companyData.companyInfo.address}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">เวลาทำการ</h3>
                <div className="space-y-1">
                  <p className="text-gray-600">{companyData.workingHours.weekdays}</p>
                  <p className="text-gray-600">{companyData.workingHours.weekends}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Codes Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">ช่องทางติดต่อ QR Code</h2>
          <p className="text-gray-600">สแกน QR Code เพื่อติดต่อกับเราผ่านช่องทางต่าง ๆ</p>
        </div>

        {contactData.contacts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contactData.contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลช่องทางติดต่อ</p>
          </div>
        )}
        </div>
      </div>

      {/* QR Code Popup Modal */}
      {selectedQR && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <FooterPage />
    </div>
  )
}
