import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

/*
  Desktop mosaic layout — 4 columns × 3 rows, placement explícito:

       Col 1      Col 2      Col 3      Col 4
  Row1 [Card1     Card1    ] [Card2   ] [Card3   ]
  Row2 [Card4   ] [Card5   ] [Card2   ] [Card6   ]
  Row3 [Card4   ] [Card7     Card7   ] [Card6   ]

  Sin huecos · bordes alineados · tamaños variados
*/

const SERVICES: {
  key: string
  href: string
  bg: string
  gc: string   // gridColumn (desktop)
  gr: string   // gridRow    (desktop)
}[] = [
  { key: 'service1', href: '/servicios/cortes',     bg: 'bg-navy',      gc: '1 / 3', gr: '1 / 2' }, // wide
  { key: 'service2', href: '/servicios/rubios',     bg: 'bg-[#2C1810]', gc: '3 / 4', gr: '1 / 3' }, // tall
  { key: 'service3', href: '/servicios/goa',        bg: 'bg-[#1a3a2a]', gc: '4 / 5', gr: '1 / 2' }, // square
  { key: 'service4', href: '/servicios/peinados',   bg: 'bg-[#2a1a3a]', gc: '1 / 2', gr: '2 / 4' }, // tall
  { key: 'service5', href: '/servicios/maquillaje', bg: 'bg-[#3a2a1a]', gc: '2 / 3', gr: '2 / 3' }, // square
  { key: 'service6', href: '/servicios#barberia',   bg: 'bg-[#0a1245]', gc: '4 / 5', gr: '2 / 4' }, // tall
  { key: 'service7', href: '/servicios#manicura',   bg: 'bg-[#1a2a1a]', gc: '2 / 4', gr: '3 / 4' }, // wide
]

export default async function FeaturedServices() {
  const t = await getTranslations('featuredServices')

  return (
    <section className="bg-cream w-full px-6 pb-24">
      <div className="mx-auto max-w-[1680px]">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between pt-16 pb-8 gap-3 md:gap-6">
          <h2 className="font-primary text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[0.04em] text-navy uppercase">
            {t('h2')}
          </h2>
          <Link
            href="/servicios"
            className="group flex items-center gap-2 font-neue text-[12px] uppercase tracking-[0.18em] text-navy pb-1 border-b border-navy/30 transition-all duration-200 hover:border-orange hover:text-orange whitespace-nowrap self-start md:self-auto"
          >
            {t('viewAll')}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* ── Mobile grid: 2 columnas, Card7 full-width ──────────────── */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {SERVICES.map((s, i) => (
            <Link
              key={s.key}
              href={s.href}
              className={[
                'group relative overflow-hidden',
                s.bg,
                i === 6 ? 'col-span-2 aspect-[5/2]' : 'aspect-[3/4]',
              ].join(' ')}
            >
              <CardInner number={String(i + 1).padStart(2, '0')} name={t(s.key as any)} />
            </Link>
          ))}
        </div>

        {/* ── Desktop grid: placement explícito, sin huecos ──────────── */}
        <div
          className="hidden md:grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridTemplateRows: `repeat(3, clamp(150px, 20vw, 320px))`,
          }}
        >
          {SERVICES.map((s, i) => (
            <Link
              key={s.key}
              href={s.href}
              className={['group relative overflow-hidden', s.bg].join(' ')}
              style={{ gridColumn: s.gc, gridRow: s.gr }}
            >
              <CardInner number={String(i + 1).padStart(2, '0')} name={t(s.key as any)} />
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ── Card interior ──────────────────────────────────────────────────────── */

function CardInner({ number, name }: { number: string; name: string }) {
  return (
    <>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25 z-10" />

      {/* Ghost number */}
      <span className="absolute top-4 left-5 font-secondary text-[clamp(2.5rem,6vw,5rem)] leading-none text-white/10 select-none z-20 pointer-events-none">
        {number}
      </span>

      {/* Service name */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 pt-10 bg-gradient-to-t from-black/65 via-black/20 to-transparent">
        <p className="font-primary text-white uppercase text-[clamp(0.9rem,2vw,1.5rem)] leading-tight tracking-[0.06em]">
          {name}
        </p>
      </div>

      {/* Orange accent bottom border on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-orange scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100 z-30" />
    </>
  )
}
