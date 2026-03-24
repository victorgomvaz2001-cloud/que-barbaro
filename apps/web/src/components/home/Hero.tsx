import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export default async function Hero() {
  const t = await getTranslations('hero')

  return (
    <section className="mx-auto max-w-[1680px] px-6 pt-4 pb-6 flex flex-col items-center text-center gap-12">
      {/* ── Title + Subtitle ─────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-primary text-[clamp(4rem,14vw,11rem)] leading-[0.95] tracking-tight text-navy uppercase">
          Qué Bárbaro
          <p className="font-secondary text-[clamp(0.75rem,1.4vw,1rem)] uppercase tracking-[0.22em] text-navy/60">
          {t('subtitle')}
        </p>
        </h1>
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

      {/* ── Intro text ────────────────────────────────────────────────── */}
      <div className="max-w-2xl flex flex-col gap-5 text-center">
        <p className="font-secondary text-[clamp(0.85rem,1.3vw,1rem)] leading-relaxed tracking-wide text-navy/60">
          En Qué Bárbaro entendemos la peluquería de otra manera. No como una cita rápida para salir del paso, sino como un servicio donde el criterio, la técnica y la atención al detalle marcan la diferencia. Estamos en Torremolinos y trabajamos para quienes quieren que su cabello esté bien, no solo en el momento de salir del salón, sino también al día siguiente, y al otro.
        </p>
        <p className="font-secondary text-[clamp(0.85rem,1.3vw,1rem)] leading-relaxed tracking-wide text-navy/60">
          Nos especializamos en peluquería con atención personalizada: estudiamos cada cabello, escuchamos lo que busca cada persona y proponemos soluciones reales. Por eso muchos clientes que llegan buscando un salón de belleza en Torremolinos encuentran en nosotros algo diferente: un espacio donde se trabaja con tiempo, con intención y con un estándar alto en cada servicio.
        </p>
      </div>
    </section>
  )
}
