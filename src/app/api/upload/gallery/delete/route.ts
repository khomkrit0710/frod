import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const { fileUrl } = await request.json()

    if (!fileUrl) {
      return NextResponse.json({ error: 'No file URL provided' }, { status: 400 })
    }

    // แปลง URL เป็น file path
    const fileName = path.basename(fileUrl)
    const filePath = path.join(process.cwd(), 'public/gallery', fileName)

    // ตรวจสอบว่าไฟล์มีอยู่จริง
    if (existsSync(filePath)) {
      await unlink(filePath)
      return NextResponse.json({ success: true, message: 'File deleted successfully' })
    } else {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
