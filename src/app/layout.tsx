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

export const metadata: Metadata = {
  title: 'TailGramm',
  description: 'TailGramm is a social network for your pets.',
}
const RootLayout: FC<PropsWithChildren> = async ({ children }) => (
  <html lang="en">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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

export default RootLayout
