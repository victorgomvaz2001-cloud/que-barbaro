export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import SEOHead from '@/components/SEOHead'

const SOCIAL = [
  { name: 'Instagram', href: 'https://www.instagram.com/quebarbaro.es' },
  { name: 'Facebook',  href: 'https://www.facebook.com/quebarbaro' },
  { name: 'TikTok',    href: 'https://www.tiktok.com/@quebarbaro' },
  { name: 'YouTube',   href: 'https://www.youtube.com/@quebarbaro' },
]

export default async function ContactoPage() {
  const locale   = await getLocale()
  const tFoot    = await getTranslations('footer')
  const seoRoute = locale === 'es' ? '/contacto' : `/${locale}/contacto`

  return (
    <>
      <SEOHead route={seoRoute} fallback={{ title: 'Contacto - Que Bárbaro' }} />

      <div className="flex flex-col items-center px-8 py-20 gap-14">

        {/* ── Título ───────────────────────────────────────────────────────── */}
        <div className="text-center">
          <p className="font-neue text-[10px] tracking-[0.3em] uppercase text-navy/45 mb-3">
            Encuéntranos
          </p>
          <h1 className="font-primary text-[clamp(3rem,8vw,7rem)] uppercase leading-none text-navy mb-5">
            Contacto
          </h1>
          <div className="w-10 h-[2px] bg-orange mx-auto" />
        </div>

        {/* ── Info de contacto ─────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-8">

          {/* Tres columnas */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 text-center">

            {/* Dirección */}
            <div>
              <p className="font-neue text-[9px] tracking-[0.28em] uppercase text-navy/40 mb-2">
                Dirección
              </p>
              <address className="not-italic">
                <p className="font-secondary text-navy text-xl leading-relaxed">{tFoot('address')}</p>
                <p className="font-secondary text-navy text-xl leading-relaxed">{tFoot('city')}</p>
              </address>
            </div>

            {/* Teléfonos */}
            <div>
              <p className="font-neue text-[9px] tracking-[0.28em] uppercase text-navy/40 mb-2">
                Teléfono
              </p>
              <a href={`tel:${tFoot('phone')}`} className="font-secondary text-navy text-xl block hover:text-orange transition-colors duration-200">
                {tFoot('phone')}
              </a>
              <a href={`tel:${tFoot('phone2')}`} className="font-secondary text-navy text-xl block hover:text-orange transition-colors duration-200">
                {tFoot('phone2')}
              </a>
            </div>

            {/* Redes sociales */}
            <div>
              <p className="font-neue text-[9px] tracking-[0.28em] uppercase text-navy/40 mb-2">
                Redes sociales
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
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

          {/* CTA */}
          <a
            href="/reservar-cita"
            className="inline-flex items-center gap-3 bg-navy text-cream font-neue text-[11px] tracking-[0.2em] uppercase px-6 py-3.5 hover:bg-orange transition-colors duration-300"
          >
            Reservar cita
            <span className="text-base leading-none">→</span>
          </a>
        </div>

        {/* ── Google Maps ──────────────────────────────────────────────────── */}
        <div className="w-full max-w-3xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.1833396093916!2d-4.5044647240500595!3d36.62197327772568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72fb8e014cea43%3A0x5f84b99436c67490!2zwqFRdcOpIELDoXJiYXJvISBIYWlyICYgQ2FyZSBTYWxvbg!5e0!3m2!1ses!2ses!4v1773771044895!5m2!1ses!2ses"
            width="100%"
            height="480"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Que Bárbaro en Google Maps"
          />
        </div>

      </div>
    </>
  )
}
