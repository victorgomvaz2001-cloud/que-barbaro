import Image from 'next/image'
import { Link } from '@/i18n/navigation'

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-[1680px] grid-cols-1 items-center gap-12 px-8 py-16 md:grid-cols-2 md:gap-20 md:py-20">
      {/* ── Left: text ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-10">
        <h1 className="font-primary text-[clamp(2.6rem,5.5vw,5.2rem)] leading-[1.05] tracking-tight text-navy">
          El Santuario de Belleza que Estabas Buscando
        </h1>

        <Link
          href="/reservar-cita"
          className="font-secondary inline-flex w-fit items-center bg-navy px-6 py-5 text-[22px] font-bold uppercase tracking-[0.15em] text-cream transition-all duration-200 hover:opacity-80"
        >
          Reservar Cita
        </Link>
      </div>

      {/* ── Right: image ───────────────────────────────────────────── */}
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/hero.jpg"
          alt="Salón de belleza Que Bárbaro — interior del espacio"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={85}
          priority
          className="object-cover object-center"
        />
      </div>
    </section>
  )
}
