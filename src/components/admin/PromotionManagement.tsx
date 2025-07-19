'use client'

import { useState, useEffect } from 'react'

interface PromotionItem {
  id: number
  name: string
  price: string
  originalPrice: string
  discount: string
  warranty: string
  colors: string[]
  description: string
  features: string[]
  image: string
}

interface PromotionData {
  Ranger: PromotionItem[]
  Everest: PromotionItem[]
  Raptor: PromotionItem[]
}

export default function PromotionManagement() {
  const [promotionData, setPromotionData] = useState<PromotionData>({
    Ranger: [],
    Everest: [],
    Raptor: []
  })
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<PromotionItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<keyof PromotionData>('Ranger')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [formData, setFormData] = useState<Partial<PromotionItem>>({
    name: '',
    price: '',
    originalPrice: '',
    discount: '',
    warranty: '',
    colors: [],
    description: '',
    features: [],
    image: ''
  })

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData(prev => ({ ...prev, image: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof PromotionItem, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addPromotion = () => {
    if (!formData.name || !formData.price || !formData.image) {
      alert('กรุณากรอกข้อมูลที่จำเป็น')
      return
    }

    const newItem: PromotionItem = {
      id: Date.now(),
      name: formData.name || '',
      price: formData.price || '',
      originalPrice: formData.originalPrice || '',
      discount: formData.discount || '',
      warranty: formData.warranty || '',
      colors: formData.colors || [],
      description: formData.description || '',
      features: formData.features || [],
      image: formData.image || ''
    }

    const updatedData = {
      ...promotionData,
      [selectedCategory]: [...promotionData[selectedCategory], newItem]
    }

    setPromotionData(updatedData)
    savePromotionData(updatedData)
    setShowAddForm(false)
    resetForm()
  }

  const updatePromotion = () => {
    if (!editingItem || !formData.name || !formData.price) return

    const updatedItem: PromotionItem = {
      ...editingItem,
      name: formData.name || '',
      price: formData.price || '',
      originalPrice: formData.originalPrice || '',
      discount: formData.discount || '',
      warranty: formData.warranty || '',
      colors: formData.colors || [],
      description: formData.description || '',
      features: formData.features || [],
      image: formData.image || editingItem.image
    }

    const updatedData = {
      ...promotionData,
      [selectedCategory]: promotionData[selectedCategory].map(item =>
        item.id === editingItem.id ? updatedItem : item
      )
    }

    setPromotionData(updatedData)
    savePromotionData(updatedData)
    setEditingItem(null)
    resetForm()
  }

  const deletePromotion = (itemId: number, category: keyof PromotionData) => {
    if (confirm('คุณแน่ใจว่าต้องการลบรายการนี้?')) {
      const updatedData = {
        ...promotionData,
        [category]: promotionData[category].filter(item => item.id !== itemId)
      }

      setPromotionData(updatedData)
      savePromotionData(updatedData)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      discount: '',
      warranty: '',
      colors: [],
      description: '',
      features: [],
      image: ''
    })
    setImagePreview('')
  }

  const startEdit = (item: PromotionItem, category: keyof PromotionData) => {
    setEditingItem(item)
    setSelectedCategory(category)
    setFormData(item)
    setImagePreview(item.image)
  }

  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการโปรโมชันรถยนต์</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          เพิ่มโปรโมชันใหม่
        </button>
      </div>

      {/* แสดงรายการโปรโมชันแยกตามหมวดหมู่ */}
      {Object.entries(promotionData).map(([category, items]) => (
        <div key={category} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4 text-blue-600">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item: PromotionItem) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="aspect-video bg-gray-200 rounded mb-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <h4 className="font-bold text-lg mb-2">{item.name}</h4>
                <p className="text-green-600 font-bold mb-2">฿{item.price}</p>
                <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                <div className="flex justify-between">
                  <button
                    onClick={() => startEdit(item, category as keyof PromotionData)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => deletePromotion(item.id, category as keyof PromotionData)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ฟอร์มเพิ่ม/แก้ไขโปรโมชัน */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 my-8">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'แก้ไขโปรโมชัน' : 'เพิ่มโปรโมชันใหม่'}
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {/* หมวดหมู่ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  หมวดหมู่
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as keyof PromotionData)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={!!editingItem}
                >
                  <option value="Ranger">Ranger</option>
                  <option value="Everest">Everest</option>
                  <option value="Raptor">Raptor</option>
                </select>
              </div>

              {/* ชื่อรุ่น */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อรุ่น *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="เช่น Ford Ranger Raptor"
                />
              </div>

              {/* ราคา */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ราคา *
                  </label>
                  <input
                    type="text"
                    value={formData.price || ''}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="1,899,000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ราคาเดิม
                  </label>
                  <input
                    type="text"
                    value={formData.originalPrice || ''}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="2,100,000"
                  />
                </div>
              </div>

              {/* คำอธิบาย */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="คำอธิบายสินค้า..."
                />
              </div>

              {/* รูปภาพ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปภาพ *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full"
                />
                {imagePreview && (
                  <div className="mt-2 aspect-video bg-gray-200 rounded">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingItem(null)
                  resetForm()
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={editingItem ? updatePromotion : addPromotion}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {editingItem ? 'บันทึก' : 'เพิ่มโปรโมชัน'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
