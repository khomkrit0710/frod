'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../layout/header/page'
import FooterPage from '../../layout/footer/page'
import { productService, Product, contactService } from '../../lib/supabase-services'

export default function AllProductsPage() {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lineUrl, setLineUrl] = useState<string>('https://line.me/R/ti/p/@403wfucg?oat_content=url&ts=06252153')

  useEffect(() => {
    loadProducts()
    loadLineUrl()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
      setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const loadLineUrl = async () => {
    try {
      const contacts = await contactService.getAll()
      const lineData = contacts.find(contact => 
        contact.name.toLowerCase() === 'line'
      )
      if (lineData && lineData.url) {
        setLineUrl(lineData.url)
      }
    } catch (error) {
      console.error('Error loading Line URL:', error)
    }
  }

  const handleAddLine = () => {
    window.open(lineUrl, '_blank')
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden rounded-md mb-4 cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-contain transition-transform duration-300 hover:scale-110"
          onClick={() => setSelectedImage(product.image)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg'
          }}
        />
      </div>
      
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-3">
            {product.description}
          </p>
        )}
        
        {/* Price Info */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            {product.price && (
              <span className="text-lg font-semibold text-blue-600">
                {product.price} บาท
              </span>
            )}
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">
                {product.original_price} บาท
              </span>
            )}
            {product.discount && (
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                ลด {product.discount} บาท
              </span>
            )}
          </div>
          {product.warranty && (
            <p className="text-xs text-gray-600">ประกัน: {product.warranty}</p>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-2">
            <div className="flex gap-1 flex-wrap">
              {product.colors.map((color: string, index: number) => (
                <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-3">
            <ul className="text-xs text-gray-600 space-y-1">
              {product.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                  {feature}
                </li>
              ))}
              {product.features.length > 3 && (
                <li className="text-gray-400">และอีก {product.features.length - 3} รายการ...</li>
              )}
            </ul>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => router.push('/contact')}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm"
        >
          ติดต่อเรา
        </button>
        <button 
          onClick={handleAddLine}
          className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors text-sm"
        >
          Add Line
        </button>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
        <FooterPage />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">เกิดข้อผิดพลาด</h1>
          <p className="text-lg text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            กลับไปหน้าหลัก
          </button>
        </div>
        <FooterPage />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />
      
      {/* Page Title */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">อุปกรณ์ตกแต่งทั้งหมด</h1>
        <p className="text-gray-600 mt-2">อุปกรณ์ตกแต่งคุณภาพสูงสำหรับรถยนต์ Ford</p>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ยังไม่มีสินค้าในระบบ</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              กลับไปหน้าหลัก
            </button>
          </div>
        )}
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage}
              alt="Product"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <FooterPage />
    </div>
  )
}