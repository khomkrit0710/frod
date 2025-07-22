import { NextRequest, NextResponse } from 'next/server'
import { websiteImagesService } from '@/lib/supabase-services'

export async function GET() {
  try {
    const images = await websiteImagesService.getAll()
    
    // Transform to match the original JSON structure
    const data: Record<string, string> = {}
    
    for (const image of images) {
      data[image.image_type] = image.image_url
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading images data:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถอ่านข้อมูลรูปภาพได้' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Update each image type
    for (const [imageType, imageUrl] of Object.entries(data)) {
      if (imageType === 'logo' || imageType === 'footerLogo') {
        await websiteImagesService.update(imageType, imageUrl as string)
      }
    }
    
    return NextResponse.json({ success: true, message: 'บันทึกข้อมูลรูปภาพสำเร็จ' })
  } catch (error) {
    console.error('Error saving images data:', error)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลรูปภาพ' },
      { status: 500 }
    )
  }
}
