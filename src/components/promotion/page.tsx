'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import promotionData from '../../data/promotion.json'
import ScrollContainer from '../../layout/scroll/page'

export default function PromotionPage() {
  const router = useRouter()
  const carCategories = Object.keys(promotionData)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [mainImages, setMainImages] = useState<Record<string, any>>({})
  
  const CarCard = ({ car, category }: { car: any, category: string }) => (
    <div className="minimal-card p-3 flex-shrink-0 w-52">
      <div className="relative overflow-hidden rounded-md mb-3 cursor-pointer">
        <img 
          src={car.image} 
          alt={car.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
          onClick={() => setMainImages(prev => ({ ...prev, [category]: car }))}
        />
      </div>
      
      <div className="text-center">
        <h3 className="text-sm font-medium text-gray-800 mb-2">{car.name}</h3>
      </div>
    </div>
  )

  return (
    <div className="minimal-section bg-white">
      {carCategories.map((category) => {
        const cars = (promotionData as any)[category]
        const firstCar = cars[0]
        const currentMainImage = mainImages[category] || firstCar
        
        return (
          <section key={category} id={`promotion-${category.toLowerCase()}`} className="mb-8 scroll-mt-20">
            <div className="container mx-auto px-4 border-b-2 border-gray-200">
              <div className="text-center mb-6 pt-4">
                <span className="text-lg text-black mb-2 border border-[#1e3b6d] rounded-md p-2 px-12 ">
                  {category}
                </span>
              </div>
              {/* border border-gray-200 shadow-lg rounded-xl p-6 */}
              <div className="flex gap-6 ">
                {/* ฝั่งซ้าย - รูปใหญ่ */}
                <div className="w-1/2 ">
                  <div className="relative overflow-hidden rounded-md cursor-pointer flex justify-center">
                    <img 
                      src={currentMainImage.image} 
                      alt={currentMainImage.name}
                      className="max-w-full max-h-[70vh] w-auto h-auto object-contain transition-transform duration-300 hover:scale-105"
                      onClick={() => setSelectedImage(currentMainImage.image)}
                    />
                  </div>
                  <div className="text-center mt-3">
                    <h3 className="text-lg font-medium text-gray-800">{currentMainImage.name}</h3>
                  </div>
                </div>
                
                {/* ฝั่งขวา - การ์ดรูปเล็ก */}
                <div className="w-1/2 ">
                  <ScrollContainer className="max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-3 gap-3">
                      {cars.map((car: any) => (
                        <CarCard key={car.id} car={car} category={category} />
                      ))}
                    </div>
                  </ScrollContainer>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mb-6">
                <button
                  onClick={() => router.push('/contact')}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  ติดต่อเรา
                </button>
                <button
                  onClick={() => router.push(`/promotion/${category.toLowerCase()}`)}
                  className="bg-red-600 text-white text-sm px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
              className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
