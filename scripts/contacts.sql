-- ลบตาราง contacts ถ้ามีอยู่
DROP TABLE IF EXISTS contacts;

-- สร้างตาราง contacts ใหม่
CREATE TABLE contacts (
    id BIGINT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    qr_code TEXT,
    description TEXT,
    url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ลบ Storage bucket ถ้ามีอยู่แล้วสร้างใหม่
DELETE FROM storage.buckets WHERE id = 'contacts';

-- สร้าง Storage bucket สำหรับเก็บรูปภาพ contacts
INSERT INTO storage.buckets (id, name, public) VALUES ('contacts', 'contacts', true);

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับ bucket อื่น)
CREATE POLICY "Contacts Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'contacts');

-- สร้าง Policy สำหรับ upload
CREATE POLICY "Contacts Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'contacts');

-- สร้าง Policy สำหรับลบไฟล์
CREATE POLICY "Contacts Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'contacts');

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับตารางอื่น)
CREATE POLICY "Contacts Table Public Access" ON contacts FOR SELECT USING (true);

-- สร้าง Policy สำหรับการจัดการข้อมูล (ให้ทุกคนจัดการได้)
CREATE POLICY "Contacts Table Public Insert" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Contacts Table Public Update" ON contacts FOR UPDATE USING (true);
CREATE POLICY "Contacts Table Public Delete" ON contacts FOR DELETE USING (true);

-- Enable RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
