import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

// Set up modern Geist fonts and expose them as CSS variables used in `globals.css`
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'AI Heart Disease Prediction System',
  description: 'Advanced Machine Learning System for Cardiovascular Health Assessment',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {/* Global background + subtle framing so every page feels like a premium app */}
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
          {children}
        </div>
      </body>
    </html>
  )
}
