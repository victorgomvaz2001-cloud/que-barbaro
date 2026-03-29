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

export default async function PromotionalBanner({ locale }: { locale: string }) {
  const promotion = await getActivePromotion()
  if (!promotion) return null

  const title = locale === 'en' ? promotion.title.en : promotion.title.es
  const description = locale === 'en' ? promotion.description.en : promotion.description.es
  const buttonText = locale === 'en' ? promotion.button.text.en : promotion.button.text.es

  const positionClass = promotion.position === 'bottom' ? 'bottom-0' : 'top-0'

  return (
    <div
      className={`sticky ${positionClass} left-0 z-50 w-full`}
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
        <div className="absolute inset-0 bg-black/55" aria-hidden="true" />

        {/* Content */}
        <div className="relative flex flex-col items-center justify-center gap-3 px-6 py-4 text-center sm:flex-row sm:gap-6 sm:text-left">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">{title}</p>
            {description && (
              <p className="mt-0.5 text-xs text-white/80 leading-snug">{description}</p>
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
