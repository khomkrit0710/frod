'use client'

import { useState, useEffect } from 'react'
import ScrollContainer from '../../layout/scroll/page'
import { galleryService, GalleryImage } from '@/lib/supabase-services'

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      const data = await galleryService.getAll()
      setImages(data)
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  if (loading) {
    return (
      <section id="gallery" className="minimal-section bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">กำลังโหลดรูปภาพ...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="gallery" className="minimal-section bg-gray-50">
      <div className="container mx-auto px-4">
        <ScrollContainer>
          {images.map((image) => (
            <div
              key={image.id}
              className="flex-shrink-0 w-64 minimal-card-xs cursor-pointer"
              onClick={() => openImageModal(image.image_url)}
            >
              <div className="relative">
                <div className="bg-gray-50 rounded-md overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.title || `รูปภาพ ${image.id}`}
                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 mb-1">
                    {image.title || "-"}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {image.description || "-"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </ScrollContainer>

        {/* Image Popup Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeImageModal}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="text-center">
                <img 
                  src={selectedImage}
                  alt="รูปภาพขยาย"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
                {/* แสดง title และ description ของรูปที่เลือก */}
                {(() => {
                  const selectedImg = images.find(img => img.image_url === selectedImage)
                  return selectedImg && (selectedImg.title || selectedImg.description) ? (
                    <div className="mt-4 bg-black bg-opacity-50 text-white p-4 rounded-lg max-w-md mx-auto">
                      {selectedImg.title && (
                        <h3 className="text-lg font-medium mb-2">{selectedImg.title}</h3>
                      )}
                      {selectedImg.description && (
                        <p className="text-sm">{selectedImg.description}</p>
                      )}
                    </div>
                  ) : null
                })()} 
              </div>
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 w-8 h-8 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
