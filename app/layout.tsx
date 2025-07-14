import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Credenciamento',
  description: 'Developed by @codesynctech',
  generator: 'developer team',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="br">
      <body>{children}</body>
    </html>
  )
}
