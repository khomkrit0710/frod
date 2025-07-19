'use client'

import { useState, useEffect } from 'react'

interface PromotionItem {
  id: number
  image: string
}

interface PromotionData {
  [key: string]: PromotionItem[]
}

export default function PromotionManagement() {
  const [promotionData, setPromotionData] = useState<PromotionData>({})
  const [loading, setLoading] = useState(true)
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategory, setEditingCategory] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<{[key: string]: number}>({})
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [showImagePopup, setShowImagePopup] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const ITEMS_PER_PAGE = 6 // จำนวนรูปต่อหน้า (1 แถว)

  useEffect(() => {
    loadPromotionData()
  }, [])

  const loadPromotionData = async () => {
    try {
      const response = await fetch('/api/data/promotion')
      const data = await response.json()
      setPromotionData(data)
    } catch (error) {
      console.error('Error loading promotion data:', error)
    } finally {
      setLoading(false)
    }
  }

  const savePromotionData = async (data: PromotionData) => {
    try {
      const response = await fetch('/api/data/promotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await loadPromotionData()
        alert('บันทึกข้อมูลสำเร็จ')
      }
    } catch (error) {
      console.error('Error saving promotion data:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const addCategory = () => {
    if (!newCategoryName.trim()) {
      alert('กรุณาใส่ชื่อหมวดหมู่')
      return
    }

    if (promotionData[newCategoryName]) {
      alert('หมวดหมู่นี้มีอยู่แล้ว')
      return
    }

    const updatedData = {
      ...promotionData,
      [newCategoryName]: []
    }

    setPromotionData(updatedData)
    savePromotionData(updatedData)
    setShowAddCategoryForm(false)
    setNewCategoryName('')
  }

  const deleteCategory = async (categoryName: string) => {
    if (confirm(`คุณแน่ใจว่าต้องการลบหมวดหมู่ "${categoryName}" และรูปภาพทั้งหมดในหมวดหมู่นี้?`)) {
      // ลบไฟล์รูปภาพทั้งหมดในหมวดหมู่
      const itemsToDelete = promotionData[categoryName] || []
      for (const item of itemsToDelete) {
        if (item.image && item.image.startsWith('/promotions/')) {
          try {
            await fetch('/api/upload/promotions/delete', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ fileUrl: item.image }),
            })
          } catch (error) {
            console.error('Error deleting file:', error)
          }
        }
      }
      
      const updatedData = { ...promotionData }
      delete updatedData[categoryName]
      
      setPromotionData(updatedData)
      savePromotionData(updatedData)
    }
  }

  const editCategoryName = (oldName: string, newName: string) => {
    if (!newName.trim()) {
      alert('กรุณาใส่ชื่อหมวดหมู่ใหม่')
      return
    }

    if (newName !== oldName && promotionData[newName]) {
      alert('ชื่อหมวดหมู่นี้มีอยู่แล้ว')
      return
    }

    const updatedData = { ...promotionData }
    updatedData[newName] = updatedData[oldName]
    if (newName !== oldName) {
      delete updatedData[oldName]
    }

    setPromotionData(updatedData)
    savePromotionData(updatedData)
    setEditingCategory('')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, categoryName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploading(true)
      
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload/promotions', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        
        if (result.success) {
          const newItem: PromotionItem = {
            id: Date.now(),
            image: result.fileUrl
          }

          const updatedData = {
            ...promotionData,
            [categoryName]: [...(promotionData[categoryName] || []), newItem]
          }

          setPromotionData(updatedData)
          savePromotionData(updatedData)
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

  const deleteImage = async (categoryName: string, imageId: number) => {
    if (confirm('คุณแน่ใจว่าต้องการลบรูปภาพนี้?')) {
      // หารูปภาพที่จะลบ
      const imageToDelete = promotionData[categoryName].find(item => item.id === imageId)
      
      // ลบไฟล์รูปภาพถ้ามี
      if (imageToDelete?.image && imageToDelete.image.startsWith('/promotions/')) {
        try {
          await fetch('/api/upload/promotions/delete', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileUrl: imageToDelete.image }),
          })
        } catch (error) {
          console.error('Error deleting file:', error)
        }
      }
      
      const updatedData = {
        ...promotionData,
        [categoryName]: promotionData[categoryName].filter(item => item.id !== imageId)
      }

      setPromotionData(updatedData)
      savePromotionData(updatedData)
      
      // รีเซ็ตหน้าเป็น 0 ถ้าหลังจากลบแล้วไม่มีรูปในหน้าปัจจุบัน
      const totalItems = updatedData[categoryName].length
      const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
      const currentPageNum = currentPage[categoryName] || 0
      
      if (currentPageNum >= totalPages && totalPages > 0) {
        setCurrentPage(prev => ({
          ...prev,
          [categoryName]: totalPages - 1
        }))
      }
    }
  }

  const getCurrentPageItems = (items: PromotionItem[], categoryName: string) => {
    const page = currentPage[categoryName] || 0
    const startIndex = page * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return items.slice(startIndex, endIndex)
  }

  const getTotalPages = (items: PromotionItem[]) => {
    return Math.ceil(items.length / ITEMS_PER_PAGE)
  }

  const nextPage = (categoryName: string, totalPages: number) => {
    setCurrentPage(prev => ({
      ...prev,
      [categoryName]: Math.min((prev[categoryName] || 0) + 1, totalPages - 1)
    }))
  }

  const prevPage = (categoryName: string) => {
    setCurrentPage(prev => ({
      ...prev,
      [categoryName]: Math.max((prev[categoryName] || 0) - 1, 0)
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
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">จัดการโปรโมชันรถยนต์</h2>
          <p className="text-gray-600">จัดการหมวดหมู่และรูปภาพโปรโมชัน Ford</p>
        </div>
        <button
          onClick={() => setShowAddCategoryForm(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>เพิ่มหมวดหมู่ใหม่</span>
        </button>
      </div>

      {/* แสดงรายการหมวดหมู่ */}
      {Object.entries(promotionData).map(([categoryName, items]) => (
        <div key={categoryName} className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-6">
              {editingCategory === categoryName ? (
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    defaultValue={categoryName}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        editCategoryName(categoryName, (e.target as HTMLInputElement).value)
                      }
                      if (e.key === 'Escape') {
                        setEditingCategory('')
                      }
                    }}
                    onBlur={(e) => editCategoryName(categoryName, e.target.value)}
                    className="text-2xl font-bold text-blue-600 border-2 border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => setEditingCategory('')}
                    className="text-gray-500 hover:text-gray-700 text-xl"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <h3 
                  className="text-2xl font-bold text-blue-600 cursor-pointer hover:text-blue-800 transition-colors"
                  onClick={() => setEditingCategory(categoryName)}
                >
                  📁 {categoryName} <span className="text-sm text-gray-500 ml-2">({items.length} รูป)</span>
                </h3>
              )}
              
              {/* ปุ่มอัปโหลดรูปภาพ */}
              <label className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg cursor-pointer hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>{uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูปภาพ'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, categoryName)}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setEditingCategory(categoryName)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>แก้ไขชื่อ</span>
              </button>
              <button
                onClick={() => deleteCategory(categoryName)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>ลบหมวดหมู่</span>
              </button>
            </div>
          </div>

          {/* แสดงรูปภาพในหมวดหมู่ */}
          <div className="relative">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {getCurrentPageItems(items, categoryName).map((item) => (
                <div key={item.id} className="relative group">
                  <div 
                    className="aspect-[4/5] bg-gray-200 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    onClick={() => openImagePopup(item.image)}
                  >
                    <img
                      src={item.image}
                      alt={`${categoryName} ${item.id}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteImage(categoryName, item.id)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  >
                    ✕
                  </button>
                </div>
              ))}
              
              {/* แสดงข้อความเมื่อไม่มีรูปภาพ */}
              {items.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  ยังไม่มีรูปภาพในหมวดหมู่นี้
                </div>
              )}
            </div>

            {/* ปุ่มลูกศรและตัวบ่งชี้หน้า */}
            {items.length > ITEMS_PER_PAGE && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => prevPage(categoryName)}
                  disabled={(currentPage[categoryName] || 0) === 0}
                  className={`p-2 rounded-full shadow-md transition-all duration-200 ${
                    (currentPage[categoryName] || 0) === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">
                    หน้า {(currentPage[categoryName] || 0) + 1} จาก {getTotalPages(items)}
                  </span>
                  <div className="flex space-x-1">
                    {Array.from({ length: getTotalPages(items) }, (_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(prev => ({ ...prev, [categoryName]: index }))}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === (currentPage[categoryName] || 0)
                            ? 'bg-blue-600'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => nextPage(categoryName, getTotalPages(items))}
                  disabled={(currentPage[categoryName] || 0) === getTotalPages(items) - 1}
                  className={`p-2 rounded-full shadow-md transition-all duration-200 ${
                    (currentPage[categoryName] || 0) === getTotalPages(items) - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* แสดงข้อความเมื่อไม่มีหมวดหมู่ */}
      {Object.keys(promotionData).length === 0 && (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700">ยังไม่มีหมวดหมู่</h3>
            <p className="text-gray-500 max-w-md">
              เริ่มต้นโดยการสร้างหมวดหมู่แรกของคุณ เช่น Ranger, Everest หรือ Raptor
            </p>
            <button
              onClick={() => setShowAddCategoryForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>เพิ่มหมวดหมู่แรก</span>
            </button>
          </div>
        </div>
      )}

      {/* ฟอร์มเพิ่มหมวดหมู่ */}
      {showAddCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">เพิ่มหมวดหมู่ใหม่</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อหมวดหมู่ *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="เช่น Ranger, Everest, Raptor"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      addCategory()
                    }
                  }}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setShowAddCategoryForm(false)
                    setNewCategoryName('')
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={addCategory}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
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
