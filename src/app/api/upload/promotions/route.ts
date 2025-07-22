import { NextRequest, NextResponse } from 'next/server'
import { promotionService } from '@/lib/supabase-services'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบไฟล์' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'ไฟล์ต้องเป็นรูปภาพเท่านั้น' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'ไฟล์มีขนาดใหญ่เกิน 5MB' },
        { status: 400 }
      )
    }

    const imageUrl = await promotionService.uploadImage(file)

    return NextResponse.json({
      success: true,
      fileUrl: imageUrl
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการอัปโหลด' },
      { status: 500 }
    )
  }
}
