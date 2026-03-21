export const dynamic = 'force-dynamic'

import { getLocale, getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import type { IGalleryPhoto, GalleryPageResponse } from '@falcanna/types'

async function fetchInitialPhotos(): Promise<{ photos: IGalleryPhoto[]; hasMore: boolean }> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
    const res = await fetch(`${apiUrl}/gallery?page=1&limit=16`, {
      cache: 'no-store',
    })
    if (!res.ok) return { photos: [], hasMore: false }
    const data: GalleryPageResponse = await res.json()
    return { photos: data.data, hasMore: data.hasMore }
  } catch {
    return { photos: [], hasMore: false }
  }
}

export default async function GaleriaPage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('galeria')])
  const seoRoute = locale === 'es' ? '/galeria' : `/${locale}/galeria`
  const { photos, hasMore } = await fetchInitialPhotos()

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Galería - Que Bárbaro' }} />

      {/* Header */}
      <div className="px-8 pt-16 pb-6">
        <p className="font-neue text-[10px] tracking-[0.3em] uppercase text-navy/45 mb-2">
          {t('eyebrow')}
        </p>
        <h1 className="font-primary text-[clamp(3rem,8vw,7rem)] uppercase leading-none text-navy mb-4">
          {t('title')}
        </h1>
        <div className="w-10 h-[2px] bg-orange" />
      </div>

      {/* Full-width gallery with infinite scroll */}
      <div className="w-full" style={{ padding: '0 2px' }}>
        <GalleryGrid initialPhotos={photos} initialHasMore={hasMore} />
      </div>

      <div className="pb-24" />
    </>
  )
}
