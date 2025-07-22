import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/supabase-services'

export async function DELETE(request: NextRequest) {
  try {
    const { fileUrl, filePath } = await request.json()
    
    if (!fileUrl && !filePath) {
      return NextResponse.json(
        { error: 'ไม่พบ URL หรือ path ของไฟล์ที่ต้องการลบ' },
        { status: 400 }
      )
    }

    // ถ้ามี filePath ให้ใช้, ถ้าไม่มีให้แปลงจาก fileUrl
    let pathToDelete = filePath
    
    if (!pathToDelete && fileUrl) {
      // แปลง Supabase URL เป็น file path
      // URL รูปแบบ: https://xxx.supabase.co/storage/v1/object/public/ford-images/logos/filename.jpg
      const urlParts = fileUrl.split('/ford-images/')
      if (urlParts.length > 1) {
        pathToDelete = urlParts[1]
      }
    }

    if (pathToDelete) {
      // ลบไฟล์จาก Supabase Storage
      await storageService.deleteFile(pathToDelete)
      
      return NextResponse.json({ 
        success: true, 
        message: 'ลบไฟล์สำเร็จ' 
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        message: 'ไม่สามารถระบุ path ของไฟล์ได้' 
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
