'use client'

import { useState, useEffect } from 'react'
import { contactService, Contact } from '@/lib/supabase-services'

export default function ContactManagement() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [originalQrCode, setOriginalQrCode] = useState<string>('') // เก็บ QR code เดิม
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await contactService.getAll()
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล')
    } finally {
      setLoading(false)
    }
  }

  const handleAddContact = () => {
    const newContact: Contact = {
      id: Date.now(),
      name: '',
      type: 'social',
      qr_code: '',
      description: '',
      url: ''
    }
    setEditingContact(newContact)
    setOriginalQrCode('') // ไม่มี QR code เดิม
    setIsEditing(false)
    setShowForm(true)
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact({ ...contact })
    setOriginalQrCode(contact.qr_code) // เก็บ QR code เดิม
    setIsEditing(true)
    setShowForm(true)
  }

  const handleDeleteContact = async (id: number) => {
    if (confirm('คุณต้องการลบข้อมูลนี้หรือไม่?')) {
      try {
        // หาข้อมูล contact ที่จะลบ
        const contactToDelete = contacts.find(contact => contact.id === id)
        
        // ลบไฟล์รูปภาพถ้ามี
        if (contactToDelete?.qr_code) {
          try {
            await contactService.deleteImage(contactToDelete.qr_code)
          } catch (error) {
            console.error('Error deleting image:', error)
          }
        }
        
        await contactService.delete(id)
        setContacts(contacts.filter(contact => contact.id !== id))
        alert('ลบข้อมูลสำเร็จ!')
      } catch (error) {
        console.error('Error deleting contact:', error)
        alert('เกิดข้อผิดพลาดในการลบข้อมูล')
      }
    }
  }

  const handleSaveContact = async () => {
    if (!editingContact) return

    try {
      if (isEditing) {
        const updatedContact = await contactService.update(editingContact.id, {
          name: editingContact.name,
          type: editingContact.type,
          qr_code: editingContact.qr_code,
          description: editingContact.description,
          url: editingContact.url
        })
        
        setContacts(contacts.map(contact =>
          contact.id === editingContact.id ? updatedContact : contact
        ))
      } else {
        const newContact = await contactService.create({
          name: editingContact.name,
          type: editingContact.type,
          qr_code: editingContact.qr_code,
          description: editingContact.description,
          url: editingContact.url
        })
        
        setContacts([...contacts, newContact])
      }
      
      alert('บันทึกข้อมูลสำเร็จ!')
      setShowForm(false)
      setIsEditing(false)
      setEditingContact(null)
      setOriginalQrCode('')
    } catch (error) {
      console.error('Error saving contact:', error)
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล')
    }
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
      // ลบไฟล์เก่าก่อนอัปโหลดไฟล์ใหม่
      if (editingContact?.qr_code) {
        try {
          await contactService.deleteImage(editingContact.qr_code)
        } catch (error) {
          console.error('Error deleting old file:', error)
        }
      }

      const imageUrl = await contactService.uploadImage(file)
      handleInputChange('qr_code', imageUrl)
      alert('อัปโหลดรูปภาพสำเร็จ!')
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

      {loading ? (
        <div className="text-center py-8">
          <div className="text-gray-600">กำลังโหลดข้อมูล...</div>
        </div>
      ) : (
        <>
          {/* Contact List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {contacts.map((contact) => (
              <div key={contact.id} className="bg-white p-4 rounded-lg shadow border">
                <div className="text-center">
                  <img 
                    src={contact.qr_code} 
                    alt={contact.name}
                    className="w-32 h-32 object-cover mx-auto mb-3 rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-qr.png'
                    }}
                  />
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{contact.description}</p>
                  <p className="text-blue-600 text-sm mb-2 break-all">{contact.url}</p>
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
        </>
      )}

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
                      value={editingContact.qr_code}
                      onChange={(e) => handleInputChange('qr_code', e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder="URL รูปภาพ QR Code"
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
                  {editingContact.qr_code && (
                    <img 
                      src={editingContact.qr_code} 
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

              <div>
                <label className="block text-sm font-medium mb-1">ลิงก์ URL</label>
                <input
                  type="url"
                  value={editingContact.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="https://www.facebook.com/yourpage"
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
                onClick={async () => {
                  // ถ้าไม่ใช่การแก้ไขและมีการอัปโหลดไฟล์ใหม่ ให้ลบไฟล์ที่อัปโหลด
                  if (!isEditing && editingContact?.qr_code && editingContact.qr_code !== originalQrCode) {
                    try {
                      await contactService.deleteImage(editingContact.qr_code)
                    } catch (error) {
                      console.error('Error deleting uploaded file:', error)
                    }
                  }
                  // ถ้าเป็นการแก้ไขและมีการเปลี่ยน QR code ให้ลบไฟล์ใหม่
                  else if (isEditing && editingContact?.qr_code !== originalQrCode && editingContact?.qr_code) {
                    try {
                      await contactService.deleteImage(editingContact.qr_code)
                    } catch (error) {
                      console.error('Error deleting new uploaded file:', error)
                    }
                  }
                  
                  setShowForm(false)
                  setEditingContact(null)
                  setOriginalQrCode('')
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
