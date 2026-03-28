import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export default async function HomeBrands() {
  const t = await getTranslations('homeBrands')

  const brands = [
    {
      index: '01',
      key: 'GOA',
      phrase: t('phrase1'),
      logo: { src: '/goa_organics.png', alt: 'GOA Organics', w: 260, h: 104, style: { filter: 'invert(1)', mixBlendMode: 'screen' as const } },
      animClass: 'brands-logo-a',
    },
    {
      index: '02',
      key: 'ORIBE',
      phrase: t('phrase2'),
      logo: { src: '/oribe.svg', alt: 'ORIBE', w: 148, h: 199, style: { filter: 'invert(1) brightness(0.95)' } },
      animClass: 'brands-logo-b',
    },
    {
      index: '03',
      key: 'ghd',
      phrase: t('phrase3'),
      logo: { src: '/ghd.svg', alt: 'ghd', w: 160, h: 96, style: {} },
      animClass: 'brands-logo-c',
    },
    {
      index: '04',
      key: 'DEPOT',
      phrase: t('phrase4'),
      logo: { src: '/depot.png', alt: 'DEPOT The Male Tools & Co.', w: 200, h: 74, style: { filter: 'invert(1)', mixBlendMode: 'screen' as const } },
      animClass: 'brands-logo-d',
    },
    {
      index: '05',
      key: 'SCHWARZKOPF',
      phrase: t('phrase5'),
      logo: { src: '/schwarzkopf.png', alt: 'Schwarzkopf Professional', w: 160, h: 120, style: { filter: 'invert(1)', mixBlendMode: 'screen' as const } },
      animClass: 'brands-logo-e',
    },
  ]

  return (
    <>
      <style>{`
        @keyframes brands-float-a { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-10px)} }
        @keyframes brands-float-b { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)} }
        @keyframes brands-float-c { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-9px)} }
        @keyframes brands-float-d { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-7px)} }
        @keyframes brands-float-e { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-11px)} }
        .brands-logo-a { animation: brands-float-a  8s ease-in-out infinite; }
        .brands-logo-b { animation: brands-float-b 10s ease-in-out infinite 1s; }
        .brands-logo-c { animation: brands-float-c  9s ease-in-out infinite 0.5s; }
        .brands-logo-d { animation: brands-float-d 11s ease-in-out infinite 1.5s; }
        .brands-logo-e { animation: brands-float-e  8s ease-in-out infinite 2s; }
      `}</style>

      <section className="relative bg-navy w-full overflow-hidden">

        {/* ── Background photo ────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <Image
            src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/inicio/cielo.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.38)' }} />
        </div>

        {/* ── Eyebrow label ───────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center gap-5 px-8 md:px-20 pt-20">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(246,244,241,0.3))' }} />
          <p className="font-neue text-[9px] uppercase tracking-[0.45em] text-cream/55 shrink-0">
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

        {/* ── Brand panels grid ───────────────────────────────────────── */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 border-t border-cream/[0.06]">
          {brands.map((brand, bi) => {
            const isLastInRowSm  = bi % 2 === 1
            const isLastInRowLg  = bi % 3 === 2
            const isLast         = bi === brands.length - 1

            return (
              <div
                key={brand.index}
                className={[
                  'relative overflow-hidden flex flex-col items-center gap-8 px-10 pt-16 pb-16',
                  /* mobile: bottom border except last */
                  bi < brands.length - 1 ? 'border-b border-cream/[0.06]' : '',
                  /* sm: right border on left column, reset bottom */
                  !isLastInRowSm ? 'sm:border-r sm:border-cream/[0.06]' : 'sm:border-r-0',
                  bi < brands.length - (brands.length % 2 || 2) ? 'sm:border-b sm:border-cream/[0.06]' : 'sm:border-b-0',
                  /* lg: 3 cols */
                  !isLastInRowLg && !isLast ? 'lg:border-r lg:border-cream/[0.06]' : 'lg:border-r-0',
                  bi < 3 ? 'lg:border-b lg:border-cream/[0.06]' : 'lg:border-b-0',
                  /* xl: 5 cols, no bottom borders */
                  !isLast ? 'xl:border-r xl:border-cream/[0.06]' : 'xl:border-r-0',
                  'xl:border-b-0',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {/* Watermark letter */}
                <span
                  className="absolute inset-0 flex items-end pb-2 pl-3 font-primary select-none pointer-events-none"
                  style={{ fontSize: 'clamp(4rem,10vw,9rem)', lineHeight: 1, color: 'rgba(246,244,241,0.027)', letterSpacing: '0.04em' }}
                  aria-hidden
                >
                  {brand.key}
                </span>

                {/* Logo */}
                <div
                  className={`${brand.animClass} relative`}
                  style={{ width: `${brand.logo.w}px`, maxWidth: '100%', height: `${brand.logo.h}px` }}
                >
                  <Image
                    src={brand.logo.src}
                    alt={brand.logo.alt}
                    fill
                    sizes={`${brand.logo.w}px`}
                    className="object-contain object-center"
                    style={brand.logo.style}
                  />
                </div>

                {/* Phrase */}
                <p className="font-neue uppercase text-[clamp(0.65rem,0.8vw,0.75rem)] text-cream/85 text-center tracking-[0.2em]">
                  {brand.phrase}
                </p>
              </div>
            )
          })}
        </div>

        {/* ── Thin orange rule ─────────────────────────────────────────── */}
        <div className="relative z-10 mx-8 md:mx-20 mt-14 mb-8 h-px bg-cream/30" />

      </section>
    </>
  )
}
