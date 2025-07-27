import { Inter } from 'next/font/google'
import { AuthProvider } from '@/contexts/AuthContext'
import { ServiceWorkerProvider } from '@/components/providers/ServiceWorkerProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { ErrorHandlingInitializer } from '@/lib/utils/setupErrorHandling'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap', // Optimasi font loading
})

export const metadata = {
  title: 'Repareka - Platform Jasa Reparasi Lokal',
  description: 'Temukan layanan reparasi terpercaya di sekitar Anda. Perbaiki, jangan buang!',
  keywords: 'reparasi, service, perbaikan, UMKM, lokal, Indonesia',
  authors: [{ name: 'Repareka Team' }],
  creator: 'Repareka',
  publisher: 'Repareka',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Repareka - Platform Jasa Reparasi Lokal',
    description: 'Temukan layanan reparasi terpercaya di sekitar Anda. Perbaiki, jangan buang!',
    url: '/',
    siteName: 'Repareka',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Repareka - Platform Jasa Reparasi Lokal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Repareka - Platform Jasa Reparasi Lokal',
    description: 'Temukan layanan reparasi terpercaya di sekitar Anda. Perbaiki, jangan buang!',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Repareka',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#10b981' },
    { media: '(prefers-color-scheme: dark)', color: '#10b981' },
  ],
  colorScheme: 'light dark',
}

export default function RootLayout({ 
    children 
  }: { 
    children: React.ReactNode
  }) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        {/* Preconnect untuk performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* PWA Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* iOS PWA Support */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Repareka" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#10b981" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preload critical resources */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased mobile-viewport">
        <ErrorHandlingInitializer />
        <ErrorBoundary>
          <ToastProvider>
            <ServiceWorkerProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ServiceWorkerProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
