import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export default async function HomeBrands() {
  const t = await getTranslations('homeBrands')

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
          style={{ background: 'radial-gradient(ellipse 90% 50% at 50% 30%, rgba(254,81,0,0.055) 0%, transparent 65%)' }}
          aria-hidden
        />

        {/* ── Eyebrow label ───────────────────────────────────────────── */}
        <div className="relative z-10 flex items-center gap-5 px-8 md:px-20 pt-20">
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(254,81,0,0.3))' }} />
          <p className="font-neue text-[9px] uppercase tracking-[0.45em] text-orange/55 shrink-0">
            {t('eyebrow')}
          </p>
          <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(254,81,0,0.3))' }} />
        </div>

        {/* ── H2 ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 flex justify-center px-8 mt-10 mb-14">
          <h2 className="font-primary text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.05] tracking-[0.04em] text-cream uppercase text-center">
            {t('h2')}
          </h2>
        </div>

        {/* ── Two brand panels ────────────────────────────────────────── */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 border-t border-cream/[0.06]">

          {/* ─ GOA ORGANICS ─ */}
          <div className="relative overflow-hidden flex flex-col items-center gap-8 px-10 md:px-16 pt-16 pb-16 border-b md:border-b-0 md:border-r border-cream/[0.06]">
            <span className="absolute inset-0 flex items-end pb-2 pl-3 font-primary select-none pointer-events-none" style={{ fontSize: 'clamp(5rem,13vw,11rem)', lineHeight: 1, color: 'rgba(246,244,241,0.027)', letterSpacing: '0.04em' }} aria-hidden>GOA</span>
            <div className="self-start">
              <span className="font-neue text-[9px] uppercase tracking-[0.45em] px-2 py-1" style={{ color: 'rgba(254,81,0,0.6)', border: '1px solid rgba(254,81,0,0.2)' }}>01</span>
            </div>
            <div className="brands-logo-goa relative" style={{ width: '260px', height: '104px' }}>
              <Image src="/goa_organics.png" alt="GOA Organics" fill sizes="260px" className="object-contain object-center" style={{ filter: 'invert(1)', mixBlendMode: 'screen' }} />
            </div>
            <p className="font-secondary italic text-[clamp(0.78rem,0.95vw,0.88rem)] text-cream/40 text-center tracking-wide">
              {t('phrase1')}
            </p>
          </div>

          {/* ─ ORIBE ─ */}
          <div className="relative overflow-hidden flex flex-col items-center gap-8 px-10 md:px-16 pt-16 pb-16">
            <span className="absolute inset-0 flex items-end justify-end pb-2 pr-3 font-primary select-none pointer-events-none" style={{ fontSize: 'clamp(4rem,11vw,9rem)', lineHeight: 1, color: 'rgba(246,244,241,0.027)', letterSpacing: '0.04em' }} aria-hidden>ORIBE</span>
            <div className="self-start">
              <span className="font-neue text-[9px] uppercase tracking-[0.45em] px-2 py-1" style={{ color: 'rgba(254,81,0,0.6)', border: '1px solid rgba(254,81,0,0.2)' }}>02</span>
            </div>
            <div className="brands-logo-oribe relative" style={{ width: '148px', height: '199px' }}>
              <Image src="/oribe.svg" alt="ORIBE" fill sizes="148px" className="object-contain object-center" style={{ filter: 'invert(1) brightness(0.95)' }} />
            </div>
            <p className="font-secondary italic text-[clamp(0.78rem,0.95vw,0.88rem)] text-cream/40 text-center tracking-wide">
              {t('phrase2')}
            </p>
          </div>

        </div>

        {/* ── Thin orange rule ─────────────────────────────────────────── */}
        <div className="relative z-10 mx-8 md:mx-20 mt-14 mb-8 h-px bg-orange/30" />

      </section>
    </>
  )
}
