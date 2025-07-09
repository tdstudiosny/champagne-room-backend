import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TD Studios AI Beast Portal',
  description: 'Tyler\'s AI Empire Command Center - Autonomous Business Automation & Revenue Generation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-black antialiased`}>
        <div className="min-h-screen flex flex-col">
        {children}
        </div>
      </body>
    </html>
  )
}
