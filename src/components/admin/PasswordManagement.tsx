'use client'

import { useState } from 'react'

export default function PasswordManagement() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'
    }
    return ''
  }

  const handleChangePassword = async () => {
    setMessage('')
    
    // ตรวจสอบข้อมูล
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage('กรุณากรอกข้อมูลให้ครบถ้วน')
      setMessageType('error')
      return
    }

    const passwordError = validatePassword(newPassword)
    if (passwordError) {
      setMessage(passwordError)
      setMessageType('error')
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน')
      setMessageType('error')
      return
    }

    if (currentPassword === newPassword) {
      setMessage('รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม')
      setMessageType('error')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          username: 'admin'  // ใช้ key ที่ตรงกับไฟล์ admin.json
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('เปลี่ยนรหัสผ่านสำเร็จ')
        setMessageType('success')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage(data.message || 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      setMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">เปลี่ยนรหัสผ่าน</h2>
          <p className="text-sm text-gray-600 mt-1">
            เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบแอดมิน
          </p>
        </div>

        <div className="px-6 py-6">
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {messageType === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่านปัจจุบัน
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกรหัสผ่านปัจจุบัน"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                รหัสผ่านใหม่
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกรหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ยืนยันรหัสผ่านใหม่
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    กำลังดำเนินการ...
                  </div>
                ) : (
                  'เปลี่ยนรหัสผ่าน'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">ข้อกำหนดรหัสผ่าน:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</li>
              <li>รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเดิม</li>
              <li>ควรใช้รหัสผ่านที่ปลอดภัยและจำง่าย</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
