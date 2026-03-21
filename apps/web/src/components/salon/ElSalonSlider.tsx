'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations } from 'next-intl'

/* ─── Types ─────────────────────────────────────────────────────────────── */

type SectionId = 'intro' | 'historia' | 'filosofia' | 'vision' | 'experiencia' | 'fundadores' | 'equipo' | 'marcas'

/* ─── Static (non-translatable) data ────────────────────────────────────── */

const SECTION_META: { id: SectionId; image: string; year?: string; founderImages?: string[] }[] = [
  { id: 'intro',      image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1920&q=80' },
  { id: 'historia',   image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80', year: '2025' },
  { id: 'filosofia',  image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1920&q=80' },
  { id: 'vision',     image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=80' },
  { id: 'experiencia',image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1920&q=80' },
  { id: 'fundadores', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1920&q=80', founderImages: ['/founders/missael.png', '/founders/aurelio.png'] },
  { id: 'equipo',     image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=80' },
  { id: 'marcas',     image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1920&q=80' },
]

/* ─── Helpers ───────────────────────────────────────────────────────────── */

function anim(active: boolean, delay: number, mounted: boolean, from = 'translateY(18px)') {
  if (!mounted) return {}
  return {
    opacity:         active ? 1 : 0,
    transform:       active ? 'translate(0,0)' : from,
    transition:      'opacity 0.75s ease, transform 0.75s ease',
    transitionDelay: active ? `${delay}ms` : '0ms',
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ElSalonSlider() {
  const tRaw = useTranslations('elSalon')
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted]   = useState(false)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && e.intersectionRatio >= 0.5) {
            const idx = sectionRefs.current.indexOf(e.target as HTMLElement)
            if (idx >= 0) setCurrent(idx)
          }
        })
      },
      { threshold: 0.5 }
    )
    sectionRefs.current.forEach(el => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => { setMounted(true) }, [])

  const goTo = useCallback((index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      {/* Keyframes */}
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes fadeScale { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }
        @keyframes revealBar { from { width:0 } to { width:100% } }
        @keyframes slideLeft { from { opacity:0; transform:translateX(60px) } to { opacity:1; transform:translateX(0) } }
        @keyframes slideRight { from { opacity:0; transform:translateX(-60px) } to { opacity:1; transform:translateX(0) } }
        @keyframes rotateIn { from { opacity:0; transform:rotate(-8deg) scale(0.9) } to { opacity:1; transform:rotate(0deg) scale(1) } }
        @keyframes expandX { from { transform:scaleX(0) } to { transform:scaleX(1) } }
      `}</style>

      {/* Dot nav */}
      <nav aria-label="Secciones" className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
        {SECTION_META.map((s, i) => {
          const label = tRaw(`${s.id}.label`)
          return (
            <button key={s.id} onClick={() => goTo(i)} aria-label={label} title={label} className="group flex items-center justify-end gap-2">
              <span className="pointer-events-none translate-x-1 whitespace-nowrap font-neue text-[10px] uppercase tracking-[0.18em] text-white opacity-0 transition-all duration-200 group-hover:opacity-70 group-hover:translate-x-0">
                {label}
              </span>
              <span className="block rounded-full transition-all duration-300" style={{
                width: i === current ? '10px' : '5px', height: i === current ? '10px' : '5px',
                backgroundColor: i === current ? '#fff' : 'rgba(255,255,255,0.3)',
                boxShadow: i === current ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none',
              }}/>
            </button>
          )
        })}
      </nav>

      {/* Counter */}
      <div className="fixed bottom-8 left-8 z-50 flex items-baseline gap-1.5 pointer-events-none">
        <span className="font-primary text-white text-[1.3rem] leading-none tabular-nums">{String(current + 1).padStart(2,'0')}</span>
        <span className="font-neue text-white/35 text-[10px] uppercase tracking-[0.18em]">/ {String(SECTION_META.length).padStart(2,'0')}</span>
      </div>

      {/* ── SLIDES ─────────────────────────────────────────── */}
      {SECTION_META.map((meta, i) => {
        const active = i === current
        const id = meta.id

        const bg = (
          <>
            <div className="absolute inset-0 bg-cover bg-center will-change-transform" style={{
              backgroundImage: `url(${meta.image})`,
              transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
              transform: active ? 'scale(1.05)' : 'scale(1)',
            }}/>
            {i === 0 && <div className="absolute inset-x-0 top-0 h-48 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F6F4F1 0%, rgba(246,244,241,0.7) 35%, rgba(246,244,241,0.2) 70%, transparent 100%)' }}/>}
            {i === SECTION_META.length - 1 && <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none" style={{ background: 'linear-gradient(to top, #F6F4F1 0%, rgba(246,244,241,0.7) 35%, rgba(246,244,241,0.2) 70%, transparent 100%)' }}/>}
          </>
        )

        /* ── 1. INTRO ── */
        if (id === 'intro') {
          const s = tRaw.raw('intro') as { label: string; title: string[]; text: string }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full items-center justify-center overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-black/55"/>
              <div className="relative z-10 flex flex-col items-center text-center px-8">
                {s.title.map((word, wi) => (
                  <span key={wi} className="block font-primary text-white uppercase leading-[0.88] overflow-hidden" style={{ fontSize: 'clamp(4rem, 11vw, 9rem)' }}>
                    <span className="block" style={anim(active, 200 + wi * 150, mounted)}>{word}</span>
                  </span>
                ))}
                <div className="mt-10 h-px w-12 bg-white/30 transition-all duration-700" style={{ opacity: active ? 1 : 0, transitionDelay: active ? '700ms' : '0ms' }}/>
                <p className="mt-6 font-secondary text-white/70 max-w-sm leading-relaxed" style={{ fontSize: 'clamp(0.9rem,1.2vw,1rem)', ...anim(active, 800, mounted) }}>
                  {s.text}
                </p>
              </div>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" style={{ opacity: active ? 0.5 : 0, transition: 'opacity 0.5s ease', transitionDelay: active ? '1000ms' : '0ms' }}>
                <div className="w-px h-10 bg-gradient-to-b from-white to-transparent animate-pulse"/>
              </div>
            </section>
          )
        }

        /* ── 2. HISTORIA ── */
        if (id === 'historia') {
          const s = tRaw.raw('historia') as { label: string; title: string; text: string }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full items-center overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20"/>
              <div className="relative z-10 mx-auto w-full max-w-[1680px] px-10 md:px-24 flex flex-col justify-center">
                <p className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6" style={anim(active, 150, mounted)}>- {s.label}</p>
                <h2 className="font-neue font-light text-white uppercase leading-[0.9] mb-8 max-w-md" style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', whiteSpace: 'pre-line', ...anim(active, 280, mounted) }}>
                  {s.title}
                </h2>
                <div className="h-px bg-white/25 mb-8" style={{ width: active ? '56px' : '0px', transition: 'width 0.65s cubic-bezier(0.16,1,0.3,1)', transitionDelay: active ? '400ms' : '0ms' }}/>
                <p className="font-secondary text-white/70 leading-relaxed max-w-md" style={{ fontSize: 'clamp(0.9rem,1.2vw,1rem)', ...anim(active, 420, mounted) }}>{s.text}</p>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 font-primary text-white/8 leading-none pointer-events-none select-none pr-8"
                style={{ fontSize: 'clamp(10rem, 22vw, 22rem)', opacity: active ? 0.08 : 0, transform: active ? 'translateX(0)' : 'translateX(80px)', transition: 'opacity 0.9s ease, transform 0.9s cubic-bezier(0.16,1,0.3,1)', transitionDelay: active ? '500ms' : '0ms' }}
                aria-hidden>
                {meta.year}
              </div>
            </section>
          )
        }

        /* ── 3. FILOSOFÍA ── */
        if (id === 'filosofia') {
          const s = tRaw.raw('filosofia') as { label: string; quote: string; sub: string }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full items-center justify-center overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-black/65"/>
              <div className="relative z-10 mx-auto max-w-4xl px-10 md:px-20 text-center">
                <div className="font-primary text-white/15 leading-none mb-4 select-none" aria-hidden
                  style={{ fontSize: 'clamp(6rem,14vw,12rem)', opacity: active ? 1 : 0, transform: active ? 'rotate(0deg)' : 'rotate(-12deg) scale(0.8)', transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)', transitionDelay: active ? '100ms' : '0ms' }}>
                  &ldquo;
                </div>
                <blockquote className="font-neue font-light text-white leading-[1.1] mb-8"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.8rem)', ...anim(active, 350, mounted) }}>
                  {s.quote}
                </blockquote>
                <div className="mx-auto h-px bg-white/20 mb-6" style={{ width: active ? '48px' : '0px', transition: 'width 0.6s ease', transitionDelay: active ? '550ms' : '0ms' }}/>
                <p className="font-secondary text-white/60 leading-relaxed max-w-lg mx-auto" style={{ fontSize: 'clamp(0.9rem,1.2vw,1.05rem)', ...anim(active, 600, mounted) }}>
                  {s.sub}
                </p>
              </div>
            </section>
          )
        }

        /* ── 4. VISIÓN ── */
        if (id === 'vision') {
          const s = tRaw.raw('vision') as { label: string; title: string; text: string; values: [string, string][] }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full items-center overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"/>
              <div className="relative z-10 mx-auto w-full max-w-[1680px] px-10 md:px-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                <div>
                  <p className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/50 mb-6" style={anim(active, 150, mounted)}>- {s.label}</p>
                  <h2 className="font-neue font-light text-white uppercase leading-[0.9] mb-6" style={{ fontSize: 'clamp(3rem,6vw,5.5rem)', whiteSpace: 'pre-line', ...anim(active, 260, mounted) }}>
                    {s.title}
                  </h2>
                  <p className="font-secondary text-white/65 leading-relaxed" style={{ fontSize: 'clamp(0.9rem,1.2vw,1rem)', maxWidth: '36ch', ...anim(active, 380, mounted) }}>
                    {s.text}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  {s.values.map((v, vi) => (
                    <div key={vi} className="flex items-start gap-4 border-b border-white/10 pb-4"
                      style={mounted ? { opacity: active ? 1 : 0, transform: active ? 'translateX(0)' : 'translateX(40px)', transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: active ? `${300 + vi * 100}ms` : '0ms' } : {}}>
                      <span className="font-neue text-white/30 text-[10px] tabular-nums mt-1">{String(vi + 1).padStart(2,'0')}</span>
                      <div>
                        <p className="font-neue font-bold text-white text-[11px] uppercase tracking-[0.18em]">{v[0]}</p>
                        <p className="font-secondary text-white/50 text-[13px] mt-0.5">{v[1]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        /* ── 5. EXPERIENCIA ── */
        if (id === 'experiencia') {
          const s = tRaw.raw('experiencia') as { label: string; title: string; text: string; rituals: { n: string; name: string; desc: string }[] }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full flex-col justify-between overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80"/>
              <div className="relative z-10 mx-auto w-full max-w-[1680px] px-10 md:px-24 pt-20">
                <p className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4" style={anim(active, 150, mounted)}>- {s.label}</p>
                <h2 className="font-neue font-light text-white uppercase leading-[0.9]" style={{ fontSize: 'clamp(3rem,6.5vw,5.5rem)', whiteSpace: 'pre-line', ...anim(active, 260, mounted) }}>
                  {s.title}
                </h2>
                <p className="font-secondary text-white/60 mt-3" style={{ fontSize: 'clamp(0.85rem,1.1vw,0.95rem)', ...anim(active, 360, mounted) }}>
                  {s.text}
                </p>
              </div>
              <div className="relative z-10 w-full">
                {s.rituals.map((r, ri) => (
                  <div key={ri} className="relative overflow-hidden border-t border-white/10">
                    <div className="absolute inset-0 bg-white/5 origin-left"
                      style={{ transform: active ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)', transitionDelay: active ? `${400 + ri * 80}ms` : '0ms' }}/>
                    <div className="relative flex items-center gap-6 px-10 md:px-24 py-3"
                      style={mounted ? { opacity: active ? 1 : 0, transition: 'opacity 0.5s ease', transitionDelay: active ? `${420 + ri * 80}ms` : '0ms' } : {}}>
                      <span className="font-neue text-white/30 text-[10px] tabular-nums shrink-0">{r.n}</span>
                      <span className="font-neue font-bold text-white text-[11px] uppercase tracking-[0.18em]">{r.name}</span>
                      <span className="font-secondary text-white/50 text-[13px] hidden md:block">- {r.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )
        }

        /* ── 6. FUNDADORES ── */
        if (id === 'fundadores') {
          const s = tRaw.raw('fundadores') as { label: string; founders: { name: string; role: string }[] }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-black/70"/>
              <div className="relative z-10 flex flex-col items-center w-full px-8">
                <p className="font-neue font-light uppercase text-white mb-12" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', letterSpacing: '0.08em', ...anim(active, 100, mounted) }}>{s.label}</p>
                <div className="flex flex-row items-end justify-center gap-12 md:gap-24 w-full">
                  {s.founders.map((f, fi) => (
                    <div key={fi} className="flex flex-col items-center"
                      style={mounted ? { opacity: active ? 1 : 0, transform: active ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 0.8s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)', transitionDelay: active ? `${250 + fi * 200}ms` : '0ms' } : {}}>
                      <img
                        src={meta.founderImages?.[fi]}
                        alt={f.name}
                        className="object-contain w-auto"
                        style={{ height: 'clamp(260px, 48vh, 460px)', maxWidth: '280px' }}
                      />
                      <div className="h-px bg-white/25 mt-6 mb-4" style={{ width: active ? '48px' : '0px', transition: 'width 0.6s ease', transitionDelay: active ? `${500 + fi * 200}ms` : '0ms' }}/>
                      <p className="font-neue font-light text-white uppercase text-center" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)' }}>
                        {f.name}
                      </p>
                      <p className="font-neue text-white/50 uppercase tracking-[0.22em] text-center mt-1" style={{ fontSize: '10px' }}>
                        {f.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        }

        /* ── 7. EQUIPO ── */
        if (id === 'equipo') {
          const s = tRaw.raw('equipo') as { label: string; title: string; text: string }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full items-end overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"/>
              <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent"/>
              <div className="relative z-10 ml-auto w-full max-w-lg px-10 md:px-16 pb-20 text-right">
                <p className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/50 mb-4" style={anim(active, 200, mounted)}>- {s.label}</p>
                <h2 className="font-neue font-light text-white uppercase leading-[0.9] mb-6"
                  style={{ fontSize: 'clamp(3rem,6vw,5rem)', whiteSpace: 'pre-line', ...anim(active, 300, mounted) }}>
                  {s.title}
                </h2>
                <div className="ml-auto h-px bg-white/25 mb-6" style={{ width: active ? '48px' : '0px', transition: 'width 0.6s ease', transitionDelay: active ? '460ms' : '0ms' }}/>
                <p className="font-secondary text-white/65 leading-relaxed" style={{ fontSize: 'clamp(0.9rem,1.2vw,1rem)', ...anim(active, 440, mounted) }}>
                  {s.text}
                </p>
              </div>
            </section>
          )
        }

        /* ── 8. MARCAS ── */
        if (id === 'marcas') {
          const s = tRaw.raw('marcas') as { label: string; title: string; text: string }
          return (
            <section key={id} id={id} ref={el => { sectionRefs.current[i] = el }} className="relative flex h-screen w-full items-center justify-center overflow-hidden" aria-label={s.label}>
              {bg}
              <div className="absolute inset-0 bg-black/60"/>
              <div className="relative z-10 text-center px-8 max-w-3xl mx-auto">
                <p className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/50 mb-8" style={anim(active, 150, mounted)}>- {s.label}</p>
                <div className="h-px bg-white/20 mx-auto mb-8" style={{ width: active ? '80px' : '0px', transition: 'width 0.7s ease', transitionDelay: active ? '200ms' : '0ms' }}/>
                <h2 className="font-neue font-light text-white uppercase leading-[0.9] mb-8"
                  style={{ fontSize: 'clamp(3.5rem,8vw,7rem)', whiteSpace: 'pre-line', ...anim(active, 320, mounted) }}>
                  {s.title}
                </h2>
                <div className="h-px bg-white/20 mx-auto mb-8" style={{ width: active ? '80px' : '0px', transition: 'width 0.7s ease', transitionDelay: active ? '480ms' : '0ms' }}/>
                <p className="font-secondary text-white/65 leading-relaxed max-w-md mx-auto" style={{ fontSize: 'clamp(0.9rem,1.2vw,1.05rem)', ...anim(active, 560, mounted) }}>
                  {s.text}
                </p>
              </div>
            </section>
          )
        }

        return null
      })}
    </>
  )
}
