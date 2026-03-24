import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { IGalleryPhoto, GalleryPageResponse } from '@falcanna/types'

async function fetchPreviewPhotos(): Promise<IGalleryPhoto[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
    const res = await fetch(`${apiUrl}/gallery?page=1&limit=6`, { cache: 'no-store' })
    if (!res.ok) return []
    const data: GalleryPageResponse = await res.json()
    return data.data
  } catch {
    return []
  }
}

export default async function HomeGallery() {
  const [photos, t] = await Promise.all([fetchPreviewPhotos(), getTranslations('galeria')])

  if (photos.length === 0) return null

  return (
    <section className="bg-cream w-full py-16 px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="font-secondary text-[10px] uppercase tracking-[0.3em] text-navy/35 mb-3">
              {t('eyebrow')}
            </p>
            <h2 className="font-primary text-[clamp(2rem,5vw,4rem)] leading-none tracking-tight text-navy uppercase">
              {t('title')}
            </h2>
          </div>
          <Link
            href="/galeria"
            className="font-secondary text-[10px] uppercase tracking-[0.25em] text-navy/40 hover:text-navy transition-colors duration-200 whitespace-nowrap"
          >
            Ver galería →
          </Link>
        </div>

        {/* Grid — 6 photos */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px]">
          {photos.map((photo) => (
            <Link key={photo._id} href="/galeria" className="group relative block aspect-square overflow-hidden">
              <Image
                src={photo.url}
                alt={photo.alt ?? 'Qué Bárbaro galería'}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/25 transition-colors duration-300" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
