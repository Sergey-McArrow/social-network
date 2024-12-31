import { FC, PropsWithChildren } from 'react'
import './globals.css'
import { Geist, Geist_Mono } from 'next/font/google'
import { Metadata } from 'next'

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
      {children}
    </body>
  </html>
)

export default RootLayout
