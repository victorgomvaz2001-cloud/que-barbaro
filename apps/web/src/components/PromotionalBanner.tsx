import { getLocale } from 'next-intl/server'
import type { IPromotion } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

async function getActivePromotion(): Promise<IPromotion | null> {
  try {
    const res = await fetch(`${API_URL}/promotions/active`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    const json = await res.json()
    return json.data ?? null
  } catch {
    return null
  }
}

export default async function PromotionalBanner() {
  const locale = await getLocale()
  const promotion = await getActivePromotion()
  if (!promotion) return null

  const title = locale === 'en' ? promotion.title.en : promotion.title.es
  const description = locale === 'en' ? promotion.description.en : promotion.description.es
  const buttonText = locale === 'en' ? promotion.button.text.en : promotion.button.text.es

  // top-20 = 80px, the height of the navbar, so the banner sticks just below it
  const isBottom = promotion.position === 'bottom'
  const positionClass = isBottom ? 'fixed bottom-0' : 'sticky top-20'

  const sizeStyles = {
    s: { content: 'py-2 gap-2 sm:gap-4', title: 'text-xs font-semibold', description: 'text-[10px]' },
    m: { content: 'py-4 gap-3 sm:gap-6', title: 'text-sm font-semibold',  description: 'text-xs'     },
    l: { content: 'py-6 gap-4 sm:gap-8', title: 'text-base font-semibold', description: 'text-sm'    },
  }[promotion.size ?? 's']

  return (
    <div
      className={`${positionClass} left-0 z-50 w-full`}
      role="banner"
      aria-label={title}
    >
      {/* Background image with overlay */}
      <div className="relative w-full overflow-hidden">
        {promotion.backgroundImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${promotion.backgroundImage})` }}
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

        {/* Content */}
        <div className={`relative flex flex-col items-center justify-center px-6 text-center sm:flex-row sm:text-left ${sizeStyles.content}`}>
          <div className="min-w-0">
            <p className={`text-white leading-tight ${sizeStyles.title}`}>{title}</p>
            {description && (
              <p className={`mt-0.5 text-white/80 leading-snug ${sizeStyles.description}`}>{description}</p>
            )}
          </div>
          <a
            href={promotion.button.url}
            target={promotion.button.target}
            rel={promotion.button.target === '_blank' ? 'noopener noreferrer' : undefined}
            className="shrink-0 rounded border border-white/80 px-4 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-white hover:text-black"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  )
}
