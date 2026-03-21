import { notFound } from 'next/navigation'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import SEOHead from '@/components/SEOHead'
import ServiceCarousel from '@/components/servicios/ServiceCarousel'

const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'

const SERVICE_SLUGS = ['corte', 'coloracion', 'tratamientos', 'barberia', 'maquillaje', 'eventos'] as const

const SERVICE_META = [
  {
    index: '01',
    images: [
      `${S3}/service1.jpg`,
      `${S3}/hero.jpg`,
      `${S3}/service3.jpg`,
    ],
  },
  {
    index: '02',
    images: [
      `${S3}/service2.jpg`,
      `${S3}/service4.jpg`,
      `${S3}/service1.jpg`,
    ],
  },
  {
    index: '03',
    images: [
      `${S3}/service3.jpg`,
      `${S3}/service5.jpg`,
      `${S3}/service2.jpg`,
    ],
  },
  {
    index: '04',
    images: [
      `${S3}/service4.jpg`,
      `${S3}/service1.jpg`,
      `${S3}/service6.jpg`,
    ],
  },
  {
    index: '05',
    images: [
      `${S3}/manicura.jpg`,
      `${S3}/pedicura.jpg`,
      `${S3}/maquillaje.jpg`,
    ],
  },
  {
    index: '06',
    images: [
      `${S3}/service6.jpg`,
      `${S3}/service2.jpg`,
      `${S3}/service5.jpg`,
    ],
  },
]

type ServiceTranslation = {
  tab: string
  name: string
  description: string
  treatments: string[]
  price: string
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return SERVICE_SLUGS.map((slug) => ({ slug }))
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params
  const slugIndex = (SERVICE_SLUGS as readonly string[]).indexOf(slug)
  if (slugIndex === -1) notFound()

  const [locale, t] = await Promise.all([getLocale(), getTranslations('serviciosPage')])
  const servicesRaw = t.raw('services') as ServiceTranslation[]
  const service = servicesRaw[slugIndex]!
  const meta = SERVICE_META[slugIndex]!
  const seoRoute = locale === 'es' ? `/servicios/${slug}` : `/${locale}/servicios/${slug}`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: `${service.tab} — Que Bárbaro` }} />

      <div style={{ backgroundColor: '#F6F4F1' }}>
        <div className="flex flex-col md:flex-row w-full" style={{ minHeight: '90vh' }}>

          {/* Left: Carousel */}
          <div className="relative w-full md:w-1/2" style={{ minHeight: '50vh' }}>
            <ServiceCarousel images={meta.images} alt={service.tab} />
          </div>

          {/* Right: Info */}
          <div
            className="w-full md:w-1/2 flex flex-col justify-center"
            style={{
              backgroundColor: '#F6F4F1',
              padding: 'clamp(3rem, 6vw, 6rem) clamp(2.5rem, 6vw, 5rem)',
            }}
          >
            <p
              className="font-neue font-light uppercase tracking-[0.3em] mb-8"
              style={{ fontSize: '11px', color: '#e8632a' }}
            >
              — {t('serviceLabel')} {meta.index}
            </p>

            <h1
              className="font-neue font-light uppercase leading-[0.9] mb-8"
              style={{ fontSize: 'clamp(3rem, 5vw, 5rem)', color: '#1a1f3a', whiteSpace: 'pre-line' }}
            >
              {service.name}
            </h1>

            <div className="mb-8" style={{ height: '1px', backgroundColor: 'rgba(26,31,58,0.12)', width: '4rem' }} />

            <p
              className="font-neue font-light leading-relaxed mb-10"
              style={{ fontSize: '1rem', color: 'rgba(26,31,58,0.7)', maxWidth: '38ch' }}
            >
              {service.description}
            </p>

            <ul className="mb-10 space-y-3">
              {service.treatments.map((treatment) => (
                <li
                  key={treatment}
                  className="font-neue font-light flex items-center gap-3"
                  style={{ fontSize: '0.875rem', color: '#1a1f3a' }}
                >
                  <span style={{ color: '#e8632a', flexShrink: 0 }}>—</span>
                  {treatment}
                </li>
              ))}
            </ul>

            <div className="mb-10">
              <p
                className="font-neue font-light uppercase tracking-[0.2em] mb-1"
                style={{ fontSize: '10px', color: 'rgba(26,31,58,0.4)' }}
              >
                {t('priceNote')}
              </p>
              <p
                className="font-primary leading-none"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#1a1f3a' }}
              >
                {service.price}
              </p>
            </div>

            <div>
              <Link
                href="/reservar-cita"
                className="inline-flex items-center gap-4 font-neue font-light uppercase tracking-[0.25em] transition-all duration-300 hover:opacity-70"
                style={{ fontSize: '11px', color: '#ffffff', backgroundColor: '#1a1f3a', padding: '1.25rem 2.5rem' }}
              >
                {t('bookCta')}
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path d="M1 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
