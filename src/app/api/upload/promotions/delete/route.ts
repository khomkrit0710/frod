import { NextRequest, NextResponse } from 'next/server'
import { promotionService } from '@/lib/supabase-services'

export async function DELETE(request: NextRequest) {
  try {
    const { fileUrl } = await request.json()
    
    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบ URL ไฟล์ที่ต้องการลบ' },
        { status: 400 }
      )
    }

    await promotionService.deleteImage(fileUrl)
    
    return NextResponse.json({ 
      success: true, 
      message: 'ลบไฟล์สำเร็จ' 
    })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json(
      { success: false, error: 'เกิดข้อผิดพลาดในการลบไฟล์' },
      { status: 500 }
    )
  }
}
