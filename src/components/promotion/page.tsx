'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { promotionService, Category, Promotion, contactService } from '../../lib/supabase-services'
import ScrollContainer from '../../layout/scroll/page'

interface CategoryWithPromotions extends Category {
  promotions: Promotion[]
}

export default function PromotionPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<CategoryWithPromotions[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [mainImages, setMainImages] = useState<Record<string, Promotion>>({})
  const [lineUrl, setLineUrl] = useState<string>('https://line.me/R/ti/p/@403wfucg?oat_content=url&ts=06252153')

  useEffect(() => {
    loadData()
    loadLineUrl()
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
  
  const CarCard = ({ car, categoryName }: { car: Promotion, categoryName: string }) => (
    <div className="minimal-card p-2 md:p-3" style={{ 
      minWidth: '180px', 
      maxWidth: '180px',
      flexShrink: 0,
      flexGrow: 0
    }}>
      <div className="relative overflow-hidden rounded-md mb-2 md:mb-3 cursor-pointer">
        <img 
          src={car.image} 
          alt={`${categoryName} ${car.id}`}
          className="w-full h-32 md:h-40 lg:h-48 object-cover transition-transform duration-300 hover:scale-110"
          onClick={() => setMainImages(prev => ({ ...prev, [categoryName]: car }))}
        />
      </div>
      
      <div className="flex gap-1 mt-2">
        <button 
          onClick={handleAddLine}
          className="flex-1 bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1 rounded transition-colors"
        >
          Add Line
        </button>

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

  if (categories.length === 0) {
    return (
      <div className="minimal-section bg-white">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">ยังไม่มีข้อมูลโปรโมชัน</h2>
          <p className="text-gray-500">กำลังเตรียมโปรโมชันสำหรับคุณ กรุณาติดตามต่อไป</p>
        </div>
      </div>
    )
  }

  return (
    <div className="minimal-section bg-white">
      {categories.map((category) => {
        const cars = category.promotions
        const firstCar = cars[0]
        const currentMainImage = mainImages[category.name] || firstCar
        
        return (
          <section key={category.id} id={`promotion-${category.name.toLowerCase()}`} className="mb-8 scroll-mt-20">
            <div className="container mx-auto px-4 border-b-2 border-gray-200">
              <div className="text-center mb-4 md:mb-6 pt-4">
                <span className="text-base md:text-lg text-black mb-2 border border-[#1e3b6d] rounded-md p-2 px-6 md:px-12">
                  {category.name}
                </span>
              </div>
              
              {cars.length === 0 ? (
                <div className="text-center py-8 mb-6">
                  <p className="text-gray-500">ยังไม่มีรูปโปรโมชันในหมวดหมู่นี้</p>
                </div>
              ) : (
                <>
                  {/* Mobile, Tablet, Desktop Layout (Stack vertically) */}
                  <div className="block xl:hidden">
                    {/* รูปใหญ่ด้านบน */}
                    <div className="mb-4">
                      <div className="relative overflow-hidden rounded-md cursor-pointer flex justify-center">
                        <img 
                          src={currentMainImage?.image || '/placeholder.jpg'}
                          alt={`${category.name} รูปที่ ${currentMainImage?.id || 'ไม่มี'}`}
                          className="max-w-full max-h-[50vh] lg:max-h-[60vh] w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                          onClick={() => currentMainImage?.image && setSelectedImage(currentMainImage.image)}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      
                      {/* ปุ่มใต้รูปใหญ่สำหรับ Mobile/Tablet */}
                      <div className="flex gap-2 mt-3 justify-center">
                        <button 
                          onClick={() => router.push('/contact')}
                          className="flex-1 minimal-button  text-blue-500 border border-blue-500 hover:bg-blue-700 text-xs hover:text-white transition-colors"
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
                    
                    {/* การ์ดรูปเล็กด้านล่าง */}
                    <div className="mb-4">
                      {/* Mobile (All iPhone sizes): แนวนอนเลื่อนได้ */}
                      <div className="block md:hidden">
                        <ScrollContainer className="max-h-[35vh] sm:max-h-[40vh]">
                          {cars.map((car: Promotion) => (
                            <CarCard key={car.id} car={car} categoryName={category.name} />
                          ))}
                        </ScrollContainer>
                      </div>
                      
                      {/* Tablet and Desktop: แนวนอนเลื่อนได้ */}
                      <div className="hidden md:block">
                        <ScrollContainer className="max-h-[40vh] lg:max-h-[45vh]">
                          {cars.map((car: Promotion) => (
                            <CarCard key={car.id} car={car} categoryName={category.name} />
                          ))}
                        </ScrollContainer>
                      </div>
                    </div>
                  </div>

                  {/* XL Layout (Side by side) */}
                  <div className="hidden xl:flex gap-6">
                    {/* ฝั่งซ้าย - รูปใหญ่ */}
                    <div className="w-1/2">
                      <div className="relative overflow-hidden rounded-md cursor-pointer flex justify-center">
                        <img 
                          src={currentMainImage?.image || '/placeholder.jpg'} 
                          alt={`${category.name} รูปที่ ${currentMainImage?.id || 'ไม่มี'}`}
                          className="max-w-full max-h-[70vh] w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                          onClick={() => currentMainImage?.image && setSelectedImage(currentMainImage.image)}
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder.jpg';
                          }}
                        />
                      </div>
                      
                      {/* ปุ่มใต้รูปใหญ่สำหรับ XL Layout */}
                      <div className="flex gap-2 mt-3 justify-center">
                        <button 
                          onClick={() => router.push('/contact')}
                          className="bg-white text-blue-500 border border-blue-500 hover:bg-blue-700 hover:text-white text-sm px-4 py-2 rounded transition-colors"
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
                    
                    {/* ฝั่งขวา - การ์ดรูปเล็ก */}
                    <div className="w-1/2">
                      <ScrollContainer className="max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-3 gap-3">
                          {cars.map((car: Promotion) => (
                            <CarCard key={car.id} car={car} categoryName={category.name} />
                          ))}
                        </div>
                      </ScrollContainer>
                    </div>
                  </div>
                </>
              )}
              
              <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mb-6 mt-4">
                <button
                  onClick={() => router.push(`/promotion/${category.name.toLowerCase()}`)}
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto"
                >
                  ดูเพิ่มเติม
                </button>
              </div>
            </div>
          </section>
        )
      })}
      
      {/* Image Popup Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4 bg-black bg-opacity-75"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={selectedImage}
              alt="Promotion"
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
