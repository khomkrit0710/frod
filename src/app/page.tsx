
'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '../layout/header/page'
import IntroPage from '../components/intro/page'
import WorkingPage from '../components/working/page'
import PromotionPage from '../components/promotion/page'
import FooterPage from '../layout/footer/page'

export default function Home() {
  const searchParams = useSearchParams()

  useEffect(() => {
    // ตรวจสอบว่ามี section parameter หรือไม่
    const section = searchParams.get('section')
    if (section) {
      // รอให้ component โหลดเสร็จแล้วค่อย scroll
      setTimeout(() => {
        const element = document.getElementById(section)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
  }, [searchParams])

  return (
    <div className="min-h-screen">
      <Header />
      <IntroPage />
      <div className='mx-10'>
        <WorkingPage />
        <PromotionPage />
      </div>
      <FooterPage />
    </div>
  );
}
