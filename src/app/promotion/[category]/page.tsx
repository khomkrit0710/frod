'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '../../../layout/header/page'
import FooterPage from '../../../layout/footer/page'
import { promotionService, Category, Promotion } from '../../../lib/supabase-services'

export default function CategoryPromotionPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const categoryParam = params.category as string

  useEffect(() => {
    const loadCategoryData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const categories = await promotionService.getCategories()
        const foundCategory = categories.find(cat => 
          cat.name.toLowerCase() === categoryParam.toLowerCase()
        )
        
        if (!foundCategory) {
          setError('ไม่พบหมวดหมู่ที่ระบุ')
          return
        }
        
        setCategory(foundCategory)
        const categoryPromotions = await promotionService.getPromotionsByCategory(foundCategory.id)
        setPromotions(categoryPromotions)
      } catch (error) {
        console.error('Error loading category data:', error)
        setError('เกิดข้อผิดพลาดในการโหลดข้อมูล')
      } finally {
        setLoading(false)
      }
    }

    loadCategoryData()
  }, [categoryParam])

  const CarCard = ({ car }: { car: Promotion }) => (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden rounded-md mb-4 cursor-pointer">
        <img 
          src={car.image} 
          alt={`${category?.name || 'โปรโมชัน'}`}
          className="w-full object-cover transition-transform duration-300 hover:scale-110"
          onClick={() => setSelectedImage(car.image)}
        />
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={() => router.push('/contact')}
          className="flex-1 cursor-pointer bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm"
        >
          ติดต่อเรา
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
            onClick={() => router.push('/promotion')}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            กลับไปหน้าโปรโมชัน
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
      
      {/* Category Title */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-800">โปรโมชั่น {category?.name || 'ไม่ทราบ'}</h1>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {promotions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {promotions.map((car: Promotion) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบข้อมูลโปรโมชั่นในหมวดหมู่นี้</p>
            <button
              onClick={() => router.push('/promotion')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              ดูโปรโมชันอื่น
            </button>
          </div>
        )}
      </div>

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
      {/* Footer */}
      <FooterPage />
    </div>
  )
}
