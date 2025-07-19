'use client'

import { useState, useRef } from 'react'
import workingData from '../../data/working.json'
import ScrollContainer from '../../layout/scroll/page'

export default function WorkingPage() {
  const { videos } = workingData

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
                    src={`https://www.youtube.com/embed/${video.youtubeId}`}
                    title={video.title}
                    frameBorder="0"
                    allowFullScreen
                    className="w-full h-32 object-cover"
                  />
                </div>
                <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  วิดีโอ
                </div>
              </div>
              <div className="p-2 mt-2">
                <h3 className="text-sm font-light text-blue-600 mb-1 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-xs line-clamp-2">
                  {video.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <button className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition-colors duration-200">
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
