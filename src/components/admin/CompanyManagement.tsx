'use client'

import { useState, useEffect } from 'react'

interface CompanyInfo {
  name: string
  description: string
  phone: string
  email: string
  address: string
}

interface WorkingHours {
  weekdays: string
  weekends: string
}

interface SocialMedia {
  id: number
  name: string
  url: string
  icon: string
}

interface CompanyData {
  companyInfo: CompanyInfo
  workingHours: WorkingHours
  socialMedia: SocialMedia[]
}

export default function CompanyManagement() {
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyInfo: {
      name: '',
      description: '',
      phone: '',
      email: '',
      address: ''
    },
    workingHours: {
      weekdays: '',
      weekends: ''
    },
    socialMedia: []
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editingSocial, setEditingSocial] = useState<SocialMedia | null>(null)
  const [showSocialForm, setShowSocialForm] = useState(false)

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    try {
      const response = await fetch('/api/data/company')
      const data = await response.json()
      setCompanyData(data)
    } catch (error) {
      console.error('Error loading company data:', error)
    }
  }

  const saveCompanyData = async () => {
    try {
      const response = await fetch('/api/data/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      })
      
      if (response.ok) {
        alert('บันทึกข้อมูลสำเร็จ!')
        setIsEditing(false)
        setShowSocialForm(false)
        setEditingSocial(null)
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
    } catch (error) {
      console.error('Error saving company data:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const handleCompanyInfoChange = (field: keyof CompanyInfo, value: string) => {
    setCompanyData({
      ...companyData,
      companyInfo: {
        ...companyData.companyInfo,
        [field]: value
      }
    })
  }

  const handleWorkingHoursChange = (field: keyof WorkingHours, value: string) => {
    setCompanyData({
      ...companyData,
      workingHours: {
        ...companyData.workingHours,
        [field]: value
      }
    })
  }

  const handleAddSocial = () => {
    const newSocial: SocialMedia = {
      id: Date.now(),
      name: '',
      url: '',
      icon: 'facebook'
    }
    setEditingSocial(newSocial)
    setShowSocialForm(true)
  }

  const handleEditSocial = (social: SocialMedia) => {
    setEditingSocial({ ...social })
    setShowSocialForm(true)
  }

  const handleDeleteSocial = (id: number) => {
    if (confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) {
      const updatedSocial = companyData.socialMedia.filter(social => social.id !== id)
      setCompanyData({
        ...companyData,
        socialMedia: updatedSocial
      })
    }
  }

  const handleSaveSocial = () => {
    if (!editingSocial) return

    const existingIndex = companyData.socialMedia.findIndex(s => s.id === editingSocial.id)
    
    if (existingIndex >= 0) {
      const updatedSocial = [...companyData.socialMedia]
      updatedSocial[existingIndex] = editingSocial
      setCompanyData({
        ...companyData,
        socialMedia: updatedSocial
      })
    } else {
      setCompanyData({
        ...companyData,
        socialMedia: [...companyData.socialMedia, editingSocial]
      })
    }
    
    setShowSocialForm(false)
    setEditingSocial(null)
  }

  const handleSocialChange = (field: keyof SocialMedia, value: string | number) => {
    if (editingSocial) {
      setEditingSocial({
        ...editingSocial,
        [field]: value
      })
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการข้อมูลบริษัท</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {isEditing ? 'ยกเลิกแก้ไข' : 'แก้ไขข้อมูล'}
          </button>
          {isEditing && (
            <button
              onClick={saveCompanyData}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              บันทึก
            </button>
          )}
        </div>
      </div>

      {/* Company Info Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-4">ข้อมูลบริษัท</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">ชื่อบริษัท</label>
            <input
              type="text"
              value={companyData.companyInfo.name}
              onChange={(e) => handleCompanyInfoChange('name', e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เบอร์โทรศัพท์</label>
            <input
              type="text"
              value={companyData.companyInfo.phone}
              onChange={(e) => handleCompanyInfoChange('phone', e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">อีเมล</label>
            <input
              type="email"
              value={companyData.companyInfo.email}
              onChange={(e) => handleCompanyInfoChange('email', e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">ที่อยู่</label>
            <input
              type="text"
              value={companyData.companyInfo.address}
              onChange={(e) => handleCompanyInfoChange('address', e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">รายละเอียดบริษัท</label>
            <textarea
              value={companyData.companyInfo.description}
              onChange={(e) => handleCompanyInfoChange('description', e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded h-24"
            />
          </div>
        </div>
      </div>

      {/* Working Hours Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-bold mb-4">เวลาทำการ</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">จันทร์ - ศุกร์</label>
            <input
              type="text"
              value={companyData.workingHours.weekdays}
              onChange={(e) => handleWorkingHoursChange('weekdays', e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
              placeholder="เช่น 09:00 - 18:00 น."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">เสาร์ - อาทิตย์</label>
            <input
              type="text"
              value={companyData.workingHours.weekends}
              onChange={(e) => handleWorkingHoursChange('weekends', e.target.value)}
              disabled={!isEditing}
              className="w-full p-2 border rounded"
              placeholder="เช่น 09:00 - 17:00 น."
            />
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Social Media</h3>
          {isEditing && (
            <button
              onClick={handleAddSocial}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              เพิ่ม Social Media
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companyData.socialMedia.map((social) => (
            <div key={social.id} className="border p-4 rounded">
              <h4 className="font-semibold">{social.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{social.url}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-2">
                {social.icon}
              </span>
              {isEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditSocial(social)}
                    className="flex-1 bg-yellow-500 text-white py-1 px-2 rounded text-sm hover:bg-yellow-600"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDeleteSocial(social.id)}
                    className="flex-1 bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-red-600"
                  >
                    ลบ
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Form Modal */}
      {showSocialForm && editingSocial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">
              {companyData.socialMedia.find(s => s.id === editingSocial.id) ? 'แก้ไข Social Media' : 'เพิ่ม Social Media'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อ</label>
                <input
                  type="text"
                  value={editingSocial.name}
                  onChange={(e) => handleSocialChange('name', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="เช่น Facebook"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL</label>
                <input
                  type="text"
                  value={editingSocial.url}
                  onChange={(e) => handleSocialChange('url', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="เช่น https://facebook.com/company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ไอคอน</label>
                <select
                  value={editingSocial.icon}
                  onChange={(e) => handleSocialChange('icon', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="line">Line</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveSocial}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                บันทึก
              </button>
              <button
                onClick={() => {
                  setShowSocialForm(false)
                  setEditingSocial(null)
                }}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
