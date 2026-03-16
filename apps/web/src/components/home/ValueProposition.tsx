import { Link } from '@/i18n/navigation'

export default function ValueProposition() {
  return (
    <section className="bg-cream w-full pt-10 pb-28 px-6">
      <div className="mx-auto max-w-4xl flex flex-col items-center text-center gap-10">

        {/* ── Headline ──────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-0">
          <h2 className="font-primary text-[clamp(2.8rem,7vw,6.5rem)] leading-[1] tracking-[0.05em] text-navy uppercase">
            No vendrás solo<br />a cortarte el pelo.
          </h2>
          <p className="font-neue font-light text-[clamp(1rem,2.2vw,1.8rem)] leading-snug text-navy mt-3">
            Vendrás a desconectar. A que te mimen. A salir siendo más tú.
          </p>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <p className="font-secondary text-[clamp(0.85rem,1.3vw,1rem)] leading-relaxed tracking-wide text-navy/60 max-w-2xl">
          ¡Qué Bárbaro! nació para demostrar que una peluquería puede ser mucho más que un servicio.
          Es un refugio donde la estética, la hospitalidad y el diseño conviven para crear algo que
          no habías vivido antes. Cada detalle - la fragancia, la música, la toalla fría al llegar,
          la bebida que te espera existe por una razón: hacerte sentir que eres lo más importante.
        </p>

        {/* ── CTAs ──────────────────────────────────────────────────── */}
        <div className="flex items-center gap-10">
          <Link
            href="/el-salon"
            className="font-secondary text-[11px] uppercase tracking-[0.2em] text-navy/60 underline underline-offset-4 decoration-1 hover:text-navy transition-colors duration-150"
          >
            Conoce el salón
          </Link>
          <Link
            href="/reservar-cita"
            className="font-secondary text-[11px] uppercase tracking-[0.2em] text-navy/60 underline underline-offset-4 decoration-1 hover:text-navy transition-colors duration-150"
          >
            Reservar cita
          </Link>
        </div>

      </div>
    </section>
  )
}
