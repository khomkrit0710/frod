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
                <div className="aspect-w-16 aspect-h-12 bg-gray-50 rounded-md overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={`รูปภาพ ${image.id}`}
                    className="w-72 h-72 object-cover hover:scale-105 transition-transform duration-300"
                  />
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
              <img 
                src={selectedImage}
                alt="รูปภาพขยาย"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
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
