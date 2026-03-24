import Image from 'next/image'

export default function ExperienceSection() {
  const ticker = 'Calidad · Técnica · Atención personalizada · Torremolinos · Peluquería boutique · Alta peluquería · '

  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .experience-marquee {
          animation: marquee 22s linear infinite;
        }
      `}</style>

      <section className="bg-cream w-full overflow-hidden py-24 relative">

        <div className="mx-auto max-w-7xl px-8">

          {/* ── Label ─────────────────────────────────────────────────── */}
          <p className="font-secondary text-[10px] uppercase tracking-[0.3em] text-navy/35 mb-14">
            El espacio · Qué Bárbaro
          </p>

          {/* ── H2 cascading ──────────────────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center w-full">

            {/* H2 */}
            <h2 className="flex-1 font-primary text-[clamp(2.6rem,7.5vw,6.5rem)] leading-[0.93] tracking-tight text-navy uppercase">
              <span className="block" style={{ paddingLeft: '0' }}>Un espacio</span>
              <span className="block" style={{ paddingLeft: '7vw' }}>pensado para</span>
              <span className="block" style={{ paddingLeft: '1vw' }}>que el cuidado</span>
              <span className="block" style={{ paddingLeft: '11vw' }}>personal sea</span>
              <span className="block text-navy/25" style={{ paddingLeft: '3vw' }}>una experiencia</span>
            </h2>

            {/* Divider */}
            <div className="hidden md:flex justify-center items-stretch w-16 shrink-0 self-stretch">
              <div className="w-px bg-navy/20" />
            </div>

            {/* Image — experience2, flush right, full height of row */}
            <div className="relative shrink-0 w-full md:w-[38%] self-stretch min-h-[300px] overflow-hidden mt-10 md:mt-0 md:-mr-8">
              <Image
                src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/experience2.webp"
                alt="Interior del salón Qué Bárbaro en Torremolinos"
                fill
                sizes="(max-width: 768px) 100vw, 38vw"
                quality={85}
                className="object-cover object-left"
              />
            </div>

          </div>

        </div>

        {/* ── Marquee ticker ────────────────────────────────────────── */}
        <div className="mt-16 mb-16 border-t border-b border-navy/10 py-[14px] overflow-hidden">
          <div className="experience-marquee flex whitespace-nowrap">
            <span className="font-secondary text-[10px] uppercase tracking-[0.28em] text-navy/30">
              {ticker.repeat(6)}
            </span>
            <span className="font-secondary text-[10px] uppercase tracking-[0.28em] text-navy/30" aria-hidden>
              {ticker.repeat(6)}
            </span>
          </div>
        </div>

        {/* ── Body paragraphs + image left ──────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center w-full">

          {/* Image — flush left */}
          <div className="relative shrink-0 w-full md:w-[40%] aspect-[4/3] overflow-hidden mb-10 md:mb-0">
            <Image
              src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/experience1.webp"
              alt="Detalle del servicio en Qué Bárbaro"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              quality={85}
              className="object-cover object-center"
            />
          </div>

          {/* Divider — centered between image and text */}
          <div className="hidden md:flex justify-center items-stretch w-16 shrink-0 self-stretch">
            <div className="w-px bg-navy/20" />
          </div>

          {/* Párrafos apilados */}
          <div className="flex-1 flex flex-col gap-8 px-8 md:pr-16">
            <p className="font-neue font-light text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-navy/60">
              Qué Bárbaro no es solo una peluquería boutique. Es un espacio elegante, tranquilo y con criterio estético propio, donde cada detalle del proceso forma parte del resultado. Desde la bienvenida hasta el acabado final, cuidamos el ritmo, el ambiente y el trato para que venir al salón sea una pausa que merece la pena.
            </p>
            <p className="font-neue font-light text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-navy/60">
              Esa combinación de técnica y experiencia es lo que nos convierte en uno de los salones de referencia en Torremolinos para quienes buscan calidad, no volumen.
            </p>
          </div>

        </div>

      </section>
    </>
  )
}
