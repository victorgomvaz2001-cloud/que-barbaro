'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import type { IGalleryPhoto } from '@falcanna/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
const ASPECT_RATIOS = ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[4/5]', 'aspect-[3/4]'];

export default function GaleriaGrid() {
  const t = useTranslations('galeria');
  const allCategoriesLabel = t('hero.allCategories');
  const categories = t.raw('hero.categories') as string[];

  const [activeCategory, setActiveCategory] = useState('');
  const [photos, setPhotos] = useState<IGalleryPhoto[]>([]);

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
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6">
            {filteredImages.map((photo, index) => (
              <div key={photo._id} className="break-inside-avoid">
                <div className={`relative group overflow-hidden ${ASPECT_RATIOS[index % ASPECT_RATIOS.length]}`}>
                  <Image
                    src={photo.url}
                    alt={photo.alt || photo.category}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Bottom label overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/60 to-transparent px-4 py-3">
                    <span className="font-neue uppercase tracking-[0.18em] text-cream/80 text-[9px]">
                      {photo.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
