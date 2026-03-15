import Image from 'next/image'
import { Link } from '@/i18n/navigation'

const SERVICES = [
  {
    title: 'Corte y peinado',
    src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service1.jpg',
    colClass: 'col-span-2 md:col-span-3',
    heightClass: 'h-[55vw] md:h-[52vh]',
  },
  {
    title: 'Coloración y rubios',
    src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service2.jpg',
    colClass: 'col-span-1 md:col-span-2',
    heightClass: 'h-[62vw] md:h-[52vh]',
  },
  {
    title: 'Tratamientos capilares',
    src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service3.jpg',
    colClass: 'col-span-1 md:col-span-2',
    heightClass: 'h-[62vw] md:h-[38vh]',
  },
  {
    title: 'Barbería',
    src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service4.jpg',
    colClass: 'col-span-1 md:col-span-1',
    heightClass: 'h-[55vw] md:h-[38vh]',
  },
  {
    title: 'Maquillaje y belleza',
    src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/service5.jpg',
    colClass: 'col-span-1 md:col-span-2',
    heightClass: 'h-[55vw] md:h-[38vh]',
  },
]

export default function FeaturedServices() {
  return (
    <section className="bg-cream w-full px-6 pb-20">
      <div className="mx-auto max-w-[1680px]">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-end justify-between py-10 gap-6">
          <h2 className="font-primary text-[clamp(2rem,5vw,4rem)] leading-none tracking-tight text-navy uppercase">
            Servicios
          </h2>
          <Link
            href="/servicios"
            className="bg-navy text-cream font-secondary text-[12px] uppercase tracking-[0.12em] px-5 py-3 mb-1 transition-opacity duration-150 hover:opacity-80 whitespace-nowrap"
          >
            Ver todos
          </Link>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        {/* Desktop: 5 cols, row 1 = 3+2, row 2 = 2+1+2              */}
        {/* Mobile:  2 cols, row 1 = full, rows 2-3 = half+half       */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              href="/servicios"
              className={`${s.colClass} ${s.heightClass} relative overflow-hidden group`}
            >
              <Image
                src={s.src}
                alt={s.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/65 via-navy/10 to-transparent" />
              {/* Title */}
              <span className="absolute bottom-5 left-5 font-primary text-[clamp(1.2rem,2.5vw,2rem)] uppercase leading-none text-cream">
                {s.title}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
