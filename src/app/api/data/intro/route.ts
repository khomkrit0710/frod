import { NextRequest, NextResponse } from 'next/server'
import { introSlidesService } from '@/lib/supabase-services'

export async function GET() {
  try {
    const slides = await introSlidesService.getAll()
    
    // Transform to match the original JSON structure
    const data = {
      slides: slides.map(slide => ({
        id: slide.id,
        image: slide.image_url
      }))
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading intro data:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถอ่านข้อมูลได้' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Clear existing slides and insert new ones
    // First, get all existing slides to delete them
    const existingSlides = await introSlidesService.getAll()
    
    // Delete all existing slides
    for (const slide of existingSlides) {
      await introSlidesService.delete(slide.id)
    }
    
    // Insert new slides
    if (data.slides && Array.isArray(data.slides)) {
      for (const slide of data.slides) {
        await introSlidesService.create(slide.image)
      }
    }
    
    return NextResponse.json({ success: true, message: 'บันทึกข้อมูลสำเร็จ' })
  } catch (error) {
    console.error('Error saving intro data:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' },
      { status: 500 }
    )
  }
}
