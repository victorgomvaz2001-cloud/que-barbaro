import Image from 'next/image'

export default function HomeBrands() {
  return (
    <>
      <style>{`
        @keyframes brands-float-a {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-10px); }
        }
        @keyframes brands-float-b {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .brands-logo-goa   { animation: brands-float-a 8s  ease-in-out infinite; }
        .brands-logo-oribe { animation: brands-float-b 10s ease-in-out infinite 1s; }
      `}</style>

      <section className="relative bg-navy w-full overflow-hidden">

        {/* ── Orange radial glow ──────────────────────────────────────── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 90% 50% at 50% 30%, rgba(254,81,0,0.055) 0%, transparent 65%)',
          }}
          aria-hidden
        />

        {/* ── Centred label ───────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center gap-5 px-8 md:px-20 pt-20">
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(254,81,0,0.3))' }}
          />
          <p className="font-neue text-[9px] uppercase tracking-[0.45em] text-orange/55 shrink-0">
            Marcas seleccionadas
          </p>
          <div
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(to left, transparent, rgba(254,81,0,0.3))' }}
          />
        </div>

        {/* ── Two brand panels ────────────────────────────────────────── */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 mt-14 border-t border-b border-cream/[0.06]">

          {/* ─ GOA ORGANICS ─ */}
          <div className="group relative overflow-hidden flex flex-col items-center gap-9 px-10 md:px-16 pt-16 pb-16 border-b md:border-b-0 md:border-r border-cream/[0.06] transition-colors duration-700 hover:bg-cream/[0.025]">

            {/* Ghost watermark */}
            <span
              className="absolute inset-0 flex items-end pb-2 pl-3 font-primary select-none pointer-events-none"
              style={{
                fontSize: 'clamp(5rem,13vw,11rem)',
                lineHeight: 1,
                color: 'rgba(246,244,241,0.027)',
                letterSpacing: '0.04em',
              }}
              aria-hidden
            >
              GOA
            </span>

            {/* Exhibit badge */}
            <div className="self-start">
              <span
                className="font-neue text-[9px] uppercase tracking-[0.45em] px-2 py-1"
                style={{ color: 'rgba(254,81,0,0.6)', border: '1px solid rgba(254,81,0,0.2)' }}
              >
                01
              </span>
            </div>

            {/* Logo — inverted + screen blend to dissolve white bg */}
            <div className="brands-logo-goa relative" style={{ width: '260px', height: '104px' }}>
              <Image
                src="/goa_organics.png"
                alt="GOA Organics"
                fill
                sizes="260px"
                className="object-contain object-center"
                style={{ filter: 'invert(1)', mixBlendMode: 'screen' }}
              />
            </div>

            {/* Italic descriptor */}
            <p className="font-secondary italic text-[clamp(0.78rem,0.95vw,0.88rem)] text-cream/28 text-center tracking-wide">
              Tratamientos de precisión capilar
            </p>

            {/* Treatment tags */}
            <div className="flex flex-wrap justify-center gap-2">
              {['Keratin Infusion', 'Softy Mood', 'Sublime 10.31', 'Bae Berry'].map((name) => (
                <span
                  key={name}
                  className="font-neue text-[9px] uppercase tracking-[0.18em] text-cream/30 border border-cream/10 px-3 py-1.5 transition-all duration-500 group-hover:text-cream/55 group-hover:border-orange/20"
                >
                  {name}
                </span>
              ))}
            </div>

            {/* Hover bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-orange/0 group-hover:bg-orange/20 transition-colors duration-700" />
          </div>

          {/* ─ ORIBE ─ */}
          <div className="group relative overflow-hidden flex flex-col items-center gap-9 px-10 md:px-16 pt-16 pb-16 transition-colors duration-700 hover:bg-cream/[0.025]">

            {/* Ghost watermark */}
            <span
              className="absolute inset-0 flex items-end justify-end pb-2 pr-3 font-primary select-none pointer-events-none"
              style={{
                fontSize: 'clamp(4rem,11vw,9rem)',
                lineHeight: 1,
                color: 'rgba(246,244,241,0.027)',
                letterSpacing: '0.04em',
              }}
              aria-hidden
            >
              ORIBE
            </span>

            {/* Exhibit badge */}
            <div className="self-start">
              <span
                className="font-neue text-[9px] uppercase tracking-[0.45em] px-2 py-1"
                style={{ color: 'rgba(254,81,0,0.6)', border: '1px solid rgba(254,81,0,0.2)' }}
              >
                02
              </span>
            </div>

            {/* Logo — SVG has transparent bg, invert makes fills white */}
            <div className="brands-logo-oribe relative" style={{ width: '148px', height: '199px' }}>
              <Image
                src="/oribe.svg"
                alt="ORIBE"
                fill
                sizes="148px"
                className="object-contain object-center"
                style={{ filter: 'invert(1) brightness(0.95)' }}
              />
            </div>

            {/* Italic descriptor */}
            <p className="font-secondary italic text-[clamp(0.78rem,0.95vw,0.88rem)] text-cream/28 text-center tracking-wide">
              Rituales de lujo sensorial
            </p>

            {/* Tag */}
            <div className="flex flex-wrap justify-center gap-2">
              <span className="font-neue text-[9px] uppercase tracking-[0.18em] text-cream/30 border border-cream/10 px-3 py-1.5 transition-all duration-500 group-hover:text-cream/55 group-hover:border-orange/20">
                Rituales de salón exclusivos
              </span>
            </div>

            {/* Hover bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-orange/0 group-hover:bg-orange/20 transition-colors duration-700" />
          </div>

        </div>

        {/* ── Editorial copy block ─────────────────────────────────────── */}
        <div className="relative z-10 mx-auto max-w-3xl px-8 md:px-16 pt-18 pb-16 flex flex-col gap-9">

          {/* Cascading H2 */}
          <h2 className="font-primary text-[clamp(1.9rem,4vw,3.1rem)] leading-[1.05] tracking-[0.03em] text-cream uppercase mt-12">
            <span className="block">GOA Organics y ORIBE:</span>
            <span className="block text-cream/35 text-[0.74em] mt-1">la selección de marcas</span>
            <span className="block mt-1" style={{ paddingLeft: '5vw' }}>de Qué Bárbaro</span>
          </h2>

          {/* Orange rule */}
          <div className="h-px w-14 bg-orange/40" />

          {/* Body */}
          <div className="flex flex-col gap-5">
            <p className="font-neue font-light text-[clamp(0.85rem,1.1vw,0.95rem)] leading-[1.9] text-cream/48">
              Trabajamos con marcas que están a la altura de lo que queremos ofrecer. Con GOA Organics aplicamos tratamientos específicos como Keratin Infusion, Softy Mood, Sublime 10.31 y Bae Berry, cada uno diseñado para una necesidad concreta del cabello. ORIBE añade una experiencia más lujosa y sensorial, ideal para rituales de salón exclusivos.
            </p>
            <p className="font-neue font-light text-[clamp(0.85rem,1.1vw,0.95rem)] leading-[1.9] text-cream/48">
              Esta selección refleja nuestra apuesta por los tratamientos capilares premium en Torremolinos: no buscamos lo más rápido, buscamos lo que de verdad mejora el cabello.
            </p>
          </div>
        </div>

        {/* ── Footer strip ─────────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center pb-8 px-8">
          <div className="flex-1 h-px bg-cream/[0.06]" />
          <span className="font-neue text-[8px] uppercase tracking-[0.55em] text-cream/18 px-8">
            Premium · Torremolinos · Alta Peluquería
          </span>
          <div className="flex-1 h-px bg-cream/[0.06]" />
        </div>

      </section>
    </>
  )
}
