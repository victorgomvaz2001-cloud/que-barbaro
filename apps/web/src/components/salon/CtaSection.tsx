import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

const WHATSAPP_HREF  = 'https://wa.me/34644817835'
const BOOKSY_HREF    = 'https://booksy.com/es-es/1235296_que-barbaro-hair-care-salon_salon-de-belleza_1147540_torremolinos'
const TREATWELL_HREF = 'https://www.treatwell.es/lugar/que-barbaro-hair-care-salon/'
const TEL_HREF       = 'tel:+34644817835'

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.557 4.117 1.532 5.845L.057 23.48a.5.5 0 0 0 .612.612l5.604-1.47A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.725 9.725 0 0 1-4.953-1.352l-.355-.21-3.677.964.98-3.595-.232-.369A9.712 9.712 0 0 1 2.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
  </svg>
)
const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
  </svg>
)
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-5 h-5">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.08 6.08l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

interface CtaSectionProps {
  backgroundImage?: string | null
}

export default async function CtaSection({ backgroundImage }: CtaSectionProps) {
  const t = await getTranslations('ctaSection')

  const channels = [
    { id: 'whatsapp',   href: WHATSAPP_HREF,  label: t('whatsappLabel'),   sublabel: t('whatsappSub'),   accentHover: 'hover:border-[#25D366]/50 hover:bg-[#25D366]/10', icon: <WhatsAppIcon /> },
    { id: 'booksy',     href: BOOKSY_HREF,    label: t('booksyLabel'),     sublabel: t('booksySub'),     accentHover: '', icon: <CalendarIcon /> },
    { id: 'treatwell',  href: TREATWELL_HREF, label: t('treatwellLabel'),  sublabel: t('treatwellSub'),  accentHover: '', icon: <CalendarIcon /> },
    { id: 'telefono',   href: TEL_HREF,       label: t('llamarLabel'),     sublabel: t('llamarSub'),     accentHover: '', icon: <PhoneIcon />, stickyHide: true },
  ]

  return (
    <>
      {/* ── Main section ─────────────────────────────────────────────── */}
      <section className="relative w-full bg-navy py-32 overflow-hidden">
        {backgroundImage && (
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <Image
              src={backgroundImage}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-center"
              style={{ opacity: 0.4 }}
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
        )}
        <div className="relative z-10 mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">

          {/* H2 + subtitle */}
          <div className="text-center mb-14">
            <h2
              className="font-primary uppercase text-cream leading-[0.92] tracking-[0.08em]"
              style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
            >
              {t('h2')}
            </h2>
            <p className="mt-5 font-neuetext-cream uppercase tracking-[0.2em] text-[11px]">
              {t('subtitle')}
            </p>
          </div>

          {/* Divider */}
          <hr className="border-0 border-t border-cream/10 mb-14" />

          {/* Booking channel cards - 2×2 mobile, 4-col desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {channels.map((channel) => (
              <a
                key={channel.id}
                href={channel.href}
                target={channel.href.startsWith('tel:') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className={[
                  'group border border-cream/20 px-3 py-5 sm:px-8 sm:py-6',
                  'flex flex-col items-center gap-2 text-center',
                  'transition-all duration-300 ease-out',
                  'hover:bg-cream/10 hover:border-cream/40',
                  channel.accentHover,
                ].join(' ')}
              >
                <span className="text-cream/50 group-hover:text-cream transition-colors duration-300">
                  {channel.icon}
                </span>
                <span className="font-primary uppercase text-cream text-[clamp(0.9rem,2.5vw,1.25rem)] tracking-wide leading-none font-bold">
                  {channel.label}
                </span>
                <span className="font-neue font-medium text-cream text-[11px] uppercase tracking-[0.2em] leading-none">
                  {channel.sublabel}
                </span>
              </a>
            ))}
          </div>

        </div>
      </section>

      {/* ── Mobile sticky bottom bar (sm:hidden) ─────────────────────── */}
      <div
        className="sm:hidden fixed bottom-0 left-0 w-screen max-w-full z-50 bg-navy/95 backdrop-blur-sm border-t border-cream/10 overflow-hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        aria-label={t('mobileBarAriaLabel')}
      >
        <div className="flex w-full">
          {channels.filter((c) => !('stickyHide' in c && c.stickyHide)).map((channel) => (
            <a
              key={`sticky-${channel.id}`}
              href={channel.href}
              target={channel.href.startsWith('tel:') ? '_self' : '_blank'}
              rel="noopener noreferrer"
              className={[
                'flex-1 flex flex-col items-center justify-center gap-1 py-3',
                'text-cream transition-colors duration-200 active:bg-cream/10',
                channel.id === 'whatsapp' ? 'hover:text-[#25D366]' : 'hover:text-cream',
              ].join(' ')}
              aria-label={`${channel.label} - ${channel.sublabel}`}
            >
              <span className="w-5 h-5 flex items-center justify-center">{channel.icon}</span>
              <span className="font-neue text-[9px] uppercase tracking-wide leading-none text-center w-full px-2 truncate">{channel.label}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
