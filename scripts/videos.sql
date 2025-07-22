-- ลบตาราง videos ถ้ามีอยู่
DROP TABLE IF EXISTS videos;

-- สร้างตาราง videos ใหม่
CREATE TABLE videos (
    id BIGINT PRIMARY KEY,
    youtube_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับตารางอื่น)
CREATE POLICY "Videos Table Public Access" ON videos FOR SELECT USING (true);

-- สร้าง Policy สำหรับการจัดการข้อมูล (ให้ทุกคนจัดการได้)
CREATE POLICY "Videos Table Public Insert" ON videos FOR INSERT WITH CHECK (true);
CREATE POLICY "Videos Table Public Update" ON videos FOR UPDATE USING (true);
CREATE POLICY "Videos Table Public Delete" ON videos FOR DELETE USING (true);

-- Enable RLS (Row Level Security)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
