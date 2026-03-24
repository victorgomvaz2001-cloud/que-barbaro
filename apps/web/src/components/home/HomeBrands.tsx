import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

const BRANDS = [
  { name: 'GOA Organics', desc: 'Tratamientos capilares orgánicos de alta gama' },
  { name: 'Keratin Infusion', desc: 'Alisado y nutrición profunda' },
  { name: 'Softy Mood', desc: 'Suavidad y fuerza desde la raíz' },
  { name: 'Sublime 10.31', desc: 'Ritual de brillo extremo' },
  { name: 'Bae Berry', desc: 'Hidratación y color vivo' },
]

export default async function HomeBrands() {
  const t = await getTranslations('homeBrands')

  return (
    <section className="bg-navy w-full py-20 px-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 border-b border-cream/10 pb-10">
          <div>
            <p className="font-secondary text-[10px] uppercase tracking-[0.3em] text-cream/30 mb-4">
              {t('label')}
            </p>
            <h2 className="font-primary text-[clamp(2rem,5vw,4rem)] leading-[1] tracking-tight text-cream uppercase whitespace-pre-line">
              {t('title')}
            </h2>
          </div>
          <p className="font-neue font-light text-[clamp(0.85rem,1.1vw,0.95rem)] leading-relaxed text-cream/50 max-w-sm md:text-right">
            {t('text')}
          </p>
        </div>

        {/* Brand list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-cream/10">
          {BRANDS.map((brand) => (
            <div key={brand.name} className="bg-navy px-6 py-8 flex flex-col gap-3 group">
              <span className="font-primary text-[clamp(1rem,1.5vw,1.3rem)] leading-tight text-cream uppercase tracking-wide">
                {brand.name}
              </span>
              <span className="font-neue font-light text-[11px] uppercase tracking-[0.18em] text-cream/35 leading-snug">
                {brand.desc}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-end">
          <Link
            href="/marcas"
            className="font-secondary text-[10px] uppercase tracking-[0.25em] text-cream/40 hover:text-cream transition-colors duration-200"
          >
            {t('viewAll')}
          </Link>
        </div>

      </div>
    </section>
  )
}
