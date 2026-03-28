import Image from 'next/image'
import { getTranslations } from 'next-intl/server'

export default async function ExperienceSection() {
  const t = await getTranslations('experienceSection')

  return (
    <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .experience-marquee {
          animation: marquee 22s linear infinite;
        }
      `}</style>

      <section className="bg-cream w-full overflow-hidden py-24 relative">

        <div className="mx-auto max-w-7xl px-8">

          {/* ── Label ─────────────────────────────────────────────────── */}
          <p className="font-secondary text-[10px] uppercase tracking-[0.3em] text-navy/35 mb-14">
            {t('label')}
          </p>

          {/* ── H2 cascading + image right ────────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-center w-full">

            {/* H2 */}
            <h2 className="flex-1 font-primary text-[clamp(2.6rem,7.5vw,6.5rem)] leading-[0.93] tracking-tight text-navy uppercase">
              <span className="block" style={{ paddingLeft: '0' }}>{t('h2L1')}</span>
              <span className="block" style={{ paddingLeft: '7vw' }}>{t('h2L2')}</span>
              <span className="block" style={{ paddingLeft: '1vw' }}>{t('h2L3')}</span>
              <span className="block" style={{ paddingLeft: '11vw' }}>{t('h2L4')}</span>
              <span className="block text-navy/25" style={{ paddingLeft: '3vw' }}>{t('h2L5')}</span>
            </h2>

            {/* Divider */}
            <div className="hidden md:flex justify-center items-stretch w-16 shrink-0 self-stretch">
              <div className="w-px bg-navy/20" />
            </div>

            {/* Image — salon3, flush right, full height of row */}
            <div className="relative shrink-0 w-full md:w-[38%] self-stretch min-h-[300px] overflow-hidden mt-10 md:mt-0 md:-mr-8">
              <Image
                src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/gallery/1774688213868-salon3.webp"
                alt="Interior del salón Qué Bárbaro en Torremolinos"
                fill
                sizes="(max-width: 768px) 100vw, 38vw"
                className="object-cover object-left"
              />
            </div>

          </div>

        </div>

        {/* ── Marquee ticker ────────────────────────────────────────── */}
        <div className="mt-16 mb-16 border-t border-b border-navy/10 py-[14px] overflow-hidden">
          <div className="experience-marquee flex whitespace-nowrap">
            <span className="font-secondary text-[10px] uppercase tracking-[0.28em] text-navy/30">
              {t('ticker').repeat(6)}
            </span>
            <span className="font-secondary text-[10px] uppercase tracking-[0.28em] text-navy/30" aria-hidden>
              {t('ticker').repeat(6)}
            </span>
          </div>
        </div>

        {/* ── 4-photo salon strip ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-16 -mx-8 md:-mx-0">
          {[
            { src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/gallery/1774688213834-sillones.webp', alt: 'Sillones del salón' },
            { src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/gallery/1774688213899-mostrador.webp', alt: 'Mostrador de Qué Bárbaro' },
            { src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/gallery/1774688213917-salon2.webp', alt: 'Espacio interior del salón' },
            { src: 'https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/gallery/1774688213868-salon3.webp', alt: 'Zona de trabajo del salón' },
          ].map((img) => (
            <div key={img.src} className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>

        {/* ── Body paragraphs + image left ──────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-center w-full">

          {/* Image — flush left */}
          <div className="relative shrink-0 w-full md:w-[40%] aspect-[4/3] overflow-hidden mb-10 md:mb-0">
            <Image
              src="https://cavidas-que-barbaro.s3.eu-north-1.amazonaws.com/experience1.webp"
              alt="Detalle del servicio en Qué Bárbaro"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-center"
            />
          </div>

          {/* Divider — centered between image and text */}
          <div className="hidden md:flex justify-center items-stretch w-16 shrink-0 self-stretch">
            <div className="w-px bg-navy/20" />
          </div>

          {/* Párrafos apilados */}
          <div className="flex-1 flex flex-col gap-8 px-8 md:pr-16">
            <p className="font-neue font-light text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-navy/60">
              {t('body1')}
            </p>
            <p className="font-neue font-light text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-navy/60">
              {t('body2')}
            </p>
          </div>

        </div>

      </section>
    </>
  )
}
