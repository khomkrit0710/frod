'use client'

import { useState, useEffect } from 'react'
import { galleryService, GalleryImage } from '@/lib/supabase-services'

export default function GalleryManagement() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  
  const ITEMS_PER_PAGE = 6

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const data = await galleryService.getAll()
      setImages(data)
    } catch (error) {
      console.error('Error loading images:', error)
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const imageUrl = await galleryService.uploadImage(file)
      const newImage = await galleryService.create(imageUrl)
      
      setImages(prev => [newImage, ...prev])
      alert('อัปโหลดรูปภาพสำเร็จ!')
      
      // รีเซ็ต input
      event.target.value = ''
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('เกิดข้อผิดพลาดในการอัปโหลดไฟล์')
    } finally {
      setUploading(false)
    }
  }

  const deleteItem = async (item: GalleryImage) => {
    if (confirm('คุณแน่ใจว่าต้องการลบรูปภาพนี้?')) {
      try {
        // ลบไฟล์จาก Storage
        await galleryService.deleteImage(item.image_url)
        
        // ลบจากฐานข้อมูล
        await galleryService.delete(item.id)
        
        // อัปเดต state
        setImages(prev => prev.filter(img => img.id !== item.id))
        alert('ลบรูปภาพสำเร็จ!')
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('เกิดข้อผิดพลาดในการลบรูปภาพ')
      }
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

  // Pagination
  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentImages = images.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) {
    return <div className="p-6">กำลังโหลด...</div>
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">จัดการแกลเลอรี่รูปภาพ</h2>
        
        {/* Upload Section */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">เพิ่มรูปภาพใหม่</h3>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="flex-1 p-2 border rounded"
            />
            {uploading && <span className="text-blue-600">กำลังอัพโหลด...</span>}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            รองรับไฟล์: JPG, PNG, GIF (ขนาดสูงสุด 10MB)
          </p>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentImages.map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="mb-3">
              <img
                src={item.image_url}
                alt={`รูปภาพ ${item.id}`}
                className="w-full h-48 object-cover rounded cursor-pointer"
                onClick={() => openImagePopup(item.image_url)}
              />
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">รูปภาพ #{item.id}</h4>
              <p className="text-sm text-gray-600 mb-3">รูปภาพจาก Ford Thailand</p>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteItem(item)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImagePopup}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <img
              src={selectedImage}
              alt="รูปภาพขยาย"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={closeImagePopup}
              className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="mt-6 text-center text-gray-600">
        รวม {images.length} รูปภาพ
      </div>
    </div>
  )
}
