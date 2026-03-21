import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

export default async function ValueProposition() {
  const t = await getTranslations('valueProposition')

  return (
    <section className="bg-cream w-full pt-10 pb-28 px-6">
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center gap-10">

        {/* ── Headline ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-0">
          <h2 className="font-primary text-[clamp(2.8rem,7vw,6.5rem)] leading-[1] tracking-[0.05em] text-navy uppercase whitespace-pre-line">
            {t('headline')}
          </h2>
          <p className="font-neue font-light text-[clamp(1rem,2.2vw,1.8rem)] leading-snug text-navy mt-3">
            {t('subheadline')}
          </p>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <p className="font-secondary text-[clamp(0.85rem,1.3vw,1rem)] leading-relaxed tracking-wide text-navy/60 max-w-2xl">
          {t('body')}
        </p>

        {/* ── CTAs ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-10">
          <Link
            href="/el-salon"
            className="font-secondary text-[11px] uppercase tracking-[0.2em] text-navy/60 underline underline-offset-4 decoration-1 hover:text-navy transition-colors duration-150"
          >
            {t('ctaSalon')}
          </Link>
          <Link
            href="/reservar-cita"
            className="font-secondary text-[11px] uppercase tracking-[0.2em] text-navy/60 underline underline-offset-4 decoration-1 hover:text-navy transition-colors duration-150"
          >
            {t('ctaBook')}
          </Link>
        </div>

      </div>
    </section>
  )
}
