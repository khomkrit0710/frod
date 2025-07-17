'use client'

import promotionData from '../../data/promotion.json'

export default function PromotionPage() {
  const { ranger, everest, raptor } = promotionData

  const CarCard = ({ car }: { car: any }) => (
    <div className="minimal-card p-6">
      <img 
        src={car.image} 
        alt={car.name}
        className="w-full h-32 object-cover rounded-md mb-2"
      />
      <h3 className="text-base font-light text-blue-900 mb-1">{car.name}</h3>
      <p className="minimal-text text-xs mb-2 line-clamp-2">{car.description}</p>
      
      <div className="mb-2">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-base font-light text-blue-900">{car.price}</span>
          <span className="text-sm text-gray-400 line-through">{car.originalPrice}</span>
          <span className="text-xs text-red-600 bg-red-50 px-1 py-0.5 rounded">
            ลด {car.discount} บาท
          </span>
        </div>
        <p className="text-xs text-gray-600">ประกัน: {car.warranty}</p>
      </div>

      <div className="mb-2">
        <div className="flex gap-1 mb-1">
          {car.colors.map((color: string, index: number) => (
            <span key={index} className="text-xs bg-blue-50 text-blue-600 px-1 py-0.5 rounded">
              {color}
            </span>
          ))}
        </div>
        <ul className="text-xs text-gray-600 space-y-0.5">
          {car.features.map((feature: string, index: number) => (
            <li key={index} className="flex items-center gap-1">
              <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>

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
      {/* Ranger Section */}
      <section id="promotion-ranger" className="mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-light text-blue-900 mb-2">Ford Ranger</h2>
            <p className="minimal-subheading">กระบะที่ตอบโจทย์ทุกการใช้งาน</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {ranger.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Everest Section */}
      <section id="promotion-everest" className="mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-light text-blue-900 mb-2">Ford Everest</h2>
            <p className="minimal-subheading">SUV ขนาดใหญ่สำหรับครอบครัว</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {everest.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>

      {/* Raptor Section */}
      <section id="promotion-raptor" className="mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-lg font-light text-blue-900 mb-2">Ford Raptor</h2>
            <p className="minimal-subheading">สุดยอดกระบะออฟโรด</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {raptor.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
