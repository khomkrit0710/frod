'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import IntroManagement from '../../components/admin/IntroManagement'
import PromotionManagement from '../../components/admin/PromotionManagement'
import VideoManagement from '../../components/admin/VideoManagement'
import ImageManagement from '../../components/admin/ImageManagement'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('intro')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
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
    { id: 'intro', name: 'จัดการแบนเนอร์/สไลด์', icon: '🖼️' },
    { id: 'promotion', name: 'จัดการโปรโมชัน', icon: '🚗' },
    { id: 'video', name: 'จัดการวิดีโอ', icon: '📹' },
    { id: 'images', name: 'จัดการรูปภาพ', icon: '🖼️' }
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/logo/logo.jpg" alt="Ford Logo" className="h-10 w-auto mr-4" />
              <h1 className="text-2xl font-bold text-gray-900">Ford Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                ยินดีต้อนรับ, {localStorage.getItem('fordAdminUser')}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'intro' && <IntroManagement />}
        {activeTab === 'promotion' && <PromotionManagement />}
        {activeTab === 'video' && <VideoManagement />}
        {activeTab === 'images' && <ImageManagement />}
      </div>
    </div>
  )
}
