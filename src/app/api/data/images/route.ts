import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const filePath = path.join(process.cwd(), 'src', 'data', 'images.json')

export async function GET() {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (err) {
    console.error('Error reading images data:', err)
    return NextResponse.json(
      { error: 'ไม่สามารถอ่านข้อมูลรูปภาพได้' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // เขียนข้อมูลลงไฟล์
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'บันทึกข้อมูลรูปภาพสำเร็จ' })
  } catch (err) {
    console.error('Error saving images data:', err)
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูลรูปภาพ' },
      { status: 500 }
    )
  }
}
