'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { productService, Product, contactService } from '@/lib/supabase-services'
import ScrollContainer from '../../layout/scroll/page'

export default function ProductPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [lineUrl, setLineUrl] = useState<string>('https://line.me/R/ti/p/@403wfucg?oat_content=url&ts=06252153')

  useEffect(() => {
    loadProducts()
    loadLineUrl()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error loading products:', error)
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
    <div className="minimal-card p-6 min-w-[300px] min-h-[400px] flex-shrink-0 flex flex-col h-full">
      <div className="relative overflow-hidden rounded-md mb-2 cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-auto max-h-48 object-contain transition-transform duration-300 hover:scale-110"
          onClick={() => setSelectedImage(product.image)}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg'
          }}
        />
      </div>
      <h3 className="text-base font-light text-blue-900 mb-1">{product.name}</h3>
      <p className="minimal-text text-xs mb-2 line-clamp-2">{product.description}</p>
      
      <div className="mb-2">
        <div className="flex items-center gap-1 mb-1">
          {product.price && <span className="text-base font-light text-blue-900">{product.price}</span>}
          {product.original_price && <span className="text-sm text-gray-400 line-through">{product.original_price}</span>}
          {product.discount && (
            <span className="text-xs text-red-600 bg-red-50 px-1 py-0.5 rounded">
              ลด {product.discount} บาท
            </span>
          )}
        </div>
        {product.warranty && <p className="text-xs text-gray-600">ประกัน: {product.warranty}</p>}
      </div>

      <div className="mb-2 flex-grow">
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mb-1">
            {product.colors.map((color: string, index: number) => (
              <span key={index} className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded">
                {color}
              </span>
            ))}
          </div>
        )}
        {product.features && product.features.length > 0 && (
          <ul className="text-xs text-gray-600 space-y-0.5">
            {product.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-1">
                <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex gap-1 mt-auto">
        <button 
          onClick={() => router.push('/contact')}
          className="flex-1 minimal-button  text-blue-500 border border-blue-500 hover:bg-blue-700 text-xs hover:text-white transition-colors"
        >
          ติดต่อเรา
        </button>
        <button 
          onClick={handleAddLine}
          className="flex-1 minimal-button bg-green-500 text-white hover:bg-green-600 text-xs"
        >
          Add Line
        </button>
      </div>
    </div>
  )

  return (
    <section id="products" className="minimal-section bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="minimal-heading">อุปกรณ์ตกแต่ง</h2>
          <p className="minimal-subheading">อุปกรณ์ตกแต่งคุณภาพสูงสำหรับรถยนต์ Ford</p>
          
          <div className="flex justify-center mt-4">
            <button
              onClick={() => router.push('/products')}
              className="bg-red-600 text-white px-6 py-2 text-sm rounded-md hover:bg-red-700 transition-colors"
            >
              ดูรูปภาพทั้งหมด
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
          </div>
        ) : (
          <ScrollContainer>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ScrollContainer>
        )}
      </div>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black bg-opacity-75"
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
              className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors text-lg md:text-xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

    </section>
  )
}
