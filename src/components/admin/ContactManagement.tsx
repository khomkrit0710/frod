'use client'

import { useState, useEffect } from 'react'

interface Contact {
  id: number
  name: string
  type: string
  qrCode: string
  description: string
}

interface ContactData {
  contacts: Contact[]
}

export default function ContactManagement() {
  const [contactData, setContactData] = useState<ContactData>({ contacts: [] })
  const [isEditing, setIsEditing] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadContactData()
  }, [])

  const loadContactData = async () => {
    try {
      const response = await fetch('/api/data/contact')
      const data = await response.json()
      setContactData(data)
    } catch (error) {
      console.error('Error loading contact data:', error)
    }
  }

  const saveContactData = async () => {
    try {
      const response = await fetch('/api/data/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      })
      
      if (response.ok) {
        alert('บันทึกข้อมูลสำเร็จ!')
        setShowForm(false)
        setIsEditing(false)
        setEditingContact(null)
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
      }
    } catch (error) {
      console.error('Error saving contact data:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
  }

  const handleAddContact = () => {
    const newContact: Contact = {
      id: Date.now(),
      name: '',
      type: 'social',
      qrCode: '',
      description: ''
    }
    setEditingContact(newContact)
    setIsEditing(false)
    setShowForm(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact({ ...contact })
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDeleteContact = (id: number) => {
    if (confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) {
      const updatedContacts = contactData.contacts.filter(contact => contact.id !== id)
      setContactData({ contacts: updatedContacts })
    }
  }

  const handleSaveContact = () => {
    if (!editingContact) return

    if (isEditing) {
      const updatedContacts = contactData.contacts.map(contact =>
        contact.id === editingContact.id ? editingContact : contact
      )
      setContactData({ contacts: updatedContacts })
    } else {
      setContactData({
        contacts: [...contactData.contacts, editingContact]
      })
    }
    saveContactData()
  }

  const handleInputChange = (field: keyof Contact, value: string) => {
    if (editingContact) {
      setEditingContact({
        ...editingContact,
        [field]: value
      })
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/contact', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      
      if (result.success) {
        handleInputChange('qrCode', result.fileUrl)
        alert('อัปโหลดรูปภาพสำเร็จ!')
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการอัปโหลด')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('เกิดข้อผิดพลาดในการอัปโหลด')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">จัดการข้อมูลติดต่อ</h2>
        <button
          onClick={handleAddContact}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          เพิ่มช่องทางติดต่อ
        </button>
      </div>

      {/* Contact List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {contactData.contacts.map((contact) => (
          <div key={contact.id} className="bg-white p-4 rounded-lg shadow border">
            <div className="text-center">
              <img 
                src={contact.qrCode} 
                alt={contact.name}
                className="w-32 h-32 object-cover mx-auto mb-3 rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder-qr.png'
                }}
              />
              <h3 className="font-semibold text-lg">{contact.name}</h3>
              <p className="text-gray-600 text-sm mb-2">{contact.description}</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                {contact.type}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditContact(contact)}
                  className="flex-1 bg-yellow-500 text-white py-1 px-3 rounded text-sm hover:bg-yellow-600"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="flex-1 bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600"
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contact Form Modal */}
      {showForm && editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? 'แก้ไขข้อมูลติดต่อ' : 'เพิ่มข้อมูลติดต่อ'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ชื่อช่องทาง</label>
                <input
                  type="text"
                  value={editingContact.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="เช่น Facebook, Line"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">ประเภท</label>
                <select
                  value={editingContact.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="social">Social Media</option>
                  <option value="chat">Chat</option>
                  <option value="video">Video</option>
                  <option value="phone">Phone</option>
                  <option value="email">Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">รูป QR Code</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editingContact.qrCode}
                      onChange={(e) => handleInputChange('qrCode', e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="/contact/facebook.jpg"
                    />
                    <label className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                      {uploading ? 'กำลังอัปโหลด...' : 'อัปโหลด'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  {editingContact.qrCode && (
                    <img 
                      src={editingContact.qrCode} 
                      alt="Preview"
                      className="mt-2 w-32 h-32 object-cover rounded border mx-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">คำอธิบาย</label>
                <textarea
                  value={editingContact.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-2 border rounded h-20"
                  placeholder="คำอธิบายเกี่ยวกับช่องทางติดต่อนี้"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveContact}
                disabled={uploading}
                className={`flex-1 py-2 px-4 rounded text-white ${
                  uploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {uploading ? 'กำลังอัปโหลด...' : 'บันทึก'}
              </button>
              <button
                onClick={() => {
                  setShowForm(false)
                  setEditingContact(null)
                  setIsEditing(false)
                }}
                disabled={uploading}
                className={`flex-1 py-2 px-4 rounded text-white ${
                  uploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
