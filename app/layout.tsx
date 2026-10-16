import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Kanit, Playfair_Display } from 'next/font/google'
import { CartProvider } from '@/components/cart-provider'
import { CartDrawer } from '@/components/cart-drawer'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import './globals.css'

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-kanit',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'LOBA BAGUES | Cosmética',
  description:
    'Tienda de cosmética LOBA BAGUES: aceites, rubores, esmaltes y cuidado de la piel con envíos a todo el país.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#2b1f27',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`light bg-background ${kanit.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
