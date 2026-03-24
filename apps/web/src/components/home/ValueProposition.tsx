import Image from 'next/image'

export default function ValueProposition() {
  return (
    <section className="relative w-full overflow-hidden">

      {/* ── Background image ──────────────────────────────────────────── */}
      <Image
        src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/valueproposal.webp"
        alt=""
        fill
        sizes="100vw"
        quality={75}
        className="object-cover object-center"
        aria-hidden
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-navy/60" />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-6xl px-8 py-20 flex flex-col md:flex-row items-center gap-12 md:gap-16">

        {/* Left: text */}
        <div className="flex-1 flex flex-col gap-8">
          <h2 className="font-primary text-[clamp(2.2rem,5vw,4rem)] leading-[1.05] tracking-[0.04em] text-cream uppercase">
            Peluquería personalizada para quienes saben lo que quieren
          </h2>
          <div className="flex flex-col gap-5">
            <p className="font-neue font-light text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-cream/75 text-justify">
              No todos los cabellos necesitan lo mismo, y no todos los clientes buscan lo mismo. En Qué Bárbaro esa diversidad es el punto de partida. Antes de empezar cualquier servicio, nos tomamos el tiempo de entender la textura, el historial, el estilo de vida y las expectativas de cada persona. Así el resultado no solo queda bien en el salón, también funciona en casa.
            </p>
            <p className="font-neue font-light text-[clamp(0.85rem,1.2vw,1rem)] leading-relaxed text-cream/75 text-justify">
              Ese enfoque es lo que nos distingue como referencia de alta peluquería en Torremolinos para quienes valoran una atención de verdad personalizada.
            </p>
          </div>
        </div>

        {/* Right: image */}
        <div className="flex-shrink-0 w-[280px] md:w-[360px] aspect-[3/4] relative rounded-full overflow-hidden shadow-2xl">
          <Image
            src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/valueproposalimage.webp"
            alt="Alta peluquería personalizada en Torremolinos - Qué Bárbaro"
            fill
            sizes="(max-width: 768px) 280px, 360px"
            quality={85}
            className="object-cover object-center"
          />
        </div>

      </div>
    </section>
  )
}
