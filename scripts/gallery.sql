-- ลบตาราง gallery_images ถ้ามีอยู่
DROP TABLE IF EXISTS gallery_images;

-- สร้างตาราง gallery_images ใหม่
CREATE TABLE gallery_images (
    id BIGINT PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับตารางอื่น)
CREATE POLICY "Gallery Table Public Access" ON gallery_images FOR SELECT USING (true);

-- สร้าง Policy สำหรับการจัดการข้อมูล (ให้ทุกคนจัดการได้)
CREATE POLICY "Gallery Table Public Insert" ON gallery_images FOR INSERT WITH CHECK (true);
CREATE POLICY "Gallery Table Public Update" ON gallery_images FOR UPDATE USING (true);
CREATE POLICY "Gallery Table Public Delete" ON gallery_images FOR DELETE USING (true);

-- Enable RLS (Row Level Security)
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
