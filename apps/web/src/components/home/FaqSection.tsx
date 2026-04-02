'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Item = { q: string; a: string }

function FaqItem({ item, index }: { item: Item; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative border-b border-navy/15">
      {/* Orange accent line on active item */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-orange transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0 }}
      />

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-6 py-7 text-left group pl-5"
        aria-expanded={open}
      >
        <div className="flex items-center gap-6">
          <span className="font-secondary text-[10px] tracking-[0.25em] text-navy/30 shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="font-neue text-[clamp(1.1rem,2vw,1.5rem)] leading-snug text-navy group-hover:text-navy/70 transition-colors duration-200">
            {item.q}
          </h3>
        </div>
        <span
          className="shrink-0 w-8 h-8 flex items-center justify-center border border-navy/20 rounded-full transition-transform duration-300"
          style={{ transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <line x1="6" y1="0" x2="6" y2="12" stroke="currentColor" strokeWidth="1.2" className="text-navy/50" />
            <line x1="0" y1="6" x2="12" y2="6" stroke="currentColor" strokeWidth="1.2" className="text-navy/50" />
          </svg>
        </span>
      </button>

      <div
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ maxHeight: open ? '200px' : '0px', opacity: open ? 1 : 0 }}
      >
        <p className="font-neue text-[clamp(0.9rem,1.2vw,1.05rem)] leading-relaxed text-navy/60 pb-7 pl-[4.25rem]">
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
          <h2 className="font-primary text-[clamp(2.2rem,5vw,4rem)] leading-[1] tracking-[0.08em] text-navy uppercase">
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

        {/* CTA */}
        <div className="mt-14 pt-8 border-t border-navy/10">
          <a
            href="https://wa.me/34644817835"
            target="_blank"
            rel="noopener noreferrer"
            className="font-neue text-[clamp(0.9rem,1.3vw,1.05rem)] text-navy hover:text-orange transition-colors duration-200 inline-flex items-center gap-2"
          >
            {t('cta')}
          </a>
        </div>

      </div>
    </section>
  )
}
