'use client'

import { useState, useEffect } from 'react'
import { promotionService, Category, Promotion } from '@/lib/supabase-services'

interface CategoryWithPromotions extends Category {
  promotions: Promotion[]
}

export default function PromotionManagement() {
  const [categories, setCategories] = useState<CategoryWithPromotions[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState<{[key: number]: number}>({})
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const ITEMS_PER_PAGE = 6 // จำนวนรูปต่อหน้า (1 แถว)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [categoriesData, promotionsData] = await Promise.all([
        promotionService.getCategories(),
        promotionService.getPromotions()
      ])

      // Group promotions by category
      const categoriesWithPromotions: CategoryWithPromotions[] = categoriesData.map(category => ({
        ...category,
        promotions: promotionsData
          .filter(promotion => promotion.category_id === category.id)
          .map(promotion => ({
            id: promotion.id,
            category_id: promotion.category_id,
            image: promotion.image
          }))
      }))

      setCategories(categoriesWithPromotions)
    } catch (error) {
      console.error('Error loading data:', error)
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('กรุณาใส่ชื่อหมวดหมู่')
      return
    }

    if (categories.find(cat => cat.name === newCategoryName.trim())) {
      alert('หมวดหมู่นี้มีอยู่แล้ว')
      return
    }

    try {
      await promotionService.createCategory(newCategoryName.trim())
      await loadData()
      setShowAddCategoryForm(false)
      setNewCategoryName('')
      alert('เพิ่มหมวดหมู่สำเร็จ')
    } catch (error) {
      console.error('Error adding category:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มหมวดหมู่')
    }
  }

  const deleteCategory = async (category: CategoryWithPromotions) => {
    if (confirm(`คุณแน่ใจว่าต้องการลบหมวดหมู่ "${category.name}" และรูปภาพทั้งหมดในหมวดหมู่นี้?`)) {
      try {
        // Delete all images from storage first
        for (const promotion of category.promotions) {
          try {
            await promotionService.deleteImage(promotion.image)
          } catch (error) {
            console.error('Error deleting image:', error)
          }
        }
        
        // Delete category and all promotions
        await promotionService.deleteCategory(category.id)
        await loadData()
        alert('ลบหมวดหมู่สำเร็จ')
      } catch (error) {
        console.error('Error deleting category:', error)
        alert('เกิดข้อผิดพลาดในการลบหมวดหมู่')
      }
    }
  }

  const editCategoryName = async (category: CategoryWithPromotions, newName: string) => {
    if (!newName.trim()) {
      alert('กรุณาใส่ชื่อหมวดหมู่ใหม่')
      return
    }

    if (newName !== category.name && categories.find(cat => cat.name === newName.trim())) {
      alert('ชื่อหมวดหมู่นี้มีอยู่แล้ว')
      return
    }

    try {
      await promotionService.updateCategory(category.id, newName.trim())
      await loadData()
      setEditingCategory(null)
      alert('แก้ไขชื่อหมวดหมู่สำเร็จ')
    } catch (error) {
      console.error('Error editing category:', error)
      alert('เกิดข้อผิดพลาดในการแก้ไขชื่อหมวดหมู่')
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: CategoryWithPromotions) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      
      try {
        const imageUrl = await promotionService.uploadImage(file)
        await promotionService.createPromotion(category.id, imageUrl)
        await loadData()
        alert('อัปโหลดรูปภาพสำเร็จ')
      } catch (error) {
        console.error('Upload error:', error)
        alert('เกิดข้อผิดพลาดในการอัปโหลด')
      } finally {
        setUploading(false)
      }
    }
  }

  const deleteImage = async (category: CategoryWithPromotions, promotion: Promotion) => {
    if (confirm('คุณแน่ใจว่าต้องการลบรูปภาพนี้?')) {
      try {
        // Delete image from storage
        await promotionService.deleteImage(promotion.image)
        
        // Delete promotion record
        await promotionService.deletePromotion(promotion.id)
        
        await loadData()
        
        // Reset page if needed
        const updatedCategory = categories.find(cat => cat.id === category.id)
        if (updatedCategory) {
          const totalItems = updatedCategory.promotions.length - 1
          const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
          const currentPageNum = currentPage[category.id] || 0
          
          if (currentPageNum >= totalPages && totalPages > 0) {
            setCurrentPage(prev => ({
              ...prev,
              [category.id]: totalPages - 1
            }))
          }
        }
        
        alert('ลบรูปภาพสำเร็จ')
      } catch (error) {
        console.error('Error deleting image:', error)
        alert('เกิดข้อผิดพลาดในการลบรูปภาพ')
      }
    }
  }

  const getCurrentPageItems = (items: Promotion[], categoryId: number) => {
    const page = currentPage[categoryId] || 0
    const startIndex = page * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return items.slice(startIndex, endIndex)
  }

  const getTotalPages = (items: Promotion[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE)
  }

  const nextPage = (categoryId: number, totalPages: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [categoryId]: Math.min((prev[categoryId] || 0) + 1, totalPages - 1)
    }))
  }

  const prevPage = (categoryId: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [categoryId]: Math.max((prev[categoryId] || 0) - 1, 0)
    }))
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
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-4 md:p-6 rounded-xl shadow-lg border border-gray-100 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">จัดการโปรโมชันรถยนต์</h2>
          <p className="text-sm md:text-base text-gray-600">จัดการหมวดหมู่และรูปภาพโปรโมชัน Ford</p>
        </div>
        <button
          onClick={() => setShowAddCategoryForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>เพิ่มหมวดหมู่ใหม่</span>
        </button>
      </div>

      {/* แสดงรายการหมวดหมู่ */}
      {categories.map((category) => (
        <div key={category.id} className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-4 md:mb-6 gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              {editingCategory === category.id ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    defaultValue={category.name}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editCategoryName(category, (e.target as HTMLInputElement).value)
                      }
                      if (e.key === 'Escape') {
                        setEditingCategory(null)
                      }
                    }}
                    onBlur={(e) => editCategoryName(category, e.target.value)}
                    className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 border-2 border-blue-300 rounded-lg px-2 md:px-3 py-1 md:py-2 focus:outline-none focus:border-blue-500 w-full sm:w-auto"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="text-gray-500 hover:text-gray-700 text-lg md:text-xl"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <h3 
                  className="text-lg md:text-xl lg:text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                  onClick={() => setEditingCategory(category.id)}
                >
                  📁 {category.name} <span className="text-xs md:text-sm text-gray-500 ml-2">({category.promotions.length} รูป)</span>
                </h3>
              )}
              
              {/* ปุ่มอัปโหลดรูปภาพ */}
              <label className="bg-gradient-to-r from-green-600 to-green-700 text-white px-3 md:px-4 py-2 rounded-lg cursor-pointer hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base w-full sm:w-auto">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, category)}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
              <button
                onClick={() => setEditingCategory(category.id)}
                className="bg-yellow-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>แก้ไขชื่อ</span>
              </button>
              <button
                onClick={() => deleteCategory(category)}
                className="bg-red-500 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg flex items-center justify-center space-x-2 text-sm md:text-base"
              >
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>ลบหมวดหมู่</span>
              </button>
            </div>
          </div>

          {/* แสดงรูปภาพในหมวดหมู่ */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {getCurrentPageItems(category.promotions, category.id).map((promotion) => (
                <div key={promotion.id} className="relative group">
                  <div 
                    className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => openImagePopup(promotion.image)}
                  >
                    <img
                      src={promotion.image}
                      alt={`${category.name} ${promotion.id}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteImage(category, promotion)
                    }}
                    className="absolute top-1 right-1 md:top-2 md:right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10 text-xs md:text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {/* แสดงข้อความเมื่อไม่มีรูปภาพ */}
              {category.promotions.length === 0 && (
                <div className="col-span-full text-center py-6 md:py-8 text-gray-500 text-sm md:text-base">
                  ยังไม่มีรูปภาพในหมวดหมู่นี้
                </div>
              )}
            </div>

            {/* ปุ่มลูกศรและตัวบ่งชี้หน้า */}
            {category.promotions.length > ITEMS_PER_PAGE && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
                <button
                  onClick={() => prevPage(category.id)}
                  disabled={(currentPage[category.id] || 0) === 0}
                  className={`p-2 rounded-full shadow-md transition-all duration-200 order-1 sm:order-none ${
                    (currentPage[category.id] || 0) === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 order-3 sm:order-none">
                  <span className="text-xs md:text-sm text-gray-600">
                    หน้า {(currentPage[category.id] || 0) + 1} จาก {getTotalPages(category.promotions)}
                  </span>
                  <div className="flex space-x-1">
                    {Array.from({ length: getTotalPages(category.promotions) }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(prev => ({ ...prev, [category.id]: index }))}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === (currentPage[category.id] || 0)
                            ? 'bg-blue-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => nextPage(category.id, getTotalPages(category.promotions))}
                  disabled={(currentPage[category.id] || 0) === getTotalPages(category.promotions) - 1}
                  className={`p-2 rounded-full shadow-md transition-all duration-200 order-2 sm:order-none ${
                    (currentPage[category.id] || 0) === getTotalPages(category.promotions) - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* แสดงข้อความเมื่อไม่มีหมวดหมู่ */}
      {categories.length === 0 && (
        <div className="text-center py-12 md:py-16 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 md:w-12 md:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-700">ยังไม่มีหมวดหมู่</h3>
            <p className="text-sm md:text-base text-gray-500 max-w-md text-center px-4">
              เริ่มต้นโดยการสร้างหมวดหมู่แรกของคุณ เช่น Ranger, Everest หรือ Raptor
            </p>
            <button
              onClick={() => setShowAddCategoryForm(true)}
              className="bg-blue-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2 text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>เพิ่มหมวดหมู่แรก</span>
            </button>
          </div>
        </div>
      )}

      {/* ฟอร์มเพิ่มหมวดหมู่ */}
      {showAddCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 md:p-6 max-w-md w-full mx-4">
            <h3 className="text-lg md:text-xl font-bold mb-4">เพิ่มหมวดหมู่ใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหมวดหมู่ *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm md:text-base"
                  placeholder="เช่น Ranger, Everest, Raptor"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCategory()
                    }
                  }}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => {
                    setShowAddCategoryForm(false)
                    setNewCategoryName('')
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm md:text-base w-full sm:w-auto"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addCategory}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm md:text-base w-full sm:w-auto"
                >
                  เพิ่มหมวดหมู่
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Popup */}
      {showImagePopup && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 md:p-4"
          onClick={closeImagePopup}
        >
          <div className="relative max-w-4xl max-h-full w-full">
            <button
              onClick={closeImagePopup}
              className="absolute top-2 right-2 md:top-4 md:right-4 bg-white text-gray-800 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-gray-100 transition-colors z-10 shadow-lg text-sm md:text-base"
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
