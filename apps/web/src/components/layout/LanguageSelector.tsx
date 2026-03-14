'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

export default function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  const switchTo = (next: string) => {
    if (next !== locale) router.replace(pathname, { locale: next })
  }

  return (
    <div className="font-secondary flex items-center gap-3 text-[13px] uppercase tracking-[0.12em] select-none">
      <button
        onClick={() => switchTo('es')}
        className={[
          'transition-all duration-150 cursor-pointer',
          locale === 'es' ? 'text-navy' : 'text-navy/40 hover:text-navy',
        ].join(' ')}
      >
        ES
      </button>
      <span className="h-4 w-px bg-navy opacity-30" aria-hidden />
      <button
        onClick={() => switchTo('en')}
        className={[
          'transition-all duration-150 cursor-pointer',
          locale === 'en' ? 'text-navy' : 'text-navy/40 hover:text-navy',
        ].join(' ')}
      >
        EN
      </button>
    </div>
  )
}
