'use client'

import { useState, useEffect } from 'react'
import { companyService } from '@/lib/supabase-services'

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

interface CompanyData {
  companyInfo: CompanyInfo
  workingHours: WorkingHours
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
    }
  })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    loadCompanyData()
  }, [])

  const loadCompanyData = async () => {
    try {
      // Load company info
      const companyInfo = await companyService.getCompanyInfo()
      const workingHours = await companyService.getWorkingHours()

      setCompanyData({
        companyInfo: companyInfo ? {
          name: companyInfo.name,
          description: companyInfo.description,
          phone: companyInfo.phone,
          email: companyInfo.email,
          address: companyInfo.address
        } : {
          name: '',
          description: '',
          phone: '',
          email: '',
          address: ''
        },
        workingHours: workingHours ? {
          weekdays: workingHours.weekdays,
          weekends: workingHours.weekends
        } : {
          weekdays: '',
          weekends: ''
        }
      })
    } catch (error) {
      console.error('Error loading company data:', error)
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    }
  }

  const saveCompanyData = async () => {
    try {
      // Save company info
      await companyService.updateCompanyInfo(companyData.companyInfo)
      
      // Save working hours
      await companyService.updateWorkingHours(companyData.workingHours)
      
      alert('บันทึกข้อมูลสำเร็จ!')
      setIsEditing(false)
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
    </div>
  )
}
