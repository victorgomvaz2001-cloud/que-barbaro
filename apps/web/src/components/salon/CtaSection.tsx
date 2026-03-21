'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function CtaSection() {
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  function t(delay: number, from = 'translateY(18px)') {
    if (!mounted) return {}
    return {
      opacity: visible ? 1 : 0,
      transform: visible ? 'translate(0,0)' : from,
      transition: 'opacity 0.75s ease, transform 0.75s ease',
      transitionDelay: visible ? `${delay}ms` : '0ms',
    }
  }

  return (
    <section
      ref={ref}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1633681122182-adcba53ef06a?auto=format&fit=crop&w=1920&q=80)`,
          transform: visible ? 'scale(1.05)' : 'scale(1)',
          transition: 'transform 1.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      />
      <div className="absolute inset-0 bg-black/65" />

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        <p className="font-neue text-[11px] uppercase tracking-[0.3em] text-white/50 mb-8" style={t(150)}>
          - Reserva
        </p>
        <h2
          className="font-neue font-light text-white uppercase leading-[0.9] mb-4"
          style={{ fontSize: 'clamp(4rem,10vw,9rem)', whiteSpace: 'pre-line', ...t(280) }}
        >
          {'¿Listo para\nla experiencia?'}
        </h2>
        <p
          className="font-secondary text-white/60 mb-12 tracking-widest uppercase text-sm"
          style={t(420)}
        >
          Tu cita te está esperando.
        </p>
        <Link
          href="/reservar-cita"
          className="inline-flex items-center gap-4 font-neue font-bold text-[11px] uppercase tracking-[0.3em] text-white border border-white/50 px-10 py-5 transition-all duration-300 hover:bg-white hover:text-navy"
          style={mounted ? {
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
            transition: 'opacity 0.7s ease, transform 0.7s ease, background-color 0.3s, color 0.3s',
            transitionDelay: visible ? '540ms' : '0ms',
          } : {}}
        >
          Reservar cita
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 5h14M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>
      </div>
    </section>
  )
}
