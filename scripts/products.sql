-- ลบตาราง products ถ้ามีอยู่
DROP TABLE IF EXISTS products;

-- สร้างตาราง products ใหม่
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price VARCHAR(50),
  original_price VARCHAR(50),
  discount VARCHAR(50),
  warranty VARCHAR(100),
  colors TEXT[], -- Array ของสี
  description TEXT,
  features TEXT[], -- Array ของคุณสมบัติ
  image TEXT, -- URL ของรูปภาพ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ลบไฟล์ทั้งหมดใน bucket products ก่อน (ถ้ามี)
DELETE FROM storage.objects WHERE bucket_id = 'products';

-- ลบ Storage bucket ถ้ามีอยู่
DELETE FROM storage.buckets WHERE id = 'products';

-- สร้าง Storage bucket สำหรับเก็บรูปภาพ products
INSERT INTO storage.buckets (id, name, public) 
SELECT 'products', 'products', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'products');

-- ลบ Policy เก่า (ถ้ามี)
DROP POLICY IF EXISTS "Products Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Products Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Products Public Delete" ON storage.objects;

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับ bucket อื่น)
CREATE POLICY "Products Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');

-- สร้าง Policy สำหรับ upload
CREATE POLICY "Products Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products');

-- สร้าง Policy สำหรับลบไฟล์
CREATE POLICY "Products Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products');

-- เพิ่มข้อมูลตัวอย่าง
INSERT INTO products (name, price, original_price, discount, warranty, colors, description, features, image) VALUES
('ชุดแต่ง Ford Ranger Raptor', '89,900', '99,900', '10,000', '1 ปี', 
 ARRAY['ดำ', 'เงิน', 'คาร์บอน'], 
 'ชุดแต่งรอบคันสำหรับ Ford Ranger Raptor', 
 ARRAY['กันชนหน้า-หลัง', 'ชุดกรอบล้อ', 'สปอยเลอร์'], 
 '/image_test/logo.png'),

('ระบบไฟ LED รอบคัน', '25,900', '29,900', '4,000', '2 ปี',
 ARRAY['ขาว', 'เหลือง', 'น้ำเงิน'],
 'ระบบไฟ LED แบบครบชุด',
 ARRAY['ไฟหน้า LED', 'ไฟเลี้ยว LED', 'ไฟท้าย LED'],
 '/image_test/logo.png'),

('ล้อแม็กอัลลอย 18 นิ้ว', '45,900', '52,900', '7,000', '1 ปี',
 ARRAY['ดำ', 'เงิน', 'ทอง'],
 'ล้อแม็กอัลลอยสำหรับ Ford Ranger',
 ARRAY['วัสดุอัลลอย', 'ขนาด 18 นิ้ว', 'น้ำหนักเบา'],
 '/image_test/logo.png'),

('เบาะหนังแท้ครบชุด', '79,900', '89,900', '10,000', '2 ปี',
 ARRAY['ดำ', 'น้ำตาล', 'ครีม'],
 'เบาะหนังแท้คุณภาพสูง',
 ARRAY['หนังแท้ 100%', 'ระบบปรับไฟฟ้า', 'ระบบผลิตลมร้อน-เย็น'],
 '/image_test/logo.png'),

('ชุดกันสาด Ford Everest', '15,900', '18,900', '3,000', '1 ปี',
 ARRAY['ใส', 'ดำ', 'น้ำเงิน'],
 'ชุดกันสาดรอบคันสำหรับ Ford Everest',
 ARRAY['วัสดุอคริลิค', 'ระบบยึดแน่น', 'ป้องกันฝนและแดด'],
 '/image_test/logo.png'),

('ระบบเสียง Premium', '69,900', '79,900', '10,000', '2 ปี',
 ARRAY['ดำ'],
 'ระบบเสียงคุณภาพสูง',
 ARRAY['ลำโพง 12 ตัว', 'เครื่องขยายเสียง', 'ซับวูฟเฟอร์'],
 '/image_test/logo.png');

-- สร้าง function อัปเดท timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- สร้าง trigger สำหรับอัปเดท updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- เปิดใช้งาน RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- ลบ Policy เก่าของตาราง products (ถ้ามี)
DROP POLICY IF EXISTS "Products Table Public Access" ON products;
DROP POLICY IF EXISTS "Products Table Public Insert" ON products;
DROP POLICY IF EXISTS "Products Table Public Update" ON products;
DROP POLICY IF EXISTS "Products Table Public Delete" ON products;

-- สร้าง Policy สำหรับให้ทุกคนอ่านได้ (ใช้ชื่อที่ไม่ซ้ำกับตารางอื่น)
CREATE POLICY "Products Table Public Access" ON products FOR SELECT USING (true);

-- สร้าง Policy สำหรับการจัดการข้อมูล (ให้ทุกคนจัดการได้)
CREATE POLICY "Products Table Public Insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products Table Public Update" ON products FOR UPDATE USING (true);
CREATE POLICY "Products Table Public Delete" ON products FOR DELETE USING (true);