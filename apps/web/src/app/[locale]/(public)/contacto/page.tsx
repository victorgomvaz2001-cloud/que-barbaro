export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

const SOCIAL = [
  { name: 'Instagram', href: 'https://www.instagram.com/que.barbaro_estilistas/' },
  { name: 'TikTok',    href: 'https://www.tiktok.com/@que.barbaro_estilistas' },
]
const WHATSAPP_URL = 'https://wa.me/34644817835'

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
        <div className="mx-auto w-full max-w-6xl flex flex-col">
          {/* ── Cabecera + datos ───────────────────────────────────────────── */}
          <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-12 lg:gap-16 items-start mb-6 md:mb-8">
            <div>
              <p className="font-neue text-[10px] tracking-[0.3em] uppercase text-navy/45 mb-3">
                {t('eyebrow')}
              </p>
              <h1 className="font-primary text-[clamp(2.8rem,6vw,5.4rem)] uppercase leading-[0.95] text-navy mb-4">
                {t('title')}
              </h1>
              <p className="max-w-xl font-secondary text-lg md:text-xl leading-relaxed text-navy/75">
                {t('intro')}
              </p>
              <a
                href="/reservar-cita"
                className="inline-flex mt-6 md:mt-7 w-fit items-center gap-3 bg-navy text-cream font-neue text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-orange transition-colors duration-300"
              >
                {t('bookCta')}
                <span className="text-base leading-none">→</span>
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-8 sm:gap-10 text-left sm:text-center lg:text-left">
              {/* Dirección */}
              <div>
                <p className="font-neue text-[9px] tracking-[0.28em] uppercase text-navy/40 mb-2">
                  {t('address')}
                </p>
                <address className="not-italic">
                  <p className="font-secondary text-navy text-xl leading-relaxed">{tFoot('address')}</p>
                  <p className="font-secondary text-navy text-xl leading-relaxed">{tFoot('city')}</p>
                </address>
              </div>

              {/* Teléfonos */}
              <div>
                <p className="font-neue text-[9px] tracking-[0.28em] uppercase text-navy/40 mb-2">
                  {t('phone')}
                </p>
                <a href={WHATSAPP_URL} className="font-secondary text-navy text-xl block hover:text-orange transition-colors duration-200">
                  {tFoot('phone')}
                </a>
              </div>

              {/* Redes sociales */}
              <div>
                <p className="font-neue text-[9px] tracking-[0.28em] uppercase text-navy/40 mb-2">
                  {t('social')}
                </p>
                <div className="grid grid-cols-1 gap-y-1 sm:justify-items-center lg:justify-items-start">
                  {SOCIAL.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-secondary text-navy text-xl hover:text-orange transition-colors duration-200"
                    >
                      {s.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── Google Maps ────────────────────────────────────────────────── */}
          <div className="w-full max-w-[1680px] mt-10 md:mt-12">
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
