import Image from 'next/image'
import { getLocale, getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import SEOHead from '@/components/SEOHead'

const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'

const IMAGES = [
  `${S3}/manicura.jpg`,
  `${S3}/pedicura.jpg`,
  `${S3}/maquillaje.jpg`,
]

type Treatment = { name: string; description: string }
type ServiceData = {
  index: string
  tab: string
  name: string
  description: string
  treatments: Treatment[]
}

export default async function MaquillajePage() {
  const [locale, t] = await Promise.all([getLocale(), getTranslations('serviciosPage')])
  const service = t.raw('maquillaje') as ServiceData
  const seoRoute = locale === 'es' ? '/servicios/maquillaje' : `/${locale}/servicios/maquillaje`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: `${service.tab} — Que Bárbaro` }} />

      {/* ── Banner ─────────────────────────────────────────────────── */}
      <section
        className="relative flex items-end"
        style={{ minHeight: '70vh', backgroundColor: '#1a1f3a' }}
      >
        <Image
          src={IMAGES[0]!}
          alt={service.tab}
          fill
          priority
          className="object-cover object-center"
          style={{ opacity: 0.4 }}
        />
        <div className="relative z-10 w-full max-w-[1680px] mx-auto px-6 md:px-12 pb-16 md:pb-24">
          <p
            className="font-neue font-light uppercase tracking-[0.3em] mb-6"
            style={{ fontSize: '11px', color: '#e8632a' }}
          >
            — {t('serviceLabel')} {service.index}
          </p>
          <h1
            className="font-primary uppercase leading-[0.9]"
            style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)', color: '#F6F4F1', whiteSpace: 'pre-line' }}
          >
            {service.name}
          </h1>
          <div className="mt-8" style={{ height: '1px', backgroundColor: 'rgba(246,244,241,0.2)', width: '5rem' }} />
          <p
            className="font-neue font-light leading-relaxed mt-6"
            style={{ fontSize: '1rem', color: 'rgba(246,244,241,0.65)', maxWidth: '52ch' }}
          >
            {service.description}
          </p>
        </div>
      </section>

      {/* ── Sub-service sections ────────────────────────────────────── */}
      <div style={{ backgroundColor: '#F6F4F1' }}>
        {service.treatments.map((treatment, i) => {
          const isEven = i % 2 === 0
          return (
            <section
              key={treatment.name}
              className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              style={{ borderBottom: '1px solid rgba(26,31,58,0.08)' }}
            >
              <div className="relative w-full md:w-1/2" style={{ minHeight: '55vw', maxHeight: '80vh' }}>
                <Image
                  src={IMAGES[i % IMAGES.length]!}
                  alt={treatment.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div
                className="w-full md:w-1/2 flex flex-col justify-center"
                style={{ padding: 'clamp(3rem, 6vw, 6rem) clamp(2.5rem, 6vw, 5rem)' }}
              >
                <p
                  className="font-neue font-light uppercase tracking-[0.3em] mb-6"
                  style={{ fontSize: '10px', color: '#e8632a' }}
                >
                  — {String(i + 1).padStart(2, '0')}
                </p>
                <h2
                  className="font-neue font-light uppercase leading-[0.95] mb-8"
                  style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: '#1a1f3a' }}
                >
                  {treatment.name}
                </h2>
                <div className="mb-8" style={{ height: '1px', backgroundColor: 'rgba(26,31,58,0.12)', width: '4rem' }} />
                <p
                  className="font-neue font-light leading-relaxed mb-10"
                  style={{ fontSize: '1rem', color: 'rgba(26,31,58,0.65)', maxWidth: '40ch' }}
                >
                  {treatment.description}
                </p>
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
            </section>
          )
        })}
      </div>
    </>
  )
}
