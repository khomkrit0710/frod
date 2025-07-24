'use client'

import { useState, useEffect } from 'react'
import ScrollContainer from '../../layout/scroll/page'
import { videoService, Video } from '@/lib/supabase-services'

export default function WorkingPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

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

  const playVideoInline = (videoId: number) => {
    setPlayingVideo(videoId.toString())
  }

  const stopVideo = () => {
    setPlayingVideo(null)
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
              className="flex-shrink-0 w-72 sm:w-80 md:w-72 minimal-card-xs"
            >
              <div className="relative">
                <div className="w-full bg-blue-50 rounded-md overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  {playingVideo === video.id.toString() ? (
                    <div className="relative w-full h-full">
                      <iframe
                        src={`https://www.youtube.com/embed/${extractYouTubeId(video.youtube_url)}?autoplay=1`}
                        title={`Video ${video.id}`}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      <button
                        onClick={stopVideo}
                        className="absolute top-2 right-2 bg-black bg-opacity-75 text-white rounded-full p-1 hover:bg-opacity-90 transition-opacity"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="cursor-pointer" onClick={() => playVideoInline(video.id)}>
                      <img
                        src={`https://img.youtube.com/vi/${extractYouTubeId(video.youtube_url)}/maxresdefault.jpg`}
                        alt={`Video ${video.id}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white rounded-full p-3 hover:bg-red-100 transition-colors duration-200">
                          <svg xmlns="http://www.w3.org/2000/svg" 
                            width="24" 
                            height="24" 
                            viewBox="0 0 24 24">
                            <path fill="#f00" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m-2 14.5v-9l6 4.5z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  วิดีโอ
                </div>
              </div>
              <div className="p-2 mt-2">
                <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                  {video.description || 'วิดีโอจาก FORD STYLE ME'}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <button 
                    onClick={() => openVideo(video.youtube_url)}
                    className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors duration-200"
                  >
                    ดูวิดีโอ
                  </button>
                  <span className="text-xs text-gray-500">{video.author || 'Ford Thailand'}</span>
                </div>
              </div>
            </div>
          ))}
        </ScrollContainer>
      </div>
    </section>
  )
}
