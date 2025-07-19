import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

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

    // สร้างชื่อไฟล์ใหม่
    const timestamp = Date.now()
    const extension = file.name.split('.').pop()
    const filename = `promotion_${timestamp}.${extension}`

    // แปลงไฟล์เป็น bytes
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // เส้นทางสำหรับบันทึกไฟล์
    const uploadPath = path.join(process.cwd(), 'public', 'promotions', filename)
    
    // บันทึกไฟล์
    await writeFile(uploadPath, buffer)

    // ส่งกลับ URL ของไฟล์
    const fileUrl = `/promotions/${filename}`
    
    return NextResponse.json({ 
      success: true, 
      fileUrl,
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
