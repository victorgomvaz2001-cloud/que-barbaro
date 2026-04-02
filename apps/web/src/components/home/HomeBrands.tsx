import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

interface HomeBrandsProps {
  backgroundImage?: string | null
}

export default async function HomeBrands({ backgroundImage }: HomeBrandsProps) {
  const t = await getTranslations('homeBrands')

  const row1 = [
    {
      index: '02',
      key: 'ORIBE',
      phrase: t('phrase2'),
      logo: { src: '/oribe.svg', alt: 'ORIBE', w: 148, h: 199, style: { filter: 'invert(1) brightness(0.95)' } },
    },
    {
      index: '01',
      key: 'GOA',
      phrase: t('phrase1'),
      logo: { src: '/goa_organics.png', alt: 'GOA Organics', w: 260, h: 104, style: { filter: 'invert(1)', mixBlendMode: 'screen' as const } },
    },
    {
      index: '05',
      key: 'SCHWARZKOPF',
      phrase: t('phrase5'),
      logo: { src: '/schwarzkopf.png', alt: 'Schwarzkopf Professional', w: 160, h: 120, style: { filter: 'invert(1)', mixBlendMode: 'screen' as const } },
    },
  ]
  const row1LogoAreaH = 210

  const row2 = [
    {
      index: '03',
      key: 'ghd',
      phrase: t('phrase3'),
      logo: { src: '/ghd.svg', alt: 'ghd', w: 160, h: 96, style: {} },
    },
    {
      index: '04',
      key: 'DEPOT',
      phrase: t('phrase4'),
      logo: { src: '/depot.png', alt: 'DEPOT The Male Tools & Co.', w: 200, h: 74, style: { filter: 'invert(1)', mixBlendMode: 'screen' as const } },
    },
    {
      index: '06',
      key: 'OPI',
      phrase: t('phrase6'),
      logo: { src: '/opi.svg', alt: 'OPI', w: 120, h: 120, style: { filter: 'invert(1)', mixBlendMode: 'screen' as const } },
    },
    {
      index: '07',
      key: "L'OCCITANE",
      phrase: t('phrase7'),
      logo: { src: '/loccitane.svg', alt: "L'Occitane en Provence", w: 240, h: 52, style: { filter: 'brightness(0) invert(1)' } },
    },
  ]
  const row2LogoAreaH = 140

  const cellBase = 'relative overflow-hidden flex flex-col items-center gap-8 px-10 pt-16 pb-16'

  return (
    <section className="relative bg-navy w-full overflow-hidden">

      {/* ── Background photo ────────────────────────────────────────── */}
      {backgroundImage && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <Image
            src={backgroundImage}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />
        </div>
      )}

      {/* ── Eyebrow label ───────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center gap-5 px-8 md:px-20 pt-20">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(246,244,241,0.3))' }} />
        <p className="font-neue text-[9px] uppercase tracking-[0.45em] text-cream shrink-0">
          {t('eyebrow')}
        </p>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(246,244,241,0.3))' }} />
      </div>

      {/* ── H2 ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex justify-center px-8 mt-10 mb-14">
        <h2 className="font-primary text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.05] tracking-[0.04em] text-cream uppercase text-center">
          {t('h2')}
        </h2>
      </div>

      {/* ── Row 1: 3 brands (ORIBE · GOA · SCHWARZKOPF) ────────────── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 border-t border-b border-cream/[0.06]">
        {row1.map((brand, bi) => (
          <div
            key={brand.index}
            className={[
              cellBase,
              bi < row1.length - 1 ? 'border-b border-cream/[0.06] sm:border-b-0 sm:border-r sm:border-cream/[0.06]' : '',
            ].filter(Boolean).join(' ')}
          >
            <span
              className="absolute inset-0 flex items-end pb-2 pl-3 font-primary select-none pointer-events-none"
              style={{ fontSize: 'clamp(4rem,10vw,9rem)', lineHeight: 1, color: 'rgba(246,244,241,0.027)', letterSpacing: '0.04em' }}
              aria-hidden
            >
              {brand.key}
            </span>
            <div className="flex items-center justify-center" style={{ height: `${row1LogoAreaH}px` }}>
              <div className="relative" style={{ width: `${brand.logo.w}px`, maxWidth: '100%', height: `${brand.logo.h}px` }}>
                <Image
                  src={brand.logo.src}
                  alt={brand.logo.alt}
                  fill
                  sizes={`${brand.logo.w}px`}
                  className="object-contain object-center"
                  style={brand.logo.style}
                />
              </div>
            </div>
            <p className="font-neue uppercase text-[clamp(0.65rem,0.8vw,0.75rem)] text-cream/85 text-center tracking-[0.2em]">
              {brand.phrase}
            </p>
          </div>
        ))}
      </div>

      {/* ── Row 2: 4 brands (ghd · DEPOT · OPI · L'OCCITANE) ───────── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {row2.map((brand, bi) => (
          <div
            key={brand.index}
            className={[
              cellBase,
              'border-b border-cream/[0.06]',
              bi < row2.length - 1 ? 'sm:border-r sm:border-cream/[0.06]' : 'sm:border-r-0',
              bi < 2 ? 'sm:border-b sm:border-cream/[0.06]' : 'sm:border-b-0',
              bi < row2.length - 1 ? 'lg:border-r lg:border-cream/[0.06]' : 'lg:border-r-0',
              'lg:border-b lg:border-cream/[0.06]',
            ].filter(Boolean).join(' ')}
          >
            <span
              className="absolute inset-0 flex items-end pb-2 pl-3 font-primary select-none pointer-events-none"
              style={{ fontSize: 'clamp(4rem,10vw,9rem)', lineHeight: 1, color: 'rgba(246,244,241,0.027)', letterSpacing: '0.04em' }}
              aria-hidden
            >
              {brand.key}
            </span>
            <div className="flex items-center justify-center" style={{ height: `${row2LogoAreaH}px` }}>
              <div className="relative" style={{ width: `${brand.logo.w}px`, maxWidth: '100%', height: `${brand.logo.h}px` }}>
                <Image
                  src={brand.logo.src}
                  alt={brand.logo.alt}
                  fill
                  sizes={`${brand.logo.w}px`}
                  className="object-contain object-center"
                  style={brand.logo.style}
                />
              </div>
            </div>
            <p className="font-neue uppercase text-[clamp(0.65rem,0.8vw,0.75rem)] text-cream text-center tracking-[0.2em]">
              {brand.phrase}
            </p>
          </div>
        ))}
      </div>

      {/* ── Thin rule ────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-8 md:mx-20 mt-14 mb-8 h-px bg-cream/30" />

    </section>
  )
}
