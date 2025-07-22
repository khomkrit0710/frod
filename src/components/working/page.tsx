'use client'

import { useState, useEffect } from 'react'
import ScrollContainer from '../../layout/scroll/page'
import { videoService, Video } from '@/lib/supabase-services'

export default function WorkingPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      setLoading(true)
      const data = await videoService.getAll()
      setVideos(data)
    } catch (error) {
      console.error('Error loading videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const openVideo = (url: string) => {
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <section id="working" className="minimal-section bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">กำลังโหลดวิดีโอ...</div>
        </div>
      </section>
    )
  }

  return (
    <section id="working" className="minimal-section bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="minimal-heading">ผลงานของเรา</h2>
          <p className="minimal-subheading">ชมวิดีโอการทดสอบและรีวิวรถยนต์ Ford</p>
        </div>

        <ScrollContainer>
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex-shrink-0 w-64 minimal-card-xs"
            >
              <div className="relative">
                <div className="aspect-w-16 aspect-h-9 bg-blue-50 rounded-md overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${extractYouTubeId(video.youtube_url)}`}
                    title={`Video ${video.id}`}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-56 object-cover"
                  />
                </div>
                <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  วิดีโอ
                </div>
              </div>
              <div className="p-2 mt-2">
                <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                  วิดีโอจาก FORD STYLE ME
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <button 
                    onClick={() => openVideo(video.youtube_url)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors duration-200"
                  >
                    ดูวิดีโอ
                  </button>
                  <span className="text-xs text-gray-500">Ford Thailand</span>
                </div>
              </div>
            </div>
          ))}
        </ScrollContainer>
      </div>
    </section>
  )
}
