'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { IGalleryPhoto } from '@falcanna/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
const ASPECT_RATIOS = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]'];

/* ─── Lightbox ──────────────────────────────────────────────────────────── */

function Lightbox({
  photos,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  photos: IGalleryPhoto[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const photo = photos[index]
  if (!photo) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Image container — stop propagation so clicking image doesn't close */}
      <div
        className="relative w-full h-full flex items-center justify-center px-4 md:px-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-4xl w-full max-h-[90vh] aspect-auto">
          <Image
            src={photo.url}
            alt={photo.alt || photo.category}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-contain"
            priority
          />
        </div>

        {/* Category label */}
        {photo.category && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <span className="font-neue uppercase tracking-[0.22em] text-cream/50 text-[10px]">
              {photo.category}
            </span>
          </div>
        )}
      </div>

      {/* Close button */}
      <button
        className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors duration-200"
        onClick={onClose}
        aria-label="Cerrar"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <line x1="2" y1="2" x2="18" y2="18" />
          <line x1="18" y1="2" x2="2" y2="18" />
        </svg>
      </button>

      {/* Prev button */}
      {index > 0 && (
        <button
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors duration-200"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Anterior"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      )}

      {/* Next button */}
      {index < photos.length - 1 && (
        <button
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-cream/60 hover:text-cream transition-colors duration-200"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Siguiente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
        <span className="font-neue text-cream/30 text-[10px] tracking-[0.2em]">
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </span>
      </div>
    </div>
  )
}

export default function GaleriaGrid() {
  const t = useTranslations('galeria');
  const allCategoriesLabel = t('hero.allCategories');
  const categories = t.raw('hero.categories') as string[];

  const [activeCategory, setActiveCategory] = useState('');
  const [photos, setPhotos] = useState<IGalleryPhoto[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/gallery/section/general`)
      .then((r) => r.ok ? r.json() : { data: [] })
      .then((json) => setPhotos(json.data ?? []))
      .catch(() => setPhotos([]))
  }, []);

  const filteredImages =
    activeCategory === ''
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() => setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i)), []);
  const nextPhoto = useCallback(() => setLightboxIndex((i) => (i !== null && i < filteredImages.length - 1 ? i + 1 : i)), [filteredImages.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'ArrowRight') nextPhoto();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, closeLightbox, prevPhoto, nextPhoto]);

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = '' };
  }, [lightboxIndex]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    const section = document.getElementById('galeria-grid');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="galeria-grid" className="bg-cream py-16 md:py-20">
      <div className="max-w-[1680px] mx-auto px-8 md:px-12">
        {/* Sticky category filter bar */}
        <div className="sticky top-[60px] z-20 bg-cream/95 backdrop-blur-sm border-b border-navy/8 -mx-8 md:-mx-12 px-8 md:px-12 py-4 mb-12">
          <div className="flex flex-row gap-2 overflow-x-auto scrollbar-none">
            {/* Todos pill */}
            <button
              onClick={() => handleCategoryClick('')}
              className={`font-neue uppercase tracking-[0.2em] text-[10px] px-4 py-1.5 border transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeCategory === ''
                  ? 'bg-navy text-cream border-navy'
                  : 'border-navy/15 text-navy/45'
              }`}
            >
              {allCategoriesLabel}
            </button>

            {/* Category pills */}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`font-neue uppercase tracking-[0.2em] text-[10px] px-4 py-1.5 border transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                  activeCategory === category
                    ? 'bg-orange text-cream border-orange'
                    : 'border-navy/15 text-navy/45'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Section header */}
        <div className="mb-8">
          <p className="font-neue uppercase tracking-[0.2em] text-[10px] text-orange mb-2">
            {t('grid.eyebrow')}
          </p>
          <h2 className="font-primary text-3xl md:text-4xl text-navy">
            {t('grid.title')}
          </h2>
        </div>

        {/* Image grid */}
        {filteredImages.length === 0 ? (
          <p className="font-neue uppercase tracking-[0.2em] text-navy/30 text-sm py-16 text-center">
            {t('grid.noImages')}
          </p>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
              {filteredImages.map((photo, index) => (
                <div key={photo._id} className="break-inside-avoid">
                  <button
                    type="button"
                    className={`relative group overflow-hidden w-full ${ASPECT_RATIOS[index % ASPECT_RATIOS.length]}`}
                    onClick={() => setLightboxIndex(index)}
                    aria-label={`Ver ${photo.alt || photo.category}`}
                  >
                    <Image
                      src={photo.url}
                      alt={photo.alt || photo.category}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Hover zoom hint */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    {/* Bottom label overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/60 to-transparent px-4 py-3">
                      <span className="font-neue uppercase tracking-[0.18em] text-cream/80 text-[9px]">
                        {photo.category}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
              <Lightbox
                photos={filteredImages}
                index={lightboxIndex}
                onClose={closeLightbox}
                onPrev={prevPhoto}
                onNext={nextPhoto}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
