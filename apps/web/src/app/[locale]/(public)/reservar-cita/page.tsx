export const dynamic = 'force-dynamic'

import { getLocale } from 'next-intl/server'
import Script from 'next/script'
import SEOHead from '@/components/SEOHead'
import TreatwellCard from '@/components/TreatwellCard'
import { getSectionBackgrounds } from '@/lib/getSectionBackgrounds'

const BOOKSY_URL =
  'https://booksy.com/es-es/144807_que-barbaro-hair-care-salon_peluqueria_29275_torremolinos'

const INSTAGRAM_URL = 'https://www.instagram.com/que.barbaro_estilistas/'
const INSTAGRAM_HANDLE = '@que.barbaro_estilistas'
const WHATSAPP_URL = 'https://wa.me/34644817835'
const TIKTOK_URL = 'https://www.tiktok.com/@que.barbaro_estilistas'

export default async function ReservarCitaPage() {
  const [locale, bg] = await Promise.all([
    getLocale(),
    getSectionBackgrounds('reservar-cita'),
  ])
  const seoRoute = locale === 'es' ? '/reservar-cita' : `/${locale}/reservar-cita`
  const backgroundImage = bg['hero'] ?? null

  return (
    <div className="relative min-h-screen">
      {backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center pointer-events-none"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-black/60 pointer-events-none" aria-hidden />
        </>
      )}
    <div className="relative z-10 mx-auto max-w-7xl px-8 py-16">
      <SEOHead route={seoRoute} fallback={{ title: 'Reservar Cita - ¡Qué Bárbaro!' }} />

      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-16">
        <h1 className="font-primary text-[clamp(3rem,10vw,6rem)] leading-[0.95] uppercase tracking-tight text-navy">
          Reservar Cita
        </h1>
        <p className="font-secondary text-[13px] uppercase tracking-[0.18em] text-navy/60">
          Salón de belleza · Torremolinos
        </p>
        <div className="w-12 h-px bg-navy/20 mt-2" />
      </div>

      {/* 5 booking / social channels
          Mobile/tablet: 2-2-1 | Desktop (lg): 3-2
          Single grid — 2 cols / 6 cols — no gray gaps at any breakpoint */}
      <div className="mx-auto max-w-2xl lg:max-w-3xl">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-px bg-navy/10">

        {/* ── WhatsApp — col-span-1 lg:col-span-2 ── */}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 lg:col-span-2 group relative flex flex-col items-center text-center gap-3 px-6 py-8 bg-cream transition-colors duration-300 hover:bg-navy"
        >
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-orange" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="34" height="34"
            fill="none"
            aria-hidden="true"
          >
            <path
              fill="currentColor"
              className="text-orange transition-colors duration-300 group-hover:text-cream"
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"
            />
            <path
              fill="currentColor"
              className="text-orange transition-colors duration-300 group-hover:text-cream"
              d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.523 5.855L.057 23.882a.5.5 0 0 0 .615.611l6.218-1.635A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.826 9.826 0 0 1-5.001-1.367l-.36-.214-3.716.977.992-3.622-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"
            />
          </svg>
          <div>
            <p className="font-primary text-[1.3rem] leading-none tracking-wide text-navy transition-colors duration-300 group-hover:text-cream mb-1">
              WhatsApp
            </p>
            <p className="font-neue text-[10px] tracking-[0.14em] uppercase text-navy/50 transition-colors duration-300 group-hover:text-cream">
              Mensaje directo
            </p>
          </div>
          <p className="font-secondary text-[12px] tracking-[0.08em] text-navy/70 transition-colors duration-300 group-hover:text-cream/80">
            +34 644 817 835
          </p>
          <span className="font-neue font-bold text-[9px] uppercase tracking-[0.2em] text-navy/40 transition-colors duration-300 group-hover:text-cream/50 border-b border-current pb-px">
            Escribir ahora →
          </span>
        </a>

        {/* ── Instagram — col-span-1 lg:col-span-2 ── */}
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 lg:col-span-2 group relative flex flex-col items-center text-center gap-3 px-6 py-8 bg-cream transition-colors duration-300 hover:bg-navy"
        >
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-orange" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34" height="34"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-orange transition-colors duration-300 group-hover:text-cream"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" />
          </svg>
          <div>
            <p className="font-primary text-[1.3rem] leading-none tracking-wide text-navy transition-colors duration-300 group-hover:text-cream mb-1">
              Instagram
            </p>
            <p className="font-neue text-[10px] tracking-[0.14em] uppercase text-navy/50 transition-colors duration-300 group-hover:text-cream">
              Perfil oficial
            </p>
          </div>
          <p className="font-secondary font-semibold text-[12px] tracking-[0.08em] text-navy/70 transition-colors duration-300 group-hover:text-cream/80">
            {INSTAGRAM_HANDLE}
          </p>
          <span className="font-neue font-bold text-[9px] uppercase tracking-[0.2em] text-navy/40 transition-colors duration-300 group-hover:text-cream/50 border-b border-current pb-px">
            Ver perfil →
          </span>
        </a>

        {/* ── TikTok — col-span-1 lg:col-span-2 ── */}
        <a
          href={TIKTOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 lg:col-span-2 group relative flex flex-col items-center text-center gap-3 px-6 py-8 bg-cream transition-colors duration-300 hover:bg-navy"
        >
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-orange" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34" height="34"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-orange transition-colors duration-300 group-hover:text-cream"
            aria-hidden="true"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
          </svg>
          <div>
            <p className="font-primary text-[1.3rem] leading-none tracking-wide text-navy transition-colors duration-300 group-hover:text-cream mb-1">
              TikTok
            </p>
            <p className="font-neue text-[10px] tracking-[0.14em] uppercase text-navy/50 transition-colors duration-300 group-hover:text-cream">
              Perfil oficial
            </p>
          </div>
          <p className="font-secondary font-semibold text-[12px] tracking-[0.08em] text-navy/70 transition-colors duration-300 group-hover:text-cream/80">
            @que.barbaro_estilistas
          </p>
          <span className="font-neue font-bold text-[9px] uppercase tracking-[0.2em] text-navy/40 transition-colors duration-300 group-hover:text-cream/50 border-b border-current pb-px">
            Ver perfil →
          </span>
        </a>

        {/* ── Treatwell — col-span-1 lg:col-span-3 ── */}
        <TreatwellCard className="col-span-1 lg:col-span-3" />

        {/* ── Booksy — col-span-2 lg:col-span-3 ── */}
        <a
          href={BOOKSY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 lg:col-span-3 group relative flex flex-col items-center text-center gap-3 px-6 py-8 bg-cream transition-colors duration-300 hover:bg-navy"
        >
          <span className="absolute top-0 left-0 right-0 h-[3px] bg-orange" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34" height="34"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange transition-colors duration-300 group-hover:text-cream"
              d="M24.158 14.829V27.5m0 0a5.671 5.671 0 1 1 5.67 5.67c-7.738 0-7.852-7.583-12.791-7.583c-4.25 0-4.537 3.273-4.537 3.273"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-orange transition-colors duration-300 group-hover:text-cream"
              d="M40.5 5.5h-33a2 2 0 0 0-2 2v33a2 2 0 0 0 2 2h33a2 2 0 0 0 2-2v-33a2 2 0 0 0-2-2"
            />
          </svg>
          <div>
            <p className="font-primary text-[1.3rem] leading-none tracking-wide text-navy transition-colors duration-300 group-hover:text-cream mb-1">
              Booksy
            </p>
            <p className="font-neue text-[10px] tracking-[0.14em] uppercase text-navy/50 transition-colors duration-300 group-hover:text-cream">
              Reserva online
            </p>
          </div>
          <p className="font-secondary text-[12px] tracking-[0.08em] text-navy/70 transition-colors duration-300 group-hover:text-cream/80">
            booksy.com
          </p>
          <span className="font-neue font-bold text-[9px] uppercase tracking-[0.2em] text-navy/40 transition-colors duration-300 group-hover:text-cream/50 border-b border-current pb-px">
            Reservar ahora →
          </span>
        </a>

      </div>
      </div>{/* end outer container */}

      {/* Treatwell scripts */}
      <link
        rel="stylesheet"
        href="https://widget.treatwell.es/common/venue-menu/css/widget-button.css"
        media="screen"
      />
      <Script
        src="https://widget.treatwell.es/common/venue-menu/javascript/widget-button.js?v1"
        strategy="afterInteractive"
      />
    </div>
    </div>
  )
}
