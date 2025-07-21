import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const adminFilePath = path.join(process.cwd(), 'src/data/admin.json')

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword, username } = await request.json()

    if (!currentPassword || !newPassword || !username) {
      return NextResponse.json(
        { message: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      )
    }

    // ตรวจสอบว่ารหัสผ่านใหม่มีความยาวอย่างน้อย 6 ตัวอักษร
    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' },
        { status: 400 }
      )
    }

    // อ่านข้อมูลแอดมินปัจจุบัน
    let adminData = {}
    if (fs.existsSync(adminFilePath)) {
      const fileContent = fs.readFileSync(adminFilePath, 'utf-8')
      adminData = JSON.parse(fileContent)
    }

    // ตรวจสอบว่าผู้ใช้มีอยู่และรหัสผ่านปัจจุบันถูกต้อง
    // @ts-expect-error - adminData is a dynamic object with unknown keys
    const user = adminData[username]
    if (!user) {
      return NextResponse.json(
        { message: 'ไม่พบผู้ใช้นี้ในระบบ' },
        { status: 401 }
      )
    }

    if (user.password !== currentPassword) {
      return NextResponse.json(
        { message: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' },
        { status: 401 }
      )
    }

    // ตรวจสอบว่ารหัสผ่านใหม่ไม่เหมือนรหัสผ่านเดิม
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { message: 'รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม' },
        { status: 400 }
      )
    }

    // อัปเดตรหัสผ่าน
    const updatedAdminData = {
      ...adminData,
      [username]: {
        ...user,
        password: newPassword,
        lastPasswordChange: new Date().toISOString()
      }
    }

    // บันทึกข้อมูลลงไฟล์
    fs.writeFileSync(adminFilePath, JSON.stringify(updatedAdminData, null, 2), 'utf-8')

    return NextResponse.json({
      message: 'เปลี่ยนรหัสผ่านสำเร็จ',
      success: true
    })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน' },
      { status: 500 }
    )
  }
}
