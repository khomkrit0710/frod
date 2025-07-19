'use client'

import { useState, useEffect } from 'react'

interface IntroSlide {
  id: number
  image: string
}

interface IntroData {
  slides: IntroSlide[]
}

export default function IntroManagement() {
  const [introData, setIntroData] = useState<IntroData>({ slides: [] })
  const [loading, setLoading] = useState(true)
  const [editingSlide, setEditingSlide] = useState<IntroSlide | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadIntroData()
  }, [])

  const loadIntroData = async () => {
    try {
      const response = await fetch('/api/data/intro')
      const data = await response.json()
      setIntroData(data)
    } catch (error) {
      console.error('Error loading intro data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveIntroData = async (data: IntroData) => {
    try {
      const response = await fetch('/api/data/intro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await loadIntroData()
        alert('บันทึกข้อมูลสำเร็จ')
      }
    } catch (error) {
      console.error('Error saving intro data:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/logo', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        
        if (result.success) {
          setImagePreview(result.fileUrl)
        } else {
          alert(result.error || 'เกิดข้อผิดพลาดในการอัปโหลด')
        }
      } catch (error) {
        console.error('Upload error:', error)
        alert('เกิดข้อผิดพลาดในการอัปโหลด')
      } finally {
        setUploading(false)
      }
    }
  }

  const addSlide = () => {
    if (!imagePreview) {
      alert('กรุณาเลือกรูปภาพ')
      return
    }

    const newSlide: IntroSlide = {
      id: Date.now(),
      image: imagePreview
    }

    const updatedData = {
      ...introData,
      slides: [...introData.slides, newSlide]
    }

    setIntroData(updatedData)
    saveIntroData(updatedData)
    setShowAddForm(false)
    setImagePreview('')
  }

  const updateSlide = async () => {
    if (!editingSlide || !imagePreview) return

    // ลบไฟล์เก่าถ้ามีการเปลี่ยนรูปภาพ
    if (editingSlide.image !== imagePreview && editingSlide.image.startsWith('/logo/')) {
      try {
        await fetch('/api/upload/logo/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fileUrl: editingSlide.image }),
        })
      } catch (error) {
        console.error('Error deleting old file:', error)
      }
    }

    const updatedData = {
      ...introData,
      slides: introData.slides.map(slide =>
        slide.id === editingSlide.id
          ? { ...slide, image: imagePreview }
          : slide
      )
    }

    setIntroData(updatedData)
    saveIntroData(updatedData)
    setEditingSlide(null)
    setImagePreview('')
  }

  const deleteSlide = async (slideId: number) => {
    if (confirm('คุณแน่ใจว่าต้องการลบสไลด์นี้?')) {
      // หาสไลด์ที่จะลบ
      const slideToDelete = introData.slides.find(slide => slide.id === slideId)
      
      // ลบไฟล์รูปภาพถ้ามี
      if (slideToDelete?.image && slideToDelete.image.startsWith('/logo/')) {
        try {
          await fetch('/api/upload/logo/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileUrl: slideToDelete.image }),
          })
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      }
      
      const updatedData = {
        ...introData,
        slides: introData.slides.filter(slide => slide.id !== slideId)
      }

      setIntroData(updatedData)
      saveIntroData(updatedData)
    }
  }

  const openImagePopup = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setShowImagePopup(true)
  }

  const closeImagePopup = () => {
    setShowImagePopup(false)
    setSelectedImage('')
  }

  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการแบนเนอร์/สไลด์</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          เพิ่มสไลด์ใหม่
        </button>
      </div>

      {/* แสดงรายการสไลด์ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {introData.slides.map((slide) => (
          <div key={slide.id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            <div 
              className="aspect-video bg-gray-200 cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => openImagePopup(slide.image)}
            >
              <img
                src={slide.image}
                alt={`Slide ${slide.id}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setEditingSlide(slide)
                    setImagePreview(slide.image)
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => deleteSlide(slide.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ฟอร์มเพิ่มสไลด์ */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">เพิ่มสไลด์ใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกรูปภาพ
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full disabled:opacity-50"
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-1">กำลังอัปโหลด...</p>
                )}
              </div>
              {imagePreview && (
                <div className="aspect-video bg-gray-200 rounded">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={async () => {
                    // ถ้ามีการอัปโหลดไฟล์ใหม่แล้วยกเลิก ให้ลบไฟล์ที่อัปโหลด
                    if (imagePreview && imagePreview.startsWith('/logo/') && imagePreview !== (editingSlide?.image || '')) {
                      try {
                        await fetch('/api/upload/logo/delete', {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ fileUrl: imagePreview }),
                        })
                      } catch (error) {
                        console.error('Error deleting uploaded file:', error)
                      }
                    }
                    
                    setShowAddForm(false)
                    setImagePreview('')
                  }}
                  disabled={uploading}
                  className={`px-4 py-2 rounded transition-colors ${
                    uploading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addSlide}
                  disabled={uploading || !imagePreview}
                  className={`px-4 py-2 rounded transition-colors ${
                    uploading || !imagePreview
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploading ? 'กำลังบันทึก...' : 'เพิ่มสไลด์'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ฟอร์มแก้ไขสไลด์ */}
      {editingSlide && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">แก้ไขสไลด์</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  เลือกรูปภาพใหม่
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="w-full disabled:opacity-50"
                />
                {uploading && (
                  <p className="text-sm text-blue-600 mt-1">กำลังอัปโหลด...</p>
                )}
              </div>
              {imagePreview && (
                <div className="aspect-video bg-gray-200 rounded">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={async () => {
                    // ถ้ามีการอัปโหลดไฟล์ใหม่แล้วยกเลิก ให้ลบไฟล์ที่อัปโหลด
                    if (imagePreview && imagePreview.startsWith('/logo/') && imagePreview !== (editingSlide?.image || '')) {
                      try {
                        await fetch('/api/upload/logo/delete', {
                          method: 'DELETE',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ fileUrl: imagePreview }),
                        })
                      } catch (error) {
                        console.error('Error deleting uploaded file:', error)
                      }
                    }
                    
                    setEditingSlide(null)
                    setImagePreview('')
                  }}
                  disabled={uploading}
                  className={`px-4 py-2 rounded transition-colors ${
                    uploading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={updateSlide}
                  disabled={uploading || !imagePreview}
                  className={`px-4 py-2 rounded transition-colors ${
                    uploading || !imagePreview
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {uploading ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Popup */}
      {showImagePopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImagePopup}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImagePopup}
              className="absolute top-4 right-4 bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors z-10 shadow-lg"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
