import type { Metadata } from 'next'
import type { ApiResponse, ISEOPage } from '@falcanna/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

export async function fetchSEO(route: string): Promise<ISEOPage | null> {
  try {
    const params = new URLSearchParams({ route });
    const res = await fetch(`${API_URL}/seo?${params.toString()}`, {
      cache: 'no-store',
    })

    if (!res.ok) return null

    const json = (await res.json()) as ApiResponse<ISEOPage>
    return json.data
  } catch {
    return null
  }
}

export function buildMetadata(seo: ISEOPage | null, fallback: Partial<Metadata> = {}): Metadata {
  if (!seo) return fallback

  const alternates: Metadata['alternates'] = {}

  if (seo.canonical) {
    alternates.canonical = seo.canonical
  }

  if (seo.alternates?.languages) {
    alternates.languages = seo.alternates.languages
  }

  return {
    ...fallback,
    title: seo.title,
    description: seo.description,
    openGraph: seo.og
      ? {
          title: seo.og.title ?? seo.title,
          description: seo.og.description ?? seo.description,
          images: seo.og.image ? [{ url: seo.og.image }] : [],
          url: seo.og.url,
          type: (seo.og.type as 'website') ?? 'website',
        }
      : undefined,
    twitter: seo.twitterCard
      ? {
          card: seo.twitterCard.card ?? 'summary_large_image',
          title: seo.twitterCard.title ?? seo.title,
          description: seo.twitterCard.description ?? seo.description,
          images: seo.twitterCard.image ? [seo.twitterCard.image] : [],
        }
      : undefined,
    alternates: Object.keys(alternates).length ? alternates : undefined,
    robots: seo.robots
      ? {
          index: seo.robots.index ?? true,
          follow: seo.robots.follow ?? true,
          googleBot: seo.robots.googleBot,
        }
      : undefined,
  }
}
