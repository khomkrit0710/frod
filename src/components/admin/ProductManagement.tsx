'use client'

import { useState, useEffect } from 'react'
import { productService, Product } from '@/lib/supabase-services'

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [originalImage, setOriginalImage] = useState<string>('')
  const [formProduct, setFormProduct] = useState<Partial<Product>>({
    name: '',
    price: '',
    original_price: '',
    discount: '',
    warranty: '',
    colors: [],
    description: '',
    features: [],
    image: ''
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // ลบไฟล์เก่าก่อนอัปโหลดไฟล์ใหม่
      if (formProduct?.image && formProduct.image !== originalImage) {
        try {
          await productService.deleteImage(formProduct.image)
        } catch (error) {
          console.error('Error deleting old file:', error)
        }
      }

      const imageUrl = await productService.uploadImage(file)
      setImagePreview(imageUrl)
      setFormProduct(prev => ({ ...prev, image: imageUrl }))
      alert('อัปโหลดรูปภาพสำเร็จ!')
    } catch (error) {
      console.error('Upload error:', error)
      alert('เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formProduct) return

    try {
      if (editingProduct) {
        const updatedProduct = await productService.update(editingProduct.id, {
          name: formProduct.name || '',
          price: formProduct.price || '',
          original_price: formProduct.original_price || '',
          discount: formProduct.discount || '',
          warranty: formProduct.warranty || '',
          colors: formProduct.colors || [],
          description: formProduct.description || '',
          features: formProduct.features || [],
          image: formProduct.image || ''
        })
        
        setProducts(products.map(p =>
          p.id === editingProduct.id ? updatedProduct : p
        ))
      } else {
        const newProduct = await productService.create({
          name: formProduct.name || '',
          price: formProduct.price || '',
          original_price: formProduct.original_price || '',
          discount: formProduct.discount || '',
          warranty: formProduct.warranty || '',
          colors: formProduct.colors || [],
          description: formProduct.description || '',
          features: formProduct.features || [],
          image: formProduct.image || ''
        })
        
        setProducts([...products, newProduct])
      }
      
      alert('บันทึกข้อมูลสำเร็จ!')
      resetForm()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormProduct(product)
    setImagePreview(product.image)
    setOriginalImage(product.image)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm('คุณต้องการลบสินค้านี้หรือไม่?')) {
      try {
        // หาข้อมูล product ที่จะลบ
        const productToDelete = products.find(product => product.id === id)
        
        // ลบไฟล์รูปภาพถ้ามี
        if (productToDelete?.image) {
          try {
            await productService.deleteImage(productToDelete.image)
          } catch (error) {
            console.error('Error deleting image:', error)
          }
        }
        
        await productService.delete(id)
        setProducts(products.filter(product => product.id !== id))
        alert('ลบข้อมูลสำเร็จ!')
      } catch (error) {
        console.error('Error deleting product:', error)
        alert('เกิดข้อผิดพลาดในการลบข้อมูล')
      }
    }
  }

  const resetForm = () => {
    setFormProduct({
      name: '',
      price: '',
      original_price: '',
      discount: '',
      warranty: '',
      colors: [],
      description: '',
      features: [],
      image: ''
    })
    setImageFile(null)
    setImagePreview('')
    setOriginalImage('')
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleArrayInput = (value: string, field: 'colors' | 'features') => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormProduct(prev => ({ ...prev, [field]: array }))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-900">จัดการสินค้า</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          เพิ่มสินค้าใหม่
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={formProduct.name || ''}
                  onChange={e => setFormProduct(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">ราคา</label>
                  <input
                    type="text"
                    value={formProduct.price || ''}
                    onChange={e => setFormProduct(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ราคาเดิม</label>
                  <input
                    type="text"
                    value={formProduct.original_price || ''}
                    onChange={e => setFormProduct(prev => ({ ...prev, original_price: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ส่วนลด</label>
                  <input
                    type="text"
                    value={formProduct.discount || ''}
                    onChange={e => setFormProduct(prev => ({ ...prev, discount: e.target.value }))}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ประกัน</label>
                <input
                  type="text"
                  value={formProduct.warranty || ''}
                  onChange={e => setFormProduct(prev => ({ ...prev, warranty: e.target.value }))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">สี (คั่นด้วยเครื่องหมายจุลภาค)</label>
                <input
                  type="text"
                  value={formProduct.colors?.join(', ') || ''}
                  onChange={e => handleArrayInput(e.target.value, 'colors')}
                  className="w-full border rounded px-3 py-2"
                  placeholder="ดำ, เงิน, ทอง"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
                <textarea
                  value={formProduct.description || ''}
                  onChange={e => setFormProduct(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border rounded px-3 py-2 h-20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">คุณสมบัติ (คั่นด้วยเครื่องหมายจุลภาค)</label>
                <input
                  type="text"
                  value={formProduct.features?.join(', ') || ''}
                  onChange={e => handleArrayInput(e.target.value, 'features')}
                  className="w-full border rounded px-3 py-2"
                  placeholder="กันชนหน้า-หลัง, ชุดกรอบล้อ, สปอยเลอร์"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">รูปภาพ</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formProduct.image || ''}
                      onChange={e => setFormProduct(prev => ({ ...prev, image: e.target.value }))}
                      className="flex-1 p-2 border rounded"
                      placeholder="URL รูปภาพ"
                    />
                    <label className={`px-4 py-2 rounded cursor-pointer text-white ${
                      uploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}>
                      {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded border mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 py-2 px-4 rounded text-white ${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {uploading ? 'กำลังอัปโหลด...' : (editingProduct ? 'อัปเดต' : 'เพิ่ม')}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    // ถ้าไม่ใช่การแก้ไขและมีการอัปโหลดไฟล์ใหม่ ให้ลบไฟล์ที่อัปโหลด
                    if (!editingProduct && formProduct?.image && formProduct.image !== originalImage) {
                      try {
                        await productService.deleteImage(formProduct.image)
                      } catch (error) {
                        console.error('Error deleting uploaded file:', error)
                      }
                    }
                    // ถ้าเป็นการแก้ไขและมีการเปลี่ยนรูปภาพ ให้ลบไฟล์ใหม่
                    else if (editingProduct && formProduct?.image !== originalImage && formProduct?.image) {
                      try {
                        await productService.deleteImage(formProduct.image)
                      } catch (error) {
                        console.error('Error deleting new uploaded file:', error)
                      }
                    }
                    
                    resetForm()
                  }}
                  disabled={uploading}
                  className={`flex-1 py-2 px-4 rounded text-white ${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gray-500 hover:bg-gray-600'
                  }`}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(product => (
          <div key={product.id} className="border rounded-lg p-4 bg-white shadow">
            <div className="flex items-start gap-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  {product.price && <span className="font-medium">{product.price} บาท</span>}
                  {product.original_price && <span className="text-gray-500 line-through">{product.original_price} บาท</span>}
                  {product.discount && <span className="text-red-600">ลด {product.discount} บาท</span>}
                  {product.warranty && <span className="text-gray-600">ประกัน: {product.warranty}</span>}
                </div>
                <div className="mt-2">
                  {product.colors.length > 0 && (
                    <div className="flex gap-2 mb-1">
                      {product.colors.map((color, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {color}
                        </span>
                      ))}
                    </div>
                  )}
                  {product.features.length > 0 && (
                    <div className="text-xs text-gray-600">
                      คุณสมบัติ: {product.features.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  )
}