'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import promotionData from '../../data/promotion.json'
import ScrollContainer from '../../layout/scroll/page'

export default function PromotionPage() {
  const router = useRouter()
  const carCategories = Object.keys(promotionData)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const CarCard = ({ car }: { car: any }) => (
    <div className="minimal-card p-6 flex-shrink-0 w-64">
      <div className="relative overflow-hidden rounded-md mb-4 cursor-pointer">
        <img 
          src={car.image} 
          alt={car.name}
          className="w-full object-cover transition-transform duration-300 hover:scale-110"
          onClick={() => setSelectedImage(car.image)}
        />
      </div>
      
      <div className="flex gap-1">
        <button 
          onClick={() => router.push('/contact')}
          className="flex-1 cursor-pointer minimal-button bg-red-600 text-white hover:bg-red-700 text-xs"
        >
          ติดต่อเรา
        </button>
      </div>
    </div>
  )

  return (
    <div className="minimal-section bg-white">
      {carCategories.map((category) => {
        const cars = (promotionData as any)[category]
        return (
          <section key={category} id={`promotion-${category.toLowerCase()}`} className="mb-4 scroll-mt-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6 pt-4">
                <span className="text-lg text-black mb-2 border border-[#1e3b6d] rounded-md p-2 px-12">
                  {category}
                </span>
              </div>
              <ScrollContainer>
                {cars.map((car: any) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </ScrollContainer>
              <div className="text-right mt-2">
                <button
                  onClick={() => router.push(`/promotion/${category.toLowerCase()}`)}
                  className="bg-red-600 text-white text-sm px-3 py-2 rounded-md hover:bg-red-700 transition-colors"
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
