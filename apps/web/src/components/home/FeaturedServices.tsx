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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-2 gap-y-8">
          {SERVICES.map((s) => (
            <Link
              key={s.title}
              href="/servicios"
              className={`${s.colClass} group block relative`}
            >
              {/* Image */}
              <div className={`${s.heightClass} relative overflow-hidden`}>
                <Image
                  src={s.src}
                  alt={s.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-cream/60 to-transparent" />
              </div>

              {/* Title — z-10 so it renders above the image */}
              <p className="relative z-10 -mt-[0.5em] pl-3 font-primary text-[clamp(1.3rem,2.4vw,2rem)] leading-none uppercase text-navy">
                {s.title}
              </p>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
