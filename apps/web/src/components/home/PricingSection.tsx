import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

type PriceItem = { name: string; price: string; desc: string }

export default async function PricingSection() {
  const t = await getTranslations('pricing')
  const items = t.raw('items') as PriceItem[]

  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-6 md:px-10">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-14 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <p className="font-neue text-[11px] uppercase tracking-[0.22em] text-navy">
            {t('eyebrow')}
          </p>
          <h2 className="font-primary text-[clamp(2.6rem,7vw,5rem)] uppercase leading-none tracking-[0.04em] text-navy">
            {t('h2')}
          </h2>
        </div>

        {/* ── Service rows ───────────────────────────────────────────── */}
        <div className="border-t border-navy/10">
          {items.map((item) => (
            <div
              key={item.name}
              className="group -mx-3 flex flex-col gap-1 border-b border-navy/10 px-3 py-6 transition-colors duration-200 hover:bg-navy/[0.04] md:flex-row md:items-center md:gap-0 md:py-8"
            >
              <span className="font-primary text-[clamp(1.4rem,3vw,2rem)] uppercase leading-tight text-navy md:flex-1 tracking-[0.04em]">
                {item.name}
              </span>
              <span className="font-neue text-[clamp(1.3rem,2.5vw,1.8rem)] font-semibold text-orange md:w-48 md:text-right">
                {item.price}
              </span>
              <span className="font-neue text-[10px] uppercase tracking-[0.18em] text-navy md:w-52 md:text-right">
                {item.desc}
              </span>
            </div>
          ))}
        </div>

        {/* ── Footer note + CTA ──────────────────────────────────────── */}
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <p className="border-l-2 border-orange pl-4 font-secondary text-sm leading-relaxed text-navy md:max-w-sm">
            {t('note')}
          </p>
          <Link
            href="/servicios"
            className="font-neue text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:text-orange self-start md:self-auto"
          >
            {t('viewAll')}
          </Link>
        </div>

      </div>
    </section>
  )
}
