'use client'

import { useState, useEffect } from 'react'
import { companyService } from '@/lib/supabase-services'

interface ImageData {
  logo: string
  footerLogo: string
  banner: string
}

interface CompanyData {
  companyInfo: {
    name: string
    description: string
    phone: string
    email: string
    address: string
  }
  workingHours: {
    weekdays: string
    weekends: string
  }
  socialMedia: Array<{
    id: number
    name: string
    url: string
    icon: string
  }>
}

export default function FooterPage() {
  const [imageData, setImageData] = useState<ImageData>({
    logo: '/logo/logo2.png',
    footerLogo: '/image_test/logo.png', // default fallback
    banner: '/logo/banner.jpg'
  })
  const [companyData, setCompanyData] = useState<CompanyData | null>(null)

  useEffect(() => {
    loadImageData()
    loadCompanyData()
  }, [])

  const loadImageData = async () => {
    try {
      const response = await fetch('/api/data/images')
      const data = await response.json()
      setImageData(data)
    } catch (error) {
      console.error('Error loading image data:', error)
    }
  }

  const loadCompanyData = async () => {
    try {
      // Load company info
      const companyInfo = await companyService.getCompanyInfo()
      const workingHours = await companyService.getWorkingHours()
      const socialMedia = await companyService.getSocialMedia()

      if (companyInfo && workingHours) {
        setCompanyData({
          companyInfo: {
            name: companyInfo.name,
            description: companyInfo.description,
            phone: companyInfo.phone,
            email: companyInfo.email,
            address: companyInfo.address
          },
          workingHours: {
            weekdays: workingHours.weekdays,
            weekends: workingHours.weekends
          },
          socialMedia: socialMedia.map(social => ({
            id: social.id,
            name: social.name,
            url: social.url,
            icon: social.icon
          }))
        })
      }
    } catch (error) {
      console.error('Error loading company data:', error)
    }
  }
  return (
    <footer id="contact" className="bg-[#1e3b6d] border-t border-blue-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <img 
              src={imageData.footerLogo} 
              alt="Ford Logo"
              width={80}
              height={40}
              className="mb-2"
            />
            <p className="minimal-text text-sm">
              {companyData?.companyInfo.description || 'ตัวแทนจำหน่ายรถยนต์ Ford อย่างเป็นทางการ มีให้บริการครบครัน ทั้งขายรถใหม่ รถมือสอง และบริการหลังการขาย'}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-light text-white mb-2">ติดต่อเรา</h3>
            <div className="space-y-1">
              <p className="minimal-text text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {companyData?.companyInfo.phone || '02-123-4567'}
              </p>
              <p className="minimal-text text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {companyData?.companyInfo.email || 'info@ford-thailand.com'}
              </p>
              <p className="minimal-text text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {companyData?.companyInfo.address || '123/45 ถนนสุขุมวิท กรุงเทพฯ 10110'}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-light text-white mb-2">เวลาทำการ</h3>
            <div className="space-y-1">
              <p className="minimal-text text-sm">{companyData?.workingHours.weekdays || '-'}</p>
              <p className="minimal-text text-sm">{companyData?.workingHours.weekends || '-'}</p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-light text-white mb-2">ติดตามเรา</h4>
              <div className="flex space-x-2">
                <a href="https://www.facebook.com/ford.style.me" className="w-6 h-6 text-white rounded-full flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256"><path fill="#1877f2" d="M256 128C256 57.308 198.692 0 128 0S0 57.308 0 128c0 63.888 46.808 116.843 108 126.445V165H75.5v-37H108V99.8c0-32.08 19.11-49.8 48.348-49.8C170.352 50 185 52.5 185 52.5V84h-16.14C152.959 84 148 93.867 148 103.99V128h35.5l-5.675 37H148v89.445c61.192-9.602 108-62.556 108-126.445"/><path fill="#fff" d="m177.825 165l5.675-37H148v-24.01C148 93.866 152.959 84 168.86 84H185V52.5S170.352 50 156.347 50C127.11 50 108 67.72 108 99.8V128H75.5v37H108v89.445A129 129 0 0 0 128 256a129 129 0 0 0 20-1.555V165z"/></svg>
                </a>
                <a href="https://lin.ee/F9sy7aG" className="w-6 h-6 bg-white text-white rounded-full flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="#06c152" d="M311 196.8v81.3c0 2.1-1.6 3.7-3.7 3.7h-13c-1.3 0-2.4-.7-3-1.5L254 230v48.2c0 2.1-1.6 3.7-3.7 3.7h-13c-2.1 0-3.7-1.6-3.7-3.7v-81.3c0-2.1 1.6-3.7 3.7-3.7h12.9c1.1 0 2.4.6 3 1.6l37.3 50.3v-48.2c0-2.1 1.6-3.7 3.7-3.7h13c2.1-.1 3.8 1.6 3.8 3.5zm-93.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 2.1 1.6 3.7 3.7 3.7h13c2.1 0 3.7-1.6 3.7-3.7v-81.3c0-1.9-1.6-3.7-3.7-3.7m-31.4 68.1h-35.6v-64.4c0-2.1-1.6-3.7-3.7-3.7h-13c-2.1 0-3.7 1.6-3.7 3.7v81.3c0 1 .3 1.8 1 2.5c.7.6 1.5 1 2.5 1h52.2c2.1 0 3.7-1.6 3.7-3.7v-13c0-1.9-1.6-3.7-3.5-3.7zm193.7-68.1h-52.3c-1.9 0-3.7 1.6-3.7 3.7v81.3c0 1.9 1.6 3.7 3.7 3.7h52.2c2.1 0 3.7-1.6 3.7-3.7V265c0-2.1-1.6-3.7-3.7-3.7H344v-13.6h35.5c2.1 0 3.7-1.6 3.7-3.7v-13.1c0-2.1-1.6-3.7-3.7-3.7H344v-13.7h35.5c2.1 0 3.7-1.6 3.7-3.7v-13c-.1-1.9-1.7-3.7-3.7-3.7zM512 93.4v326c-.1 51.2-42.1 92.7-93.4 92.6h-326C41.4 511.9-.1 469.8 0 418.6v-326C.1 41.4 42.2-.1 93.4 0h326c51.2.1 92.7 42.1 92.6 93.4m-70.4 140.1c0-83.4-83.7-151.3-186.4-151.3S68.8 150.1 68.8 233.5c0 74.7 66.3 137.4 155.9 149.3c21.8 4.7 19.3 12.7 14.4 42.1c-.8 4.7-3.8 18.4 16.1 10.1s107.3-63.2 146.5-108.2c27-29.7 39.9-59.8 39.9-93.1z"/></svg>
                </a>
                <a href="https://www.tiktok.com/@ford.style.me?_t=ZS-8xV4v2n4np4&_r=1" className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M16 1h-3.5v15.5c0 1.5-1.5 3-3 3s-3-.5-3-3c0-2 1.899-3.339 3.5-3V10c-6.12 0-7 5-7 6.5S3.977 23 9.5 23c4.522 0 6.5-3.5 6.5-6V8c1.146 1.018 2.922 1.357 5 1.5V6c-3.017 0-5-2.654-5-5"/></svg>
                </a>
                <a href="https://www.youtube.com/@fordstyleme" className="w-6 h-6 text-white  flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 180"><path fill="#f00" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134"/><path fill="#fff" d="m102.421 128.06l66.328-38.418l-66.328-38.418z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-100 mt-4 pt-4 text-center">
          <p className="minimal-text text-sm">
            © 2024 {companyData?.companyInfo.name || 'Ford Thailand'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}