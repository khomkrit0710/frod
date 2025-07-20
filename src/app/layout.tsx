import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ford Style Me",
  description: "ตัวแทนจำหน่ายรถยนต์ Ford อย่างเป็นทางการ มีให้บริการครบครัน ทั้งขายรถใหม่ รถมือสอง และบริการหลังการขาย",
    icons: {
    icon: [
      { url: '/logo_browser/ford-style-logo.png.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/logo_browser/ford-style-logo.png.png' },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}