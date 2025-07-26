import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata = {
  title: 'Repareka - Platform Jasa Reparasi Lokal',
  description: 'Temukan layanan reparasi terpercaya di sekitar Anda. Perbaiki, jangan buang!',
}

export default function RootLayout({ 
    children 
  }: { 
    children: React.ReactNode
  }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
