export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

const SOCIAL = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/que.barbaro_estilistas/',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  },
  {
    name: 'TikTok',
    href: 'https://www.tiktok.com/@que.barbaro_estilistas',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
      </svg>
    ),
  },
]
const WHATSAPP_URL = 'https://wa.me/34644817835'

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
)

export default async function ContactoPage() {
  const [locale, tFoot, t] = await Promise.all([
    getLocale(),
    getTranslations('footer'),
    getTranslations('contacto'),
  ])
  const seoRoute = locale === 'es' ? '/contacto' : `/${locale}/contacto`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Contacto - Que Bárbaro' }} />

      <div className="w-full px-6 md:px-10 py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl flex flex-col gap-16 md:gap-20">

          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section>
            <h1 className="font-primary text-[clamp(2.4rem,5.5vw,5rem)] uppercase leading-[0.95] text-navy mb-6 max-w-3xl">
              {t('title')}
            </h1>
            <p className="max-w-2xl font-secondary text-lg md:text-xl leading-relaxed text-navy/75">
              {t('intro')}
            </p>
          </section>

          {/* ── Secciones de información ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-14">

            {/* Dónde estamos */}
            <section>
              <h2 className="font-primary text-[clamp(1.6rem,3vw,2.4rem)] uppercase leading-[0.95] text-navy mb-3">
                {t('whereTitle')}
              </h2>
              <p className="font-secondary text-base leading-relaxed text-navy/70 mb-5">
                {t('whereText')}
              </p>
              <address className="not-italic">
                <p className="font-secondary text-navy text-lg leading-relaxed">{tFoot('address')}</p>
                <p className="font-secondary text-navy text-lg leading-relaxed">{tFoot('city')}</p>
              </address>
            </section>

            {/* Horarios */}
            <section>
              <h2 className="font-primary text-[clamp(1.6rem,3vw,2.4rem)] uppercase leading-[0.95] text-navy mb-3">
                {t('hoursTitle')}
              </h2>
              <p className="font-secondary text-base leading-relaxed text-navy/70 mb-5">
                {t('hoursText')}
              </p>
              <div className="mb-5">
                {(t.raw('schedule') as { days: string; hours: string }[]).map(({ days, hours }) => (
                  <div
                    key={days}
                    className="flex items-baseline justify-between gap-4 border-b border-navy/8 py-3 first:border-t"
                  >
                    <span className="font-neue font-light text-sm text-navy/60 uppercase tracking-[0.12em]">{days}</span>
                    <span className="font-neue text-sm text-navy tabular-nums shrink-0">{hours}</span>
                  </div>
                ))}
              </div>
              <p className="font-neue font-light text-xs uppercase tracking-[0.18em] text-orange mb-6">
                {t('hoursNote')}
              </p>
              <a
                href="/reservar-cita"
                className="inline-flex items-center gap-3 bg-navy text-cream font-neue text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-orange transition-colors duration-300"
              >
                {t('bookCta')}
                <span className="text-base leading-none">→</span>
              </a>
            </section>

            {/* Teléfono y WhatsApp */}
            <section>
              <h2 className="font-primary text-[clamp(1.6rem,3vw,2.4rem)] uppercase leading-[0.95] text-navy mb-3">
                {t('phoneTitle')}
              </h2>
              <p className="font-secondary text-base leading-relaxed text-navy/70 mb-5">
                {t('phoneText')}
              </p>
              <a
                href={WHATSAPP_URL}
                className="inline-flex items-center gap-2.5 font-secondary text-navy text-lg hover:text-orange transition-colors duration-200"
              >
                <WhatsAppIcon />
                {tFoot('phone')}
              </a>
            </section>

            {/* Síguenos */}
            <section>
              <h2 className="font-primary text-[clamp(1.6rem,3vw,2.4rem)] uppercase leading-[0.95] text-navy mb-3">
                {t('followTitle')}
              </h2>
              <p className="font-secondary text-base leading-relaxed text-navy/70 mb-5">
                {t('followText')}
              </p>
              <div className="flex flex-col gap-2">
                {SOCIAL.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 font-secondary text-navy text-lg hover:text-orange transition-colors duration-200"
                  >
                    {s.icon}
                    {s.name}
                  </a>
                ))}
              </div>
            </section>
          </div>

          {/* ── Google Maps ────────────────────────────────────────────────────── */}
          <div className="w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.1833396093916!2d-4.5044647240500595!3d36.62197327772568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72fb8e014cea43%3A0x5f84b99436c67490!2zwqFRdcOpIELDoXJiYXJvISBIYWlyICYgQ2FyZSBTYWxvbg!5e0!3m2!1ses!2ses!4v1773771044895!5m2!1ses!2ses"
              className="block w-full h-[420px] md:h-[560px] lg:h-[660px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={t('mapsTitle')}
            />
          </div>

        </div>
      </div>
    </>
  )
}
