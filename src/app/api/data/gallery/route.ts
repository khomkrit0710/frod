import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'src/data/gallery.json')

export async function GET() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      // สร้างไฟล์เริ่มต้นถ้าไม่มี
      const defaultData = {
        images: []
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData, null, 2))
      return NextResponse.json(defaultData)
    }

    const fileContents = fs.readFileSync(dataFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error reading gallery data:', error)
    return NextResponse.json({ images: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving gallery data:', error)
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 })
  }
}
