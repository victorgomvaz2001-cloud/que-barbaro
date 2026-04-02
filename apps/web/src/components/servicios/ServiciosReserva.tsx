import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const S3 = 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com'
const PACK_IMAGES = [
  `${S3}/servicios/packnovionovia.webp`,
  `${S3}/servicios/packdespedida.webp`,
  `${S3}/servicios/cumplean%CC%83os.webp`,
]

/* ─────────────────────────────────────────────────────────────────────────────
   ServiciosReserva
   Two sub-sections rendered in one server component:
     1. Eventos  (bg-cream, id="eventos")
     2. Reserva  (bg-navy, id="reservar")
───────────────────────────────────────────────────────────────────────────── */

export default async function ServiciosReserva() {
  const tE = await getTranslations('servicios.eventos')
  const tR = await getTranslations('servicios.reserva')

  const packs = tE.raw('packs') as { tag: string; title: string; description: string; detail: string }[]

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          SUB-SECTION 1 - EVENTOS
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="eventos"
        className="w-full bg-cream py-16 md:py-24"
        aria-labelledby="eventos-title"
      >
        <div className="max-w-[1680px] mx-auto px-8 md:px-16 lg:px-24">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <span
              className="block shrink-0 w-[5px] h-[5px] rounded-full bg-orange"
              aria-hidden="true"
            />
            <p
              className="font-neue text-orange uppercase tracking-widest"
              style={{ fontSize: '0.68rem', letterSpacing: '0.28em' }}
            >
              {tE('eyebrow')}
            </p>
          </div>

          {/* Title */}
          <h2
            id="eventos-title"
            className="font-primary text-navy uppercase leading-[0.88] tracking-[0.04em] mb-5"
            style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
          >
            {tE('title')}
          </h2>

          {/* Orange rule */}
          <div className="h-[2px] w-12 bg-orange mb-8" aria-hidden="true" />

          {/* Description */}
          <p
            className="font-secondary text-navy leading-[1.78] mb-12"
            style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)', maxWidth: '56ch' }}
          >
            {tE('description')}
          </p>

          {/* Pack cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            {packs.map((pack, i) => (
              <div
                key={pack.tag}
                className="relative border border-navy/10 bg-white flex flex-col group hover:border-orange transition-colors duration-300 overflow-hidden"
              >
                {/* Photo */}
                {PACK_IMAGES[i] && (
                  <div className="relative w-full aspect-[4/3] overflow-hidden shrink-0">
                    <Image
                      src={PACK_IMAGES[i]!}
                      alt={pack.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" aria-hidden />
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                {/* Tag */}
                <span
                  className="font-neue uppercase tracking-[0.22em] text-orange mb-4 inline-block"
                  style={{ fontSize: '10px' }}
                >
                  {pack.tag}
                </span>

                {/* Pack title */}
                <h3
                  className="font-primary text-navy uppercase leading-[0.9] tracking-[0.04em] mb-4"
                  style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)' }}
                >
                  {pack.title}
                </h3>

                {/* Orange rule */}
                <div
                  className="h-[2px] bg-orange mb-5 transition-all duration-300"
                  style={{ width: '32px' }}
                  aria-hidden="true"
                />

                {/* Description */}
                <p
                  className="font-secondary text-navy/65 leading-relaxed mb-6 flex-1"
                  style={{ fontSize: 'clamp(0.9rem, 1.1vw, 0.95rem)' }}
                >
                  {pack.description}
                </p>

                {/* Detail pill */}
                <div className="border-t border-navy/8 pt-5">
                  <p
                    className="font-neue uppercase tracking-[0.18em] text-navy/40"
                    style={{ fontSize: '9px' }}
                  >
                    {pack.detail}
                  </p>
                </div>
                </div>{/* end p-8 */}
              </div>
            ))}
          </div>

          {/* WhatsApp CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p
              className="font-neue uppercase tracking-[0.18em] text-navy/40"
              style={{ fontSize: '10px' }}
            >
              {tE('cta')}
            </p>
            <a
              href="https://wa.me/34644817835"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-orange text-cream font-neue uppercase tracking-[0.2em] px-10 py-4 hover:bg-navy transition-colors duration-300"
              style={{ fontSize: '11px' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {tE('whatsapp')}
            </a>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SUB-SECTION 2 - RESERVA CTA
      ══════════════════════════════════════════════════════════════════════ */}
      <section
        id="reservar"
        className="relative w-full bg-navy overflow-hidden py-32"
        aria-labelledby="reservar-title"
      >
        {/* ── Background image ──────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'url("https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/inicio/venusycupido.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.7,
            zIndex: 0,
          }}
        />

        {/* ── Black overlay ─────────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.35)',
            zIndex: 0,
          }}
        />

        {/* Ghost watermark - bottom-right, cream at 2.8% opacity */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute bottom-0 right-0 font-primary text-cream leading-none"
          style={{
            fontSize: 'clamp(10rem, 26vw, 26rem)',
            opacity: 0.028,
            transform: 'translate(8%, 18%)',
            lineHeight: 0.82,
            zIndex: 0,
          }}
        >
          {tR('title')}
        </div>

        {/* Inner container */}
        <div className="relative z-10 max-w-[1680px] mx-auto px-8 md:px-16 lg:px-24 flex flex-col items-center text-center">

          {/* Orange accent line */}
          <div
            className="bg-orange mb-10"
            style={{ width: '48px', height: '2px' }}
            aria-hidden="true"
          />

          {/* Eyebrow */}
          <p
            className="font-neue text-orange uppercase tracking-widest mb-6"
            style={{ fontSize: '0.68rem', letterSpacing: '0.28em' }}
          >
            {tR('eyebrow')}
          </p>

          {/* Large title */}
          <h2
            id="reservar-title"
            className="font-primary text-cream uppercase leading-[0.88] tracking-[0.04em] mb-8"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            {tR('title')}
          </h2>

          {/* Subtitle */}
          <p
            className="font-secondary text-cream leading-[1.75] mb-14"
            style={{ fontSize: 'clamp(1rem, 1.25vw, 1.1rem)', maxWidth: '50ch' }}
          >
            {tR('body')}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">

            {/* Primary - Reservar cita */}
            <Link
              href="https://wa.me/34644817835"
              className="group inline-flex items-center gap-3 bg-cream text-navy hover:bg-orange hover:text-cream transition-colors duration-300 font-neue uppercase tracking-widest px-12 py-4"
              style={{ fontSize: '11px', letterSpacing: '0.22em' }}
            >
              {tR('buttonPrimary')}
              {/* Arrow icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

            {/* Secondary - WhatsApp */}
            <a
              href="https://wa.me/34644817835"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 border border-cream text-cream hover:border-cream hover:bg-cream transition-colors duration-300 font-neue uppercase tracking-widest px-10 py-4"
              style={{ fontSize: '11px', letterSpacing: '0.22em' }}
            >
              {/* WhatsApp SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="shrink-0 opacity-75 group-hover:opacity-100 transition-opacity duration-300"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {tR('buttonWhatsapp')}
            </a>

          </div>
        </div>
      </section>
    </>
  )
}
