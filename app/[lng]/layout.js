// app/layout.js or your root layout file
import "@/app/globals.css";
import { Providers } from '@/app/Providers'

export const metadata = {
  title: 'AgriKart',
  description: 'An App made for farmers to eliminate middlemen and make the products reach farmers at lower prices',
}

export default function RootLayout({ children, params }) {
  const { lng } = params;

  return (
    <html lang={lng}>
      <body>
        <Providers lng={lng}>
          {children}
        </Providers>
      </body>
    </html>
  )
}