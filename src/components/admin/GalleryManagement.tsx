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
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  
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

    const title = prompt('กรุณาใส่หัวข้อรูปภาพ (ไม่บังคับ):') || ''
    const description = prompt('กรุณาใส่คำอธิบายรูปภาพ (ไม่บังคับ):') || ''

    setUploading(true)
    try {
      const imageUrl = await galleryService.uploadImage(file)
      const newImage = await galleryService.create(imageUrl, title, description)
      
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

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image)
    setEditTitle(image.title || '')
    setEditDescription(image.description || '')
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingImage(null)
    setEditTitle('')
    setEditDescription('')
  }

  const handleUpdateImage = async () => {
    if (!editingImage) return

    try {
      const updatedImage = await galleryService.update(
        editingImage.id,
        undefined, // ไม่เปลี่ยน image_url
        editTitle,
        editDescription
      )
      
      setImages(prev => 
        prev.map(img => img.id === editingImage.id ? updatedImage : img)
      )
      
      closeEditModal()
      alert('อัปเดตข้อมูลสำเร็จ!')
    } catch (error) {
      console.error('Error updating image:', error)
      alert('เกิดข้อผิดพลาดในการอัปเดตข้อมูล')
    }
  }

  // Pagination
  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const currentImages = images.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการแกลเลอรี่รูปภาพ</h2>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploading ? 'กำลังอัพโหลด...' : 'เพิ่มรูปภาพใหม่'}
          </label>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentImages.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img
                src={item.image_url}
                alt={item.title || `รูปภาพ ${item.id}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openImagePopup(item.image_url)}
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2">
                {item.title || `รูปภาพ #${item.id}`}
              </h4>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description || 'รูปภาพจาก Ford Thailand'}
              </p>
              <div className="flex justify-between">
                <button
                  onClick={() => openEditModal(item)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => deleteItem(item)}
                  className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 transition-colors"
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
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            ก่อนหน้า
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 border rounded-md transition-colors ${
                currentPage === page 
                  ? 'bg-blue-600 text-white border-blue-600' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
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

      {/* Edit Modal */}
      {showEditModal && editingImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeEditModal}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4">แก้ไขข้อมูลรูปภาพ</h3>
            
            <div className="mb-4">
              <img
                src={editingImage.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded mb-3"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หัวข้อ
              </label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="ใส่หัวข้อรูปภาพ..."
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                คำอธิบาย
              </label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full p-2 border rounded-md h-20 resize-none"
                placeholder="ใส่คำอธิบายรูปภาพ..."
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleUpdateImage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="text-center text-gray-600">
        รวม {images.length} รูปภาพ
      </div>
    </div>
  )
}
