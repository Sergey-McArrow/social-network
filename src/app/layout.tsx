import { FC, PropsWithChildren } from 'react'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { Metadata } from 'next'
import { ThemeProvider } from '@/providers/theme-provider'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'TailGramm',
  description: 'TailGramm is a social network for your pets.',
}

type TRootLayoutProps = PropsWithChildren<{
  params: { locale: string }
}>

const RootLayout: FC<TRootLayoutProps> = async ({ children, params }) => {
  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme-preference"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
