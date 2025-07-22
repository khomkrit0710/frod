import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/supabase-services'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์' },
        { status: 400 }
      )
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'ไฟล์ต้องเป็นรูปภาพเท่านั้น' },
        { status: 400 }
      )
    }

    // ตรวจสอบขนาดไฟล์ (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ไฟล์ใหญ่เกินไป (สูงสุด 10MB)' },
        { status: 400 }
      )
    }

    // อัปโหลดไฟล์ไปยัง Supabase Storage
    const { url, path } = await storageService.uploadFile(file, 'logos')
    
    return NextResponse.json({ 
      success: true, 
      fileUrl: url,
      filePath: path,
      message: 'อัปโหลดไฟล์สำเร็จ' 
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
      { status: 500 }
    )
  }
}
