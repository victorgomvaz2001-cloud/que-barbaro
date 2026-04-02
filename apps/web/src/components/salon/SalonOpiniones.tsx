import { getTranslations } from 'next-intl/server'
import TestimonialsSection from './TestimonialsSection'

export default async function SalonOpiniones() {
  const t = await getTranslations('elSalon.opiniones')

  return (
    <section id="opiniones" className="relative w-full bg-cream">

      {/* ── Section header ─────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-8 md:px-16 lg:px-24 pt-20 pb-0">

        {/* Eyebrow */}
        <div className="flex items-center gap-2.5 mb-5">
          <span
            className="block shrink-0 w-1.5 h-1.5 rounded-full bg-orange"
            aria-hidden="true"
          />
          <p className="font-neue text-orange uppercase tracking-widest"
             style={{ fontSize: 'clamp(0.6rem, 0.85vw, 0.7rem)' }}>
            {t('eyebrow')}
          </p>
        </div>

        {/* Display title */}
        <h2
          className="font-primary uppercase text-navy leading-[0.88] tracking-[0.04em]"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 7.5rem)' }}
        >
          {t('title')}
        </h2>

      </div>

      {/* ── Reviews content ─────────────────────────────────────────────── */}
      <TestimonialsSection />

    </section>
  )
}
