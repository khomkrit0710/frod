'use client'

import { useState, useEffect } from 'react'

interface IntroSlide {
  id: number
  image: string
}

interface IntroData {
  slides: IntroSlide[]
}

interface ImageData {
  logo: string
  footerLogo: string
}

export default function IntroManagement() {
  const [activeTab, setActiveTab] = useState<'slides' | 'images'>('slides')
  const [introData, setIntroData] = useState<IntroData>({ slides: [] })
  const [imageData, setImageData] = useState<ImageData>({
    logo: '',
    footerLogo: ''
  })
  const [loading, setLoading] = useState(true)
  const [editingSlide, setEditingSlide] = useState<IntroSlide | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // States for image management
  const [imageLoading, setImageLoading] = useState(true)
  const [imageUploading, setImageUploading] = useState(false)
  const [previewImages, setPreviewImages] = useState<ImageData>({
    logo: '',
    footerLogo: ''
  })
  const [uploadingField, setUploadingField] = useState<string>('')

  useEffect(() => {
    loadIntroData()
    loadImageData()
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

  const loadImageData = async () => {
    try {
      const response = await fetch('/api/data/images')
      const data = await response.json()
      setImageData(data)
      setPreviewImages(data)
    } catch (error) {
      console.error('Error loading image data:', error)
    } finally {
      setImageLoading(false)
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
        alert('บันทึกข้อมูลสไลด์สำเร็จ')
      }
    } catch (error) {
      console.error('Error saving intro data:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const saveImageData = async (data: ImageData) => {
    try {
      setImageUploading(true)
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
      setImageUploading(false)
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

  // Image Management Functions
  const handleLogoImageUpload = async (imageType: keyof ImageData, e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleSaveImages = () => {
    saveImageData(imageData)
  }

  const handleResetImages = () => {
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

  if (loading || imageLoading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการแบนเนอร์/สไลด์และรูปภาพ</h2>
        {activeTab === 'slides' ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            เพิ่มสไลด์ใหม่
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleResetImages}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              รีเซ็ต
            </button>
            <button
              onClick={handleSaveImages}
              disabled={imageUploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {imageUploading ? 'กำลังบันทึก...' : 'บันทึกทั้งหมด'}
            </button>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('slides')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'slides'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🖼️ จัดการสไลด์/แบนเนอร์
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'images'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            🏢 จัดการโลโก้
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'slides' && (
        <div className="space-y-6">

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
        </div>
      )}

      {/* Images Tab Content */}
      {activeTab === 'images' && (
        <div className="space-y-6">
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
                      onChange={(e) => handleLogoImageUpload(key as keyof ImageData, e)}
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
