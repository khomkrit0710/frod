'use client'

import { useState, useEffect } from 'react'
import { videoService, Video } from '@/lib/supabase-services'

export default function VideoManagement() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<Video>>({
    youtube_url: '',
    description: '',
    author: ''
  })

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
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof Video, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const addVideo = async () => {
    if (!formData.youtube_url) {
      alert('กรุณากรอก URL ของ YouTube')
      return
    }

    try {
      const newVideo = await videoService.create(
        formData.youtube_url,
        formData.description,
        formData.author
      )
      setVideos(prev => [newVideo, ...prev])
      alert('เพิ่มวิดีโอสำเร็จ!')
      setShowAddForm(false)
      resetForm()
    } catch (error) {
      console.error('Error adding video:', error)
      alert('เกิดข้อผิดพลาดในการเพิ่มวิดีโอ')
    }
  }

  const updateVideo = async () => {
    if (!editingVideo || !formData.youtube_url) return

    try {
      const updatedVideo = await videoService.update(
        editingVideo.id,
        formData.youtube_url,
        formData.description,
        formData.author
      )
      setVideos(prev => prev.map(video =>
        video.id === editingVideo.id ? updatedVideo : video
      ))
      alert('อัปเดตวิดีโอสำเร็จ!')
      setEditingVideo(null)
      resetForm()
    } catch (error) {
      console.error('Error updating video:', error)
      alert('เกิดข้อผิดพลาดในการอัปเดตวิดีโอ')
    }
  }

  const deleteVideo = async (videoId: number) => {
    if (confirm('คุณแน่ใจว่าต้องการลบวิดีโอนี้?')) {
      try {
        await videoService.delete(videoId)
        setVideos(prev => prev.filter(video => video.id !== videoId))
        alert('ลบวิดีโอสำเร็จ!')
      } catch (error) {
        console.error('Error deleting video:', error)
        alert('เกิดข้อผิดพลาดในการลบวิดีโอ')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      youtube_url: '',
      description: '',
      author: ''
    })
  }

  const startEdit = (video: Video) => {
    setEditingVideo(video)
    setFormData(video)
  }

  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการวิดีโอ YouTube</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          เพิ่มวิดีโอใหม่
        </button>
      </div>

      {/* แสดงรายการวิดีโอ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(video.youtube_url)}`}
                title={`Video ${video.id}`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2">Video ID: {video.id}</h4>
              <p className="text-gray-600 text-sm mb-1">{video.description || 'วิดีโอจาก FORD STYLE ME'}</p>
              <p className="text-gray-500 text-xs mb-2">{video.author || 'Ford Thailand'}</p>
              <p className="text-blue-600 text-xs mb-3 break-all">{video.youtube_url}</p>
              <div className="flex justify-between">
                <button
                  onClick={() => startEdit(video)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition-colors"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => deleteVideo(video.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ฟอร์มเพิ่ม/แก้ไขวิดีโอ */}
      {(showAddForm || editingVideo) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingVideo ? 'แก้ไขวิดีโอ' : 'เพิ่มวิดีโอใหม่'}
            </h3>
            <div className="space-y-4">
              {/* YouTube URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL *
                </label>
                <input
                  type="text"
                  value={formData.youtube_url || ''}
                  onChange={(e) => handleInputChange('youtube_url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  ใส่ URL ของ YouTube ที่ต้องการแสดง
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <input
                  type="text"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="วิดีโอจาก FORD STYLE ME"
                />
                <p className="text-xs text-gray-500 mt-1">
                  หากไม่กรอก จะแสดง &quot;วิดีโอจาก FORD STYLE ME&quot;
                </p>
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ผู้สร้าง/ช่อง
                </label>
                <input
                  type="text"
                  value={formData.author || ''}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ford Thailand"
                />
                <p className="text-xs text-gray-500 mt-1">
                  หากไม่กรอก จะแสดง &quot;Ford Thailand&quot;
                </p>
              </div>

              {/* Preview */}
              {formData.youtube_url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ตัวอย่าง
                  </label>
                  <div className="aspect-video bg-gray-200 rounded">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(formData.youtube_url)}`}
                      title="Preview"
                      frameBorder="0"
                      allowFullScreen
                      className="w-full h-full rounded"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingVideo(null)
                  resetForm()
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                onClick={editingVideo ? updateVideo : addVideo}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {editingVideo ? 'บันทึก' : 'เพิ่มวิดีโอ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
