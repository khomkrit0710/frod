'use client'

import { useState, useEffect } from 'react'

interface VideoItem {
  id: number
  url: string
}

interface VideoData {
  videos: VideoItem[]
}

export default function VideoManagement() {
  const [videoData, setVideoData] = useState<VideoData>({ videos: [] })
  const [loading, setLoading] = useState(true)
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<VideoItem>>({
    url: ''
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

  const handleInputChange = (field: keyof VideoItem, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const extractYouTubeId = (url: string): string => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : url
  }

  const addVideo = () => {
    if (!formData.url) {
      alert('กรุณากรอก URL ของ YouTube')
      return
    }

    const newVideo: VideoItem = {
      id: Date.now(),
      url: formData.url || ''
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
    if (!editingVideo || !formData.url) return

    const updatedVideo: VideoItem = {
      ...editingVideo,
      url: formData.url || ''
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
      url: ''
    })
  }

  const startEdit = (video: VideoItem) => {
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
        {videoData.videos.map((video) => (
          <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-video bg-gray-200">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeId(video.url)}`}
                title={`Video ${video.id}`}
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-lg mb-2">Video ID: {video.id}</h4>
              <p className="text-blue-600 text-sm mb-3 break-all">{video.url}</p>
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
                  value={formData.url || ''}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  ใส่ URL ของ YouTube ที่ต้องการแสดง
                </p>
              </div>

              {/* Preview */}
              {formData.url && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ตัวอย่าง
                  </label>
                  <div className="aspect-video bg-gray-200 rounded">
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(formData.url)}`}
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
