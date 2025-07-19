'use client'

import { useState, useEffect } from 'react'

interface VideoItem {
  id: number
  title: string
  description: string
  youtubeId: string
  thumbnail: string
}

interface VideoData {
  videos: VideoItem[]
}

export default function VideoManagement() {
  const [videoData, setVideoData] = useState<VideoData>({ videos: [] })
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('')
  const [formData, setFormData] = useState<Partial<VideoItem>>({
    title: '',
    description: '',
    youtubeId: '',
    thumbnail: ''
  })

  useEffect(() => {
    loadVideoData()
  }, [])

  const loadVideoData = async () => {
    try {
      const response = await fetch('/api/data/working')
      const data = await response.json()
      setVideoData(data)
    } catch (error) {
      console.error('Error loading video data:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveVideoData = async (data: VideoData) => {
    try {
      const response = await fetch('/api/data/working', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (response.ok) {
        await loadVideoData()
        alert('บันทึกข้อมูลสำเร็จ')
      }
    } catch (error) {
      console.error('Error saving video data:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setThumbnailPreview(result)
        setFormData(prev => ({ ...prev, thumbnail: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInputChange = (field: keyof VideoItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const addVideo = () => {
    if (!formData.title || !formData.youtubeId) {
      alert('กรุณากรอกข้อมูลที่จำเป็น')
      return
    }

    const newVideo: VideoItem = {
      id: Date.now(),
      title: formData.title || '',
      description: formData.description || '',
      youtubeId: extractYouTubeId(formData.youtubeId || ''),
      thumbnail: formData.thumbnail || '/image_test/logo.png'
    }

    const updatedData = {
      ...videoData,
      videos: [...videoData.videos, newVideo]
    }

    setVideoData(updatedData)
    saveVideoData(updatedData)
    setShowAddForm(false)
    resetForm()
  }

  const updateVideo = () => {
    if (!editingVideo || !formData.title || !formData.youtubeId) return

    const updatedVideo: VideoItem = {
      ...editingVideo,
      title: formData.title || '',
      description: formData.description || '',
      youtubeId: extractYouTubeId(formData.youtubeId || ''),
      thumbnail: formData.thumbnail || editingVideo.thumbnail
    }

    const updatedData = {
      ...videoData,
      videos: videoData.videos.map(video =>
        video.id === editingVideo.id ? updatedVideo : video
      )
    }

    setVideoData(updatedData)
    saveVideoData(updatedData)
    setEditingVideo(null)
    resetForm()
  }

  const deleteVideo = (videoId: number) => {
    if (confirm('คุณแน่ใจว่าต้องการลบวิดีโอนี้?')) {
      const updatedData = {
        ...videoData,
        videos: videoData.videos.filter(video => video.id !== videoId)
      }

      setVideoData(updatedData)
      saveVideoData(updatedData)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      youtubeId: '',
      thumbnail: ''
    })
    setThumbnailPreview('')
  }

  const startEdit = (video: VideoItem) => {
    setEditingVideo(video)
    setFormData(video)
    setThumbnailPreview(video.thumbnail)
  }

  if (loading) {
    return <div className="text-center py-8">กำลังโหลดข้อมูล...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">จัดการวิดีโอ</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          เพิ่มวิดีโอใหม่
        </button>
      </div>

      {/* แสดงรายการวิดีโอ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videoData.videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2">{video.title}</h4>
              <p className="text-gray-600 text-sm mb-3">{video.description}</p>
              <p className="text-blue-600 text-sm mb-3">YouTube ID: {video.youtubeId}</p>
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
              {/* ชื่อวิดีโอ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อวิดีโอ *
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="เช่น Ford Ranger Raptor - ทดสอบความแกร่ง"
                />
              </div>

              {/* คำอธิบาย */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  คำอธิบาย
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  placeholder="คำอธิบายเกี่ยวกับวิดีโอ..."
                />
              </div>

              {/* YouTube URL/ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL หรือ ID *
                </label>
                <input
                  type="text"
                  value={formData.youtubeId || ''}
                  onChange={(e) => handleInputChange('youtubeId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://www.youtube.com/watch?v=... หรือแค่ ID"
                />
                <p className="text-xs text-gray-500 mt-1">
                  สามารถใส่ URL เต็มหรือแค่ YouTube ID ได้
                </p>
              </div>

              {/* Thumbnail */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รูปปก (Thumbnail)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="w-full"
                />
                {thumbnailPreview && (
                  <div className="mt-2 aspect-video bg-gray-200 rounded max-w-xs">
                    <img
                      src={thumbnailPreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
              </div>
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
