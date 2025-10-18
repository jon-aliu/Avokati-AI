import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Avokati AI - Kosovo Legal Assistant',
    template: '%s | Avokati AI',
  },
  description: 'Get instant, accurate answers about Kosovo laws. AI-powered legal assistant with official citations.',
  keywords: ['Kosovo', 'Legal', 'AI', 'Law', 'Assistant', 'Lawyer', 'Legal Research', 'RAG'],
  authors: [{ name: 'Avokati AI Team' }],
  creator: 'Avokati AI',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://avokati.ai',
    title: 'Avokati AI - Kosovo Legal Assistant',
    description: 'AI-powered legal assistant for Kosovo law',
    siteName: 'Avokati AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Avokati AI - Kosovo Legal Assistant',
    description: 'AI-powered legal assistant for Kosovo law',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0ea5e9' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Mobile-First Responsive Viewport */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, minimum-scale=1.0, user-scalable=yes, viewport-fit=cover"
        />
        
        {/* Theme Colors - Different for iOS and Android */}
        <meta name="theme-color" content="#0e7490" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#0e7490" media="(prefers-color-scheme: light)" />
        
        {/* iOS Specific - Status Bar */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Avokati AI" />
        
        {/* iOS - Prevent automatic phone number detection (can be annoying) */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* Android - Disable tap highlight color */}
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Performance Hints */}
        <meta name="color-scheme" content="dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans`}>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgb(30 41 59 / 0.9)',
                color: '#fff',
                border: '1px solid rgb(51 65 85)',
                borderRadius: '0.75rem',
                backdropFilter: 'blur(16px)',
                padding: '12px 16px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
