'use client'

export default function BackToTopButton() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="font-neue cursor-pointer text-xs text-orange/40 uppercase tracking-[0.12em] transition-colors hover:text-orange"
    >
      Volver arriba ↑
    </button>
  )
}
