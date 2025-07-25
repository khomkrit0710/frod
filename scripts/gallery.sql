-- ลบตาราง gallery_images ถ้ามีอยู่
DROP TABLE IF EXISTS gallery_images;

-- สร้างตาราง gallery_images ใหม่
CREATE TABLE gallery_images (
    id BIGINT PRIMARY KEY,
    image_url TEXT NOT NULL,
    title VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ลบ policies เก่าก่อน
DROP POLICY IF EXISTS "Gallery Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Gallery Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Gallery Public Delete" ON storage.objects;

-- ลบไฟล์ใน Storage bucket ก่อน
DELETE FROM storage.objects WHERE bucket_id = 'gallery';
-- ลบ Storage bucket ถ้ามีอยู่แล้วสร้างใหม่
DELETE FROM storage.buckets WHERE id = 'gallery';

-- สร้าง Storage bucket สำหรับเก็บรูปภาพ gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับ bucket อื่น)
CREATE POLICY "Gallery Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

-- สร้าง Policy สำหรับ upload
CREATE POLICY "Gallery Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');

-- สร้าง Policy สำหรับลบไฟล์
CREATE POLICY "Gallery Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'gallery');

-- ลบ table policies เก่าก่อน
DROP POLICY IF EXISTS "Gallery Table Public Access" ON gallery_images;
DROP POLICY IF EXISTS "Gallery Table Public Insert" ON gallery_images;
DROP POLICY IF EXISTS "Gallery Table Public Update" ON gallery_images;
DROP POLICY IF EXISTS "Gallery Table Public Delete" ON gallery_images;

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับตารางอื่น)
CREATE POLICY "Gallery Table Public Access" ON gallery_images FOR SELECT USING (true);

-- สร้าง Policy สำหรับการจัดการข้อมูล (ให้ทุกคนจัดการได้)
CREATE POLICY "Gallery Table Public Insert" ON gallery_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Gallery Table Public Update" ON gallery_images FOR UPDATE USING (true);
CREATE POLICY "Gallery Table Public Delete" ON gallery_images FOR DELETE USING (true);

-- Enable RLS (Row Level Security)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- สร้าง index สำหรับการค้นหา
CREATE INDEX idx_gallery_images_created_at ON gallery_images(created_at DESC);
CREATE INDEX idx_gallery_images_title ON gallery_images(title);

-- เพิ่มข้อมูลตัวอย่าง (optional - uncomment ถ้าต้องการ)
-- INSERT INTO gallery_images (id, image_url, title, description) VALUES 
-- (1001, 'https://example.com/image1.jpg', 'รูปภาพ Ford Ranger', 'รถกระบะ Ford Ranger รุ่นใหม่ล่าสุด'),
-- (1002, 'https://example.com/image2.jpg', 'รูปภาพ Ford Everest', 'รถ SUV Ford Everest สำหรับครอบครัว'),
-- (1003, 'https://example.com/image3.jpg', 'อุปกรณ์ตกแต่ง', 'อุปกรณ์และอะไหล่ตกแต่งรถ Ford');

-- Script สำหรับเพิ่ม columns ในตารางที่มีอยู่แล้ว (หาก table มีอยู่แล้วและต้องการเพิ่ม columns)
-- ALTER TABLE gallery_images 
-- ADD COLUMN title VARCHAR(255),
-- ADD COLUMN description TEXT;

-- อัพเดตข้อมูลเดิมให้มี title และ description เริ่มต้น
-- UPDATE gallery_images 
-- SET title = 'รูปภาพ #' || id::text,
--     description = 'รูปภาพจาก Ford Thailand'
-- WHERE title IS NULL OR title = '';
