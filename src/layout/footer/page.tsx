export default function FooterPage() {
  return (
    <footer id="contact" className="bg-[#1e3b6d] border-t border-blue-100">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <img 
              src="/image_test/logo.png" 
              alt="Ford Logo"
              width={80}
              height={40}
              className="mb-2"
            />
            <p className="minimal-text text-sm">
              ตัวแทนจำหน่ายรถยนต์ Ford อย่างเป็นทางการ
              <br />
              มีให้บริการครบครัน ทั้งขายรถใหม่ รถมือสอง และบริการหลังการขาย
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-light text-white mb-2">ติดต่อเรา</h3>
            <div className="space-y-1">
              <p className="minimal-text text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                02-123-4567
              </p>
              <p className="minimal-text text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                info@ford-thailand.com
              </p>
              <p className="minimal-text text-sm flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                123/45 ถนนสุขุมวิท กรุงเทพฯ 10110
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-light text-white mb-2">เวลาทำการ</h3>
            <div className="space-y-1">
              <p className="minimal-text text-sm">จันทร์ - ศุกร์: 09:00 - 18:00 น.</p>
              <p className="minimal-text text-sm">เสาร์ - อาทิตย์: 09:00 - 17:00 น.</p>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-light text-white mb-2">ติดตามเรา</h4>
              <div className="flex space-x-2">
                <a href="#" className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
                <a href="#" className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                    <path d="M11.893 8.334c-.208 0-.464.099-.622.256-.145.145-.342.426-.472.703-.252.53-.01 1.048.248 1.565.324.65 1.406 3.465 5.6 4.004.852.109 1.374-.85 1.565-1.103.32-.424.3-.689.074-.979-.18-.218-.756-.327-1.565-.981-.75-.607-1.347-1.392-1.347-1.392-.207-.366-.756-.218-.756-.218s-.51.054-.78.3c-.113.098-.513.447-.38 1.298.14.897.444 1.524.444 1.524.18.496.9.918 1.603.918.425 0 .445-.167.445-.167s.178-.245.178-.245c.09-.09.178-.089.178-.089.444-.287.334-.577.334-.577-.267-.733-.89-1.565-1.603-1.565z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-blue-100 mt-4 pt-4 text-center">
          <p className="minimal-text text-sm">
            © 2024 Ford Thailand. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
