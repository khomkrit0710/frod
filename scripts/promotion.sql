CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- สร้างตาราง promotions
CREATE TABLE promotions (
    id BIGINT PRIMARY KEY,
    category_id INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- สร้าง Storage bucket สำหรับเก็บรูปภาพ
INSERT INTO storage.buckets (id, name, public) VALUES ('promotions', 'promotions', true);

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'promotions');

-- สร้าง Policy สำหรับ upload (ถ้าต้องการให้ authenticated user upload ได้)
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'promotions');