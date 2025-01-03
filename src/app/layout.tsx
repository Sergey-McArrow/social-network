import { FC, PropsWithChildren } from 'react'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { Metadata } from 'next'
import { ThemeProvider } from '@/providers/theme-provider'
import { cookies } from 'next/headers'

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

export const metadata: Metadata = {
  title: 'TailGramm',
  description: 'TailGramm is a social network for your pets.',
}
const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
  const cookieStore = await cookies()
  const lang = cookieStore.get('NEXT_LOCALE')?.value || 'en'
  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export default RootLayout
