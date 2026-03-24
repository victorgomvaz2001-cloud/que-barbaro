import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const WHATSAPP_URL = 'https://wa.me/34644817835'
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.1833396093916!2d-4.5044647240500595!3d36.62197327772568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72fb8e014cea43%3A0x5f84b99436c67490!2swqFRdcOpIELDoXJiYXJvISBIYWlyICYgQ2FyZSBTYWxvbg!5e0!3m2!1ses!2ses!4v1773771044895!5m2!1ses!2ses'
const SOCIAL = [
  { name: 'Instagram', href: 'https://www.instagram.com/que.barbaro_estilistas/' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@que.barbaro_estilistas' },
]

export default async function HomeContact() {
  const [tFoot, tContact] = await Promise.all([
    getTranslations('footer'),
    getTranslations('contacto'),
  ])

  return (
    <section className="bg-cream w-full">

      {/* Map */}
      <div className="w-full h-[360px] md:h-[480px]">
        <iframe
          src={MAPS_EMBED}
          className="block w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={tContact('mapsTitle')}
        />
      </div>

      {/* Contact strip */}
      <div className="border-t border-navy/10 px-8 py-12">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Address */}
          <div>
            <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-3">
              {tContact('address')}
            </p>
            <address className="not-italic">
              <p className="font-neue font-light text-navy text-base leading-snug">{tFoot('address')}</p>
              <p className="font-neue font-light text-navy text-base leading-snug">{tFoot('city')}</p>
            </address>
          </div>

          {/* Phone */}
          <div>
            <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-3">
              {tContact('phone')}
            </p>
            <a
              href={WHATSAPP_URL}
              className="font-neue font-light text-navy text-base hover:text-navy/60 transition-colors duration-200"
            >
              {tFoot('phone')}
            </a>
          </div>

          {/* Social */}
          <div>
            <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-3">
              {tContact('social')}
            </p>
            <div className="flex flex-col gap-1">
              {SOCIAL.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-neue font-light text-navy text-base hover:text-navy/60 transition-colors duration-200"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:items-end lg:items-end justify-center">
            <Link
              href="/reservar-cita"
              className="inline-flex items-center gap-3 bg-navy text-cream font-neue text-[11px] uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-navy/80 transition-colors duration-200"
            >
              {tContact('bookCta')}
              <span>→</span>
            </Link>
            <Link
              href="/contacto"
              className="font-secondary text-[10px] uppercase tracking-[0.2em] text-navy/40 hover:text-navy transition-colors duration-200"
            >
              Ver más información →
            </Link>
          </div>

        </div>
      </div>

    </section>
  )
}
