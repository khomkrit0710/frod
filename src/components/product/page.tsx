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
  const [mainImages, setMainImages] = useState<Record<string, Product>>({})
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
    <div className="minimal-card p-2 md:p-3 flex-shrink-0 flex flex-col" style={{ 
      minWidth: '180px', 
      maxWidth: '180px',
      minHeight: '320px',
      flexShrink: 0,
      flexGrow: 0
    }}>
      <div className="relative overflow-hidden rounded-md mb-2 md:mb-3 cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-32 md:h-40 lg:h-48 object-cover transition-transform duration-300 hover:scale-110"
          onClick={() => setMainImages(prev => ({ ...prev, ['products']: product }))}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.jpg'
          }}
        />
      </div>
      <div className="flex-grow flex flex-col">
        <h3 className="text-xs font-medium text-blue-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-1 flex-wrap">
            {product.price && <span className="text-xs font-medium text-blue-900">{product.price}</span>}
            {product.original_price && <span className="text-xs text-gray-400 line-through">{product.original_price}</span>}
          </div>
          {product.discount && (
            <span className="text-xs text-red-600 bg-red-50 px-1 py-0.5 rounded inline-block mb-1">
              ลด {product.discount} บาท
            </span>
          )}
          {product.warranty && <p className="text-xs text-gray-600">ประกัน: {product.warranty}</p>}
        </div>

        <div className="mb-2 flex-grow">
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1 mb-1 flex-wrap">
              {product.colors.slice(0, 2).map((color: string, index: number) => (
                <span key={index} className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded">
                  {color}
                </span>
              ))}
              {product.colors.length > 2 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 2}</span>
              )}
            </div>
          )}
          {product.features && product.features.length > 0 && (
            <ul className="text-xs text-gray-600 space-y-0.5">
              {product.features.slice(0, 3).map((feature: string, index: number) => (
                <li key={index} className="flex items-start gap-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
              {product.features.length > 3 && (
                <li className="text-xs text-gray-500">และอีก {product.features.length - 3} รายการ</li>
              )}
            </ul>
          )}
        </div>

        <div className="flex gap-1 mt-auto">
          <button 
            onClick={() => router.push('/contact')}
            className="flex-1 text-blue-500 border border-blue-500 hover:bg-blue-700 text-xs hover:text-white transition-colors px-2 py-1 rounded"
          >
            ติดต่อเรา
          </button>
          <button 
            onClick={handleAddLine}
            className="flex-1 bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1 rounded transition-colors"
          >
            Add Line
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="minimal-section bg-white">
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="minimal-section bg-white">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">ยังไม่มีข้อมูลสินค้า</h2>
          <p className="text-gray-500">กำลังเตรียมสินค้าสำหรับคุณ กรุณาติดตามต่อไป</p>
        </div>
      </div>
    )
  }

  return (
    <div className="minimal-section bg-white">
      <section className="mb-8 scroll-mt-20">
        <div className="container mx-auto px-4 border-b-2 border-gray-200">
          <div className="text-center mb-4 md:mb-6 pt-4">
            <span className="text-base md:text-lg text-black mb-2 border border-[#1e3b6d] rounded-md p-2 px-6 md:px-12">
              อุปกรณ์ตกแต่ง
            </span>
          </div>
          
          {products.length === 0 ? (
            <div className="text-center py-8 mb-6">
              <p className="text-gray-500">ยังไม่มีสินค้าในหมวดหมู่นี้</p>
            </div>
          ) : (
            <>
              {/* Mobile, Tablet, Desktop Layout (Stack vertically) */}
              <div className="block xl:hidden">
                {/* รูปใหญ่ด้านบน */}
                <div className="mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="relative overflow-hidden rounded-md cursor-pointer flex justify-center mb-3">
                      <img 
                        src={mainImages['products']?.image || products[0]?.image || '/placeholder.jpg'}
                        alt={`อุปกรณ์ตกแต่ง ${mainImages['products']?.name || products[0]?.name || 'รูปที่ 1'}`}
                        className="max-w-full max-h-[40vh] lg:max-h-[50vh] w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                        onClick={() => (mainImages['products']?.image || products[0]?.image) && setSelectedImage(mainImages['products']?.image || products[0]?.image)}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    {/* ข้อมูลสินค้าของรูปใหญ่ */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-blue-900">{mainImages['products']?.name || products[0]?.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-3">{mainImages['products']?.description || products[0]?.description}</p>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {(mainImages['products']?.price || products[0]?.price) && 
                          <span className="text-lg font-medium text-blue-900">{mainImages['products']?.price || products[0]?.price}</span>
                        }
                        {(mainImages['products']?.original_price || products[0]?.original_price) && 
                          <span className="text-sm text-gray-400 line-through">{mainImages['products']?.original_price || products[0]?.original_price}</span>
                        }
                        {(mainImages['products']?.discount || products[0]?.discount) && (
                          <span className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                            ลด {mainImages['products']?.discount || products[0]?.discount} บาท
                          </span>
                        )}
                      </div>
                      
                      {(mainImages['products']?.warranty || products[0]?.warranty) && 
                        <p className="text-sm text-gray-600">ประกัน: {mainImages['products']?.warranty || products[0]?.warranty}</p>
                      }
                      
                      {(mainImages['products']?.colors || products[0]?.colors) && (mainImages['products']?.colors || products[0]?.colors).length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {(mainImages['products']?.colors || products[0]?.colors).map((color: string, index: number) => (
                            <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                              {color}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {(mainImages['products']?.features || products[0]?.features) && (mainImages['products']?.features || products[0]?.features).length > 0 && (
                        <ul className="text-sm text-gray-600 space-y-1">
                          {(mainImages['products']?.features || products[0]?.features).map((feature: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {/* ปุ่มใต้รูปใหญ่สำหรับ Mobile/Tablet */}
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => router.push('/contact')}
                        className="flex-1 text-blue-500 border border-blue-500 hover:bg-blue-700 hover:text-white text-sm px-4 py-2 rounded transition-colors"
                      >
                        ติดต่อเรา
                      </button>
                      <button 
                        onClick={handleAddLine}
                        className="bg-green-500 text-white hover:bg-green-600 text-sm px-4 py-2 rounded transition-colors"
                      >
                        Add Line
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* การ์ดรูปเล็กด้านล่าง */}
                <div className="mb-4">
                  <div className="block md:hidden">
                    <ScrollContainer className="max-h-[35vh] sm:max-h-[40vh]">
                      {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </ScrollContainer>
                  </div>
                  
                  <div className="hidden md:block">
                    <ScrollContainer className="max-h-[40vh] lg:max-h-[45vh]">
                      {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </ScrollContainer>
                  </div>
                </div>
              </div>

              {/* XL Layout (Side by side) */}
              <div className="hidden xl:flex gap-6">
                {/* ฝั่งซ้าย - รูปใหญ่ */}
                <div className="w-1/2">
                  <div className="bg-white p-6 rounded-lg shadow-sm border h-fit">
                    <div className="relative overflow-hidden rounded-md cursor-pointer flex justify-center mb-4">
                      <img 
                        src={mainImages['products']?.image || products[0]?.image || '/placeholder.jpg'} 
                        alt={`อุปกรณ์ตกแต่ง ${mainImages['products']?.name || products[0]?.name || 'รูปที่ 1'}`}
                        className="max-w-full max-h-[60vh] w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                        onClick={() => (mainImages['products']?.image || products[0]?.image) && setSelectedImage(mainImages['products']?.image || products[0]?.image)}
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.jpg';
                        }}
                      />
                    </div>
                    
                    {/* ข้อมูลสินค้าของรูปใหญ่ */}
                    <div className="space-y-3">
                      <h3 className="text-xl font-medium text-blue-900">{mainImages['products']?.name || products[0]?.name}</h3>
                      <p className="text-gray-600 line-clamp-4">{mainImages['products']?.description || products[0]?.description}</p>
                      
                      <div className="flex items-center gap-3 flex-wrap">
                        {(mainImages['products']?.price || products[0]?.price) && 
                          <span className="text-xl font-medium text-blue-900">{mainImages['products']?.price || products[0]?.price}</span>
                        }
                        {(mainImages['products']?.original_price || products[0]?.original_price) && 
                          <span className="text-gray-400 line-through">{mainImages['products']?.original_price || products[0]?.original_price}</span>
                        }
                        {(mainImages['products']?.discount || products[0]?.discount) && (
                          <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                            ลด {mainImages['products']?.discount || products[0]?.discount} บาท
                          </span>
                        )}
                      </div>
                      
                      {(mainImages['products']?.warranty || products[0]?.warranty) && 
                        <p className="text-gray-600">ประกัน: {mainImages['products']?.warranty || products[0]?.warranty}</p>
                      }
                      
                      {(mainImages['products']?.colors || products[0]?.colors) && (mainImages['products']?.colors || products[0]?.colors).length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {(mainImages['products']?.colors || products[0]?.colors).map((color: string, index: number) => (
                            <span key={index} className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded">
                              {color}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {(mainImages['products']?.features || products[0]?.features) && (mainImages['products']?.features || products[0]?.features).length > 0 && (
                        <ul className="text-gray-600 space-y-1">
                          {(mainImages['products']?.features || products[0]?.features).map((feature: string, index: number) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    {/* ปุ่มใต้รูปใหญ่สำหรับ XL Layout */}
                    <div className="flex gap-3 mt-6">
                      <button 
                        onClick={() => router.push('/contact')}
                        className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-700 hover:text-white px-6 py-2 rounded transition-colors"
                      >
                        ติดต่อเรา
                      </button>
                      <button 
                        onClick={handleAddLine}
                        className="bg-green-500 text-white hover:bg-green-600 px-6 py-2 rounded transition-colors"
                      >
                        Add Line
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* ฝั่งขวา - การ์ดรูปเล็ก */}
                <div className="w-1/2">
                  <ScrollContainer className="max-h-[80vh] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-4">
                      {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </ScrollContainer>
                </div>
              </div>
            </>
          )}
          
          <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mb-6 mt-4">
            <button
              onClick={() => router.push('/products')}
              className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto"
            >
              ดูเพิ่มเติม
            </button>
          </div>
        </div>
      </section>
      
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
    </div>
  )
}