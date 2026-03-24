'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Item = { q: string; a: string }

function FaqItem({ item, index }: { item: Item; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-navy/15">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-7 text-left group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-6">
          <span className="font-secondary text-[10px] tracking-[0.25em] text-navy/30 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-neue font-light text-[clamp(1.1rem,2vw,1.6rem)] leading-snug text-navy group-hover:text-navy/70 transition-colors duration-200">
            {item.q}
          </h3>
        </div>
        {/* Plus / Minus */}
        <span className="shrink-0 w-8 h-8 flex items-center justify-center border border-navy/20 rounded-full transition-transform duration-300" style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.2" className="text-navy/50" />
            <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.2" className="text-navy/50" />
          </svg>
        </span>
      </button>

      {/* Answer — CSS-driven expand */}
      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '200px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="font-neue font-light text-[clamp(0.9rem,1.2vw,1.05rem)] leading-relaxed text-navy/60 pb-7 pl-14">
          {item.a}
        </p>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const t = useTranslations('faq')
  const items = t.raw('items') as Item[]

  return (
    <section className="bg-cream w-full py-24 px-6">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="flex items-end justify-between mb-14 border-b border-navy/15 pb-8">
          <h2 className="font-primary text-[clamp(2.2rem,5vw,4rem)] leading-[1] tracking-tight text-navy uppercase">
            {t('title')}
          </h2>
          <span className="font-secondary text-[10px] uppercase tracking-[0.28em] text-navy/30 mb-1">
            FAQ
          </span>
        </div>

        {/* Items */}
        <div>
          {items.map((item, i) => (
            <FaqItem key={i} item={item} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
