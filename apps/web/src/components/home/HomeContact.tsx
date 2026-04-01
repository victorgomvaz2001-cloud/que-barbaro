import { getTranslations } from 'next-intl/server'

const WHATSAPP_URL = 'https://wa.me/34644817835'
const MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.1833396093916!2d-4.5044647240500595!3d36.62197327772568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd72fb8e014cea43%3A0x5f84b99436c67490!2swqFRdcOpIELDoXJiYXJvISBIYWlyICYgQ2FyZSBTYWxvbg!5e0!3m2!1ses!2ses!4v1773771044895!5m2!1ses!2ses'

const SOCIAL = [
  { name: 'Instagram', href: 'https://www.instagram.com/que.barbaro_estilistas/' },
  { name: 'TikTok', href: 'https://www.tiktok.com/@que.barbaro_estilistas' },
]

type HourEntry = { days: string; hours: string }

export default async function HomeContact() {
  const t = await getTranslations('homeContact')
  const hoursList = t.raw('hours') as HourEntry[]

  return (
    <section className="bg-cream w-full">

      {/* Full-width map */}
      <div className="w-full h-[400px] md:h-[500px]">
        <iframe
          src={MAPS_EMBED}
          className="block w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={t('mapTitle')}
        />
      </div>

      {/* Info strip */}
      <div className="border-t border-navy/10 px-8 py-14">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* NAP - Name, Address, Phone (local SEO) */}
          <div>
            <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-3">
              {t('sectionLabel')}
            </p>
            <p className="font-neue font-medium text-navy text-base leading-snug mb-3">
              {t('businessName')}
            </p>
            <address className="not-italic">
              <p className="font-neue text-navy text-base leading-snug">{t('address1')}</p>
              <p className="font-neue text-navy text-base leading-snug">{t('address2')}</p>
            </address>
          </div>

          {/* Opening hours */}
          <div>
            <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-3">
              {t('hoursLabel')}
            </p>
            <dl className="flex flex-col gap-1.5">
              {hoursList.map(({ days, hours }) => (
                <div key={days} className="flex flex-col">
                  <dt className="font-neue text-navy/50 text-[11px] uppercase tracking-[0.12em]">{days}</dt>
                  <dd className="font-neue text-navy text-base leading-snug">
                    <time>{hours}</time>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Phone + Social */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-3">
                {t('phoneLabel')}
              </p>
              <a href="tel:+34644817835" className="font-neue text-navy text-base hover:text-navy/60 transition-colors duration-200">
                +34 644 817 835
              </a>
            </div>
            <div>
              <p className="font-secondary text-[9px] uppercase tracking-[0.28em] text-navy/35 mb-3">
                {t('socialLabel')}
              </p>
              <div className="flex flex-col gap-1">
                {SOCIAL.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="font-neue text-navy text-base hover:text-navy/60 transition-colors duration-200">
                    {s.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="flex items-center sm:justify-end lg:justify-end">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-navy text-cream font-neue text-[11px] uppercase tracking-[0.2em] px-6 py-3.5 hover:bg-navy/80 transition-colors duration-200"
            >
              {t('whatsappCta')}
              <span aria-hidden="true">→</span>
            </a>
          </div>

        </div>
      </div>

    </section>
  )
}
