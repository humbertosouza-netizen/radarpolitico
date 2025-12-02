import type { Metadata, Viewport } from 'next'
import './globals.css'
import { RegisterSW } from './register-sw'

export const metadata: Metadata = {
  title: 'Radar Político',
  description: 'Sistema de inteligência política que monitora grupos de WhatsApp usando IA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Radar Político',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'Radar Político',
    title: 'Radar Político',
    description: 'Sistema de inteligência política que monitora grupos de WhatsApp usando IA',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#050B16',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#050B16" />
      </head>
      <body>
        <RegisterSW />
        {children}
      </body>
    </html>
  )
}
