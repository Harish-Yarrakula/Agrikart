import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agrikart - Ecommerce Platform for Farmers',
  description: 'An ecommerce platform connecting farmers with consumers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
