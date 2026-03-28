import { getTranslations } from 'next-intl/server'

const VALUE_PROPOSITION_BG =
  'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/inicio/backgroundhome.jpg'

export default async function ValueProposition() {
  const t = await getTranslations('valueProposition')

  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${VALUE_PROPOSITION_BG})` }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div className="relative z-10 mx-auto max-w-6xl px-8 py-24 md:py-32">

        {/* ── Top row: H2 left + body right ─────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-20">

          <h2
            className="flex-1 font-primary text-[clamp(2.8rem,6vw,5rem)] leading-[1] tracking-[0.04em] text-cream uppercase"
            style={{ whiteSpace: 'pre-line' }}
          >
            {t('h2')}
          </h2>

          <p className="flex-1 font-secondary text-[clamp(1rem,1.4vw,1.175rem)] leading-[1.75] text-cream/70 md:pb-2">
            {t('body')}
          </p>

        </div>

        {/* ── Orange rule ───────────────────────────────────────────────── */}
        <div className="mt-14 mb-14 h-px w-12 bg-orange" />

        {/* ── 3-column pillar block ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 divide-y-2 sm:divide-y-0 sm:divide-x-2 divide-white/55">

          {/* Column 1: Diagnóstico */}
          <div className="flex flex-col gap-6 px-0 sm:pr-10 pb-10 sm:pb-0">
            <span className="font-secondary text-[0.7rem] tracking-[0.22em] uppercase text-orange">
              {t('n1')}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-cream" aria-hidden="true">
              <circle cx="17" cy="17" r="10" />
              <line x1="24.5" y1="24.5" x2="34" y2="34" />
            </svg>
            <h3 className="font-primary text-[clamp(1.5rem,2.5vw,2rem)] leading-[1] tracking-[0.05em] text-cream uppercase">
              {t('title1')}
            </h3>
            <p className="font-neue font-light text-[0.8rem] leading-[1.6] tracking-wide text-cream/60 uppercase">
              {t('desc1')}
            </p>
          </div>

          {/* Column 2: Técnica */}
          <div className="flex flex-col gap-6 px-0 sm:px-10 py-10 sm:py-0">
            <span className="font-secondary text-[0.7rem] tracking-[0.22em] uppercase text-orange">
              {t('n2')}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-cream" aria-hidden="true">
              <circle cx="10" cy="10" r="4" />
              <circle cx="10" cy="30" r="4" />
              <line x1="13.5" y1="12.5" x2="34" y2="34" />
              <line x1="13.5" y1="27.5" x2="34" y2="6" />
            </svg>
            <h3 className="font-primary text-[clamp(1.5rem,2.5vw,2rem)] leading-[1] tracking-[0.05em] text-cream uppercase">
              {t('title2')}
            </h3>
            <p className="font-neue font-light text-[0.8rem] leading-[1.6] tracking-wide text-cream/60 uppercase">
              {t('desc2')}
            </p>
          </div>

          {/* Column 3: Resultado */}
          <div className="flex flex-col gap-6 px-0 sm:pl-10 pt-10 sm:pt-0">
            <span className="font-secondary text-[0.7rem] tracking-[0.22em] uppercase text-orange">
              {t('n3')}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9 text-cream" aria-hidden="true">
              <path d="M20 4 L22.5 17.5 L36 20 L22.5 22.5 L20 36 L17.5 22.5 L4 20 L17.5 17.5 Z" />
            </svg>
            <h3 className="font-primary text-[clamp(1.5rem,2.5vw,2rem)] leading-[1] tracking-[0.05em] text-cream uppercase">
              {t('title3')}
            </h3>
            <p className="font-neue font-light text-[0.8rem] leading-[1.6] tracking-wide text-cream/60 uppercase">
              {t('desc3')}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
