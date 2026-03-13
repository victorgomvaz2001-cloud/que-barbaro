'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  return (
    <select
      value={locale}
      onChange={(e) => router.replace(pathname, { locale: e.target.value })}
      className="font-secondary cursor-pointer appearance-none border-none bg-transparent text-[11px] font-bold uppercase tracking-[0.08em] text-navy outline-none transition-opacity hover:opacity-70"
    >
      <option value="es">ES</option>
      <option value="en">EN</option>
    </select>
  )
}
