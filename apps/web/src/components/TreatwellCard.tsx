'use client'

const TREATWELL_WIDGET_URL = 'https://widget.treatwell.es/establecimiento/506250/servicios/'
const TREATWELL_FALLBACK = 'https://www.treatwell.es/'

export default function TreatwellCard({
  className = '',
  label = 'Treatwell',
  sublabel = 'Reserva online',
  cta = 'Reservar ahora →',
}: {
  className?: string
  label?: string
  sublabel?: string
  cta?: string
}) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const w = window as unknown as { wahanda?: { openOnlineBookingWidget: (url: string) => void } }
    if (w.wahanda?.openOnlineBookingWidget) {
      e.preventDefault()
      w.wahanda.openOnlineBookingWidget(TREATWELL_WIDGET_URL)
    }
  }

  return (
    <a
      href={TREATWELL_FALLBACK}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`group relative flex flex-col items-center text-center gap-3 px-6 py-8 bg-transparent border border-white transition-colors duration-300 hover:bg-white/10 ${className}`}
    >
      {/* Calendar + checkmark icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="34" height="34"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" />
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" />
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" />
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" />
        <polyline points="9 16 11 18 15 14" stroke="currentColor" />
      </svg>
      <div>
        <p className="font-primary text-[1.3rem] leading-none tracking-wide text-white mb-1">
          {label}
        </p>
        <p className="font-neue text-[10px] tracking-[0.14em] uppercase text-white/60">
          {sublabel}
        </p>
      </div>
      <p className="font-secondary font-semibold text-[12px] tracking-[0.08em] text-white">
        treatwell.es
      </p>
      <span className="font-neue font-bold text-[9px] uppercase tracking-[0.2em] text-white border-b border-current pb-px">
        {cta}
      </span>
    </a>
  )
}
