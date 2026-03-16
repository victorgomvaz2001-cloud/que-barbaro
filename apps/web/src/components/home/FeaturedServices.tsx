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
        <div className="flex items-center justify-between pt-10 pb-4 gap-6">
          <h2 className="font-primary text-[clamp(2rem,5vw,4rem)] leading-none tracking-[0.05em] text-navy uppercase">
            Servicios
          </h2>
          <Link
            href="/servicios"
            className="bg-navy text-cream font-neue text-[13px] uppercase tracking-[0.14em] px-6 py-3.5 transition-opacity duration-150 hover:opacity-80 whitespace-nowrap"
          >
            Ver todos
          </Link>
        </div>

        {/* ── Grid ───────────────────────────────────────────────────── */}
        {/* Desktop: 5 cols, row 1 = 3+2, row 2 = 2+1+2              */}
        {/* Mobile:  2 cols, row 1 = full, rows 2-3 = half+half       */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-2 gap-y-2">
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
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 transition-opacity duration-300 group-hover:bg-black/50" />

                {/* Centered text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-4">
                  <p className="font-neue text-white uppercase text-[clamp(1.1rem,1.9vw,1.6rem)] leading-none tracking-normal">
                    {s.title}
                  </p>
                  <p className="font-neue font-light text-white/60 uppercase text-[clamp(0.6rem,0.8vw,0.7rem)] tracking-[0.18em]">
                    Consultar catálogo de precios
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
