'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import IntroManagement from '../../components/admin/IntroManagement'
import PromotionManagement from '../../components/admin/PromotionManagement'
import VideoManagement from '../../components/admin/VideoManagement'
import GalleryManagement from '../../components/admin/GalleryManagement'
import ContactManagement from '../../components/admin/ContactManagement'
import CompanyManagement from '../../components/admin/CompanyManagement'
import PasswordManagement from '../../components/admin/PasswordManagement'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('intro')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // ตรวจสอบสถานะการ login
    const loggedIn = localStorage.getItem('fordAdminLoggedIn')
    const user = localStorage.getItem('fordAdminUser')
    
    if (!loggedIn || !user) {
      router.push('/admin/login/ford')
    } else {
      setIsLoggedIn(true)
    }
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('fordAdminLoggedIn')
    localStorage.removeItem('fordAdminUser')
    router.push('/admin/login/ford')
  }

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    setIsMobileMenuOpen(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">กำลังโหลด...</div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  const tabs = [
    { id: 'intro', name: 'จัดการแบนเนอร์/สไลด์ & โลโก้', icon: '🖼️' },
    { id: 'promotion', name: 'จัดการโปรโมชัน', icon: '🚗' },
    { id: 'video', name: 'จัดการวิดีโอ', icon: '📹' },
    { id: 'gallery', name: 'จัดการแกลเลอรี่', icon: '🎨' },
    { id: 'contact', name: 'จัดการ QR Code', icon: '📞' },
    { id: 'company', name: 'จัดการข้อมูลบริษัท', icon: '🏢' },
    { id: 'password', name: 'เปลี่ยนรหัสผ่าน', icon: '🔑' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Ford Admin Dashboard</h1>
            </div>
            
            {/* Desktop User Info & Logout */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-600 text-sm">
                ยินดีต้อนรับ, {localStorage.getItem('fordAdminUser')}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                ออกจากระบบ
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 p-2 focus:outline-none"
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
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b shadow-sm">
          <div className="px-4 py-2 space-y-1">
            {/* Mobile User Info & Logout */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 mb-2">
              <span className="text-gray-600 text-sm">
                ยินดีต้อนรับ, {localStorage.getItem('fordAdminUser')}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
              >
                ออกจากระบบ
              </button>
            </div>
            
            {/* Mobile Navigation Items */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3 text-lg">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {activeTab === 'intro' && <IntroManagement />}
        {activeTab === 'promotion' && <PromotionManagement />}
        {activeTab === 'video' && <VideoManagement />}
        {activeTab === 'gallery' && <GalleryManagement />}
        {activeTab === 'contact' && <ContactManagement />}
        {activeTab === 'company' && <CompanyManagement />}
        {activeTab === 'password' && <PasswordManagement />}
      </div>
    </div>
  )
}
