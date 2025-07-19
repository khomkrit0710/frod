'use client'

import promotionData from '../../data/promotion.json'
import ScrollContainer from '../../layout/scroll/page'

export default function PromotionPage() {
  const carCategories = Object.keys(promotionData)
  
  const CarCard = ({ car }: { car: any }) => (
    <div className="minimal-card p-6 flex-shrink-0 w-64">
      <img 
        src={car.image} 
        alt={car.name}
        className="w-full object-cover rounded-md mb-4"
      />
      
      <div className="flex gap-1">
        <button className="flex-1 minimal-button bg-blue-600 text-white hover:bg-blue-700 text-xs">
          ติดต่อเรา
        </button>
        <button className="flex-1 minimal-button border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-xs">
          Line
        </button>
      </div>
    </div>
  )

  return (
    <div className="minimal-section bg-white">
      {carCategories.map((category) => {
        const cars = (promotionData as any)[category]
        return (
          <section key={category} className="mb-8">
            <div className="container mx-auto px-4">
              <div className="text-center mb-6">
                <span className="text-lg text-black mb-2 border border-[#1e3b6d] rounded-md p-2 px-12">
                  {category}
                </span>
              </div>
              <ScrollContainer>
                {cars.map((car: any) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </ScrollContainer>
            </div>
          </section>
        )
      })}
    </div>
  )
}
