import { headers } from 'next/headers'
import type { ReactNode } from 'react'
import './globals.css'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const locale = headersList.get('x-next-intl-locale') ?? 'es'

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  )
}
