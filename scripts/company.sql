-- Create Company Info table
CREATE TABLE IF NOT EXISTS company_info (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Working Hours table
CREATE TABLE IF NOT EXISTS working_hours (
    id BIGSERIAL PRIMARY KEY,
    weekdays TEXT NOT NULL,
    weekends TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;

-- Create policies for company_info table
CREATE POLICY "Company Info Public Access" ON company_info
    FOR ALL USING (true);

-- Create policies for working_hours table
CREATE POLICY "Working Hours Public Access" ON working_hours
    FOR ALL USING (true);

-- Insert default data from the existing company.json
INSERT INTO company_info (name, description, phone, email, address) VALUES 
(
    'Ford Thailand',
    'ตัวแทนจำหน่ายรถยนต์ Ford อย่างเป็นทางการ มีให้บริการครบครัน ทั้งขายรถใหม่ รถมือสอง และบริการหลังการขาย',
    '08 7666 5565',
    'thanakorn.mf@neoautogroup.com',
    '31 ถ. พระรามที่ 2 แขวงท่าข้าม เขตบางขุนเทียน กรุงเทพมหานคร 10150'
)
ON CONFLICT DO NOTHING;

INSERT INTO working_hours (weekdays, weekends) VALUES 
(
    'จันทร์-เสาร์ 8:30–19:00',
    'อาทิตย์ ปิดทำการ'
)
ON CONFLICT DO NOTHING;
