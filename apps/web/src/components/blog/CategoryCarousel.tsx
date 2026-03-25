'use client'

import { useRef } from 'react'
import type { IBlogPost } from '@falcanna/types'
import BlogCard from './BlogCard'

interface Props {
  title: string
  description: string
  posts: IBlogPost[]
}

export default function CategoryCarousel({ title, description, posts }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(direction: 'left' | 'right') {
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.querySelector('li')?.offsetWidth ?? 320
    track.scrollBy({ left: direction === 'right' ? cardWidth + 32 : -(cardWidth + 32), behavior: 'smooth' })
  }

  return (
    <section className="border-b border-navy/10 px-8 py-14 md:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Header row */}
        <div className="mb-8 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-primary text-3xl uppercase tracking-wide text-navy md:text-4xl">
              {title}
            </h2>
            <p className="mt-2 font-neue font-light text-sm leading-relaxed text-navy/50">{description}</p>
          </div>
          {/* Arrow buttons */}
          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/20 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 3L5 8l5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Siguiente"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/20 text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 3l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable track */}
        {posts.length === 0 ? (
          <p className="py-8 font-neue font-light text-sm text-navy/30 italic">Próximamente artículos en esta categoría.</p>
        ) : (
          <div
            ref={trackRef}
            className="flex gap-8 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {posts.map((post) => (
              <div key={post._id} className="w-[300px] shrink-0 md:w-[340px]">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
