import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

const SERVICE_KEYS = ['corte', 'coloracion', 'tratamientos', 'barberia', 'maquillaje'] as const
const SERVICE_SLUGS = ['corte', 'coloracion', 'tratamientos', 'barberia', 'maquillaje'] as const

const SERVICE_IMAGES = [
  'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service1.jpg',
  'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service2.jpg',
  'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service3.jpg',
  'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service4.jpg',
  'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service5.jpg',
]

const LAYOUT = [
  { colClass: 'col-span-2 md:col-span-3', heightClass: 'h-[55vw] md:h-[52vh]' },
  { colClass: 'col-span-1 md:col-span-2', heightClass: 'h-[62vw] md:h-[52vh]' },
  { colClass: 'col-span-1 md:col-span-2', heightClass: 'h-[62vw] md:h-[38vh]' },
  { colClass: 'col-span-1 md:col-span-1', heightClass: 'h-[55vw] md:h-[38vh]' },
  { colClass: 'col-span-1 md:col-span-2', heightClass: 'h-[55vw] md:h-[38vh]' },
]

export default async function FeaturedServices() {
  const t = await getTranslations('featuredServices')

  return (
    <section className="bg-cream w-full px-6 pb-20">
      <div className="mx-auto max-w-[1680px]">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-10 pb-4 gap-6">
          <h2 className="font-primary text-[clamp(2rem,5vw,4rem)] leading-none tracking-[0.05em] text-navy uppercase">
            {t('sectionTitle')}
          </h2>
          <Link
            href="/servicios/corte"
            className="bg-navy text-cream font-neue text-[13px] uppercase tracking-[0.14em] px-6 py-3.5 transition-opacity duration-150 hover:opacity-80 whitespace-nowrap"
          >
            {t('viewAll')}
          </Link>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-2 gap-y-2">
          {SERVICE_KEYS.map((key, i) => (
            <Link
              key={key}
              href={`/servicios/${SERVICE_SLUGS[i]}`}
              className={`${LAYOUT[i]!.colClass} group block relative`}
            >
              <div className={`${LAYOUT[i]!.heightClass} relative overflow-hidden`}>
                <Image
                  src={SERVICE_IMAGES[i]!}
                  alt={t(key)}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
                  <p className="font-neue text-white uppercase text-[clamp(1.1rem,1.9vw,1.6rem)] leading-none tracking-normal">
                    {t(key)}
                  </p>
                  <p className="font-neue font-light text-white/60 uppercase text-[clamp(0.6rem,0.8vw,0.7rem)] tracking-[0.18em]">
                    {t('priceGuide')}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
