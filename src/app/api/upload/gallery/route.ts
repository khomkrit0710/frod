import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file received' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // สร้าง directory ถ้าไม่มี
    const uploadDir = path.join(process.cwd(), 'public/gallery')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // สร้างชื่อไฟล์ใหม่ที่ไม่ซ้ำ
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const fileName = `gallery_${timestamp}${extension}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)

    const fileUrl = `/gallery/${fileName}`
    return NextResponse.json({ fileUrl, fileName })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
