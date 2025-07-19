import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    // อ่านไฟล์ admin.json
    const filePath = path.join(process.cwd(), 'src', 'data', 'admin.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const adminData = JSON.parse(fileContents)
    
    // ตรวจสอบข้อมูล login
    if (username === adminData.admin.username && password === adminData.admin.password) {
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        user: {
          username: adminData.admin.username,
          email: adminData.admin.email
        }
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในระบบ' },
      { status: 500 }
    )
  }
}
