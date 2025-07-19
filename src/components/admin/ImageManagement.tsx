'use client'

import { useState, useEffect } from 'react'

interface ImageData {
  logo: string
  footerLogo: string
}

export default function ImageManagement() {
  const [imageData, setImageData] = useState<ImageData>({
    logo: '',
    footerLogo: ''
  })
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [previewImages, setPreviewImages] = useState<ImageData>({
    logo: '',
    footerLogo: ''
  })
  const [uploadingField, setUploadingField] = useState<string>('')

  useEffect(() => {
    loadImageData()
  }, [])

  const loadImageData = async () => {
    try {
      const response = await fetch('/api/data/images')
      const data = await response.json()
      setImageData(data)
      setPreviewImages(data)
    } catch (error) {
      console.error('Error loading image data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveImageData = async (data: ImageData) => {
    try {
      setUploading(true)
      const response = await fetch('/api/data/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await loadImageData()
        alert('บันทึกข้อมูลรูปภาพสำเร็จ')
      }
    } catch (error) {
      console.error('Error saving image data:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    } finally {
      setUploading(false)
    }
  }

  const handleImageUpload = async (imageType: keyof ImageData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadingField(imageType)
      
      try {
        // ลบไฟล์เก่าก่อนอัปโหลดไฟล์ใหม่
        if (imageData[imageType] && imageData[imageType].startsWith('/logo/')) {
          try {
            await fetch('/api/upload/logo/delete', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fileUrl: imageData[imageType] }),
            })
          } catch (error) {
            console.error('Error deleting old file:', error)
          }
        }

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/logo', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        
        if (result.success) {
          // อัปเดตข้อมูลรูปภาพ
          const updatedData = { ...imageData, [imageType]: result.fileUrl }
          setImageData(updatedData)
          setPreviewImages(updatedData)
        } else {
          alert(result.error || 'เกิดข้อผิดพลาดในการอัปโหลด')
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('เกิดข้อผิดพลาดในการอัปโหลด')
      } finally {
        setUploadingField('')
      }
    }
  }

  const handleSave = () => {
    saveImageData(imageData)
  }

  const handleReset = () => {
    setPreviewImages(imageData)
  }

  const getImageTypeLabel = (type: keyof ImageData) => {
    switch (type) {
      case 'logo': return 'โลโก้หลัก (Header)'
      case 'footerLogo': return 'โลโก้ Footer'
      default: return type
    }
  }

  const getImageDescription = (type: keyof ImageData) => {
    switch (type) {
      case 'logo': return 'โลโก้ที่แสดงในส่วนหัวของเว็บไซต์'
      case 'footerLogo': return 'โลโก้ที่แสดงในส่วนท้ายของเว็บไซต์'
      default: return ''
    }
  }

  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูลรูปภาพ...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการรูปภาพ</h2>
        <div className="space-x-2">
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            รีเซ็ต
          </button>
          <button
            onClick={handleSave}
            disabled={uploading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {uploading ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(imageData).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* แสดงรูปภาพปัจจุบัน */}
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              {previewImages[key as keyof ImageData] ? (
                <img
                  src={previewImages[key as keyof ImageData]}
                  alt={getImageTypeLabel(key as keyof ImageData)}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-center">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  ไม่มีรูปภาพ
                </div>
              )}
            </div>

            {/* ข้อมูลรูปภาพ */}
            <div className="p-4">
              <h4 className="font-bold text-lg mb-1">{getImageTypeLabel(key as keyof ImageData)}</h4>
              <p className="text-gray-600 text-sm mb-3">{getImageDescription(key as keyof ImageData)}</p>
              
              {/* Upload Input */}
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกรูปภาพใหม่
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(key as keyof ImageData, e)}
                  disabled={uploadingField === key}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {uploadingField === key && (
                  <p className="text-sm text-blue-600 mt-1">กำลังอัปโหลด...</p>
                )}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* คำแนะนำ */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">คำแนะนำการใช้งาน:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• รองรับไฟล์รูปภาพ: JPG, PNG, GIF, WebP</li>
          <li>• ขนาดที่แนะนำ: Logo (200x100px), Banner (1200x400px)</li>
          <li>• รูปภาพจะถูกเก็บในโฟลเดอร์ public/logo/</li>
          <li>• กดบันทึกทั้งหมดเพื่อนำการเปลี่ยนแปลงไปใช้ในเว็บไซต์</li>
        </ul>
      </div>
    </div>
  )
}
