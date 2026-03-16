import Image from 'next/image'

export default function Hero() {
  return (
    <section className="mx-auto max-w-[1680px] px-6 pt-4 pb-6 flex flex-col items-center text-center gap-12">
      {/* ── Title + Subtitle ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-primary text-[clamp(4rem,14vw,11rem)] leading-[0.95] tracking-tight text-navy uppercase">
          Qué Bárbaro
        </h1>
        <p className="font-secondary text-[clamp(0.75rem,1.4vw,1rem)] uppercase tracking-[0.22em] text-navy/60">
          Salón de belleza · Torremolinos
        </p>
      </div>

      {/* ── Image 4:3 ─────────────────────────────────────────────────── */}
      <div className="relative w-full max-w-xl aspect-[3/4] overflow-hidden">
        <Image
          src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/hero.jpg"
          alt="Salón de belleza Que Bárbaro - interior del espacio"
          fill
          sizes="(max-width: 768px) 100vw, 768px"
          quality={85}
          priority
          className="object-cover object-center"
        />
      </div>
    </section>
  )
}
