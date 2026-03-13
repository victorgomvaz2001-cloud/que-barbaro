import { buildMetadata } from '@/lib/seo'
import type { ISEOPage } from '@falcanna/types'

const mockSEO: ISEOPage = {
  _id: 'seo-1',
  route: '/us-wa/strains',
  title: 'WA Strains',
  description: 'Our Washington strains',
  og: {
    title: 'WA Strains OG',
    image: 'https://example.com/og.jpg',
  },
  twitterCard: {
    card: 'summary_large_image',
  },
  canonical: 'https://falcanna.com/us-wa/strains',
  robots: { index: true, follow: true },
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}

describe('buildMetadata', () => {
  it('returns fallback when seo is null', () => {
    const meta = buildMetadata(null, { title: 'Fallback' })
    expect(meta.title).toBe('Fallback')
  })

  it('builds metadata from SEO object', () => {
    const meta = buildMetadata(mockSEO)
    expect(meta.title).toBe('WA Strains')
    expect(meta.description).toBe('Our Washington strains')
  })

  it('includes canonical URL', () => {
    const meta = buildMetadata(mockSEO)
    expect(meta.alternates?.canonical).toBe('https://falcanna.com/us-wa/strains')
  })

  it('includes openGraph data', () => {
    const meta = buildMetadata(mockSEO)
    expect(meta.openGraph?.title).toBe('WA Strains OG')
  })

  it('includes twitter card', () => {
    const meta = buildMetadata(mockSEO)
    expect(meta.twitter?.card).toBe('summary_large_image')
  })
})
