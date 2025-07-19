import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import fs from 'fs'

export async function DELETE(request: NextRequest) {
  try {
    const { fileUrl } = await request.json()
    
    if (!fileUrl) {
      return NextResponse.json(
        { error: 'ไม่พบ URL ไฟล์ที่ต้องการลบ' },
        { status: 400 }
      )
    }

    // แปลง URL เป็น path ของไฟล์จริง
    const filePath = path.join(process.cwd(), 'public', fileUrl)
    
    // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    if (fs.existsSync(filePath)) {
      // ลบไฟล์
      await unlink(filePath)
      
      return NextResponse.json({ 
        success: true, 
        message: 'ลบไฟล์สำเร็จ' 
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'ไฟล์ไม่พบ (อาจถูกลบไปแล้ว)' 
      })
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการลบไฟล์' },
      { status: 500 }
    )
  }
}
