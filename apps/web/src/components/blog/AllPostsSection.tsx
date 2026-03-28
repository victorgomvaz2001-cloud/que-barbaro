'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import type { IBlogPost, BlogPageResponse } from '@falcanna/types'
import BlogCard from './BlogCard'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'
const BATCH = 9

interface Filters {
  q: string
  date: string
  sort: string
  category: string
}

interface Props {
  locale: string
  categories: string[]
  labels: {
    title: string
    allCategories: string
    searchPlaceholder: string
    filterDate: string
    sortLabel: string
    sortDateDesc: string
    sortDateAsc: string
    sortAlphaAsc: string
    sortAlphaDesc: string
    loadMore: string
    noResults: string
  }
}

async function fetchPosts(
  locale: string,
  filters: Filters,
  offset: number,
): Promise<BlogPageResponse> {
  const params = new URLSearchParams({ offset: String(offset), limit: String(BATCH), locale })
  if (filters.q)        params.set('q', filters.q)
  if (filters.date)     params.set('date', filters.date)
  if (filters.sort)     params.set('sort', filters.sort)
  if (filters.category) params.set('category', filters.category)
  const res = await fetch(`${API_URL}/blog/page?${params.toString()}`)
  if (!res.ok) return { data: [], total: 0, hasMore: false }
  return res.json()
}

export default function AllPostsSection({ locale, categories, labels }: Props) {
  const [posts, setPosts]       = useState<IBlogPost[]>([])
  const [hasMore, setHasMore]   = useState(false)
  const [offset, setOffset]     = useState(0)
  const [filters, setFilters]   = useState<Filters>({ q: '', date: '', sort: 'date-desc', category: '' })
  const [pending, startTransition] = useTransition()
  const [loadingMore, setLoadingMore] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fetch on filter change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const result = await fetchPosts(locale, filters, 0)
        setPosts(result.data)
        setHasMore(result.hasMore)
        setOffset(result.data.length)
      })
    }, 250)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [locale, filters])

  async function handleLoadMore() {
    setLoadingMore(true)
    const result = await fetchPosts(locale, filters, offset)
    setPosts((prev) => [...prev, ...result.data])
    setHasMore(result.hasMore)
    setOffset((prev) => prev + result.data.length)
    setLoadingMore(false)
  }

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function setCategory(cat: string) {
    setFilters((prev) => ({ ...prev, category: cat }))
  }

  const hasSecondaryFilters = filters.q !== '' || filters.date !== '' || filters.sort !== 'date-desc'

  function clearAll() {
    setFilters({ q: '', date: '', sort: 'date-desc', category: '' })
  }

  return (
    <section className="w-full bg-cream">

      {/* ── Category filter bar ──────────────────────────────────────── */}
      <div className="sticky top-[60px] z-30 bg-cream/95 backdrop-blur-sm border-b border-navy/8">
        <div className="mx-auto max-w-[1680px] px-8 md:px-12">
          <div
            className="flex items-center gap-1 overflow-x-auto py-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* "All" pill */}
            <button
              onClick={() => setCategory('')}
              className="shrink-0 transition-all duration-200"
              style={{
                fontFamily: 'inherit',
                padding: '0.3rem 1rem',
                fontSize: '10px',
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                borderRadius: 0,
                border: filters.category === ''
                  ? '1px solid rgb(1,10,73)'
                  : '1px solid rgba(1,10,73,0.15)',
                backgroundColor: filters.category === '' ? 'rgb(1,10,73)' : 'transparent',
                color: filters.category === '' ? '#F6F4F1' : 'rgba(1,10,73,0.45)',
              }}
            >
              {labels.allCategories}
            </button>

            {/* Category pills */}
            {categories.map((cat) => {
              const active = filters.category === cat
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(active ? '' : cat)}
                  className="shrink-0 transition-all duration-200"
                  style={{
                    fontFamily: 'inherit',
                    padding: '0.3rem 1rem',
                    fontSize: '10px',
                    fontWeight: 400,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    borderRadius: 0,
                    border: active
                      ? '1px solid #fe5100'
                      : '1px solid rgba(1,10,73,0.15)',
                    backgroundColor: active ? '#fe5100' : 'transparent',
                    color: active ? '#F6F4F1' : 'rgba(1,10,73,0.45)',
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1680px] px-8 py-16 md:px-12 md:py-20">

        {/* Secondary filter row: search + date + sort */}
        <div className="mb-12 flex flex-wrap items-center gap-3">

          {/* Search */}
          <div className="min-w-[200px] flex-1">
            <input
              type="search"
              placeholder={labels.searchPlaceholder}
              value={filters.q}
              onChange={(e) => updateFilter('q', e.target.value)}
              className="w-full border-b border-navy/20 bg-transparent pb-2 font-neue font-light text-sm text-navy placeholder-navy/30 focus:border-navy focus:outline-none"
            />
          </div>

          {/* Date filter */}
          <input
            type="month"
            value={filters.date}
            onChange={(e) => updateFilter('date', e.target.value)}
            aria-label={labels.filterDate}
            className="border-b border-navy/20 bg-transparent pb-2 font-neue font-light text-sm text-navy focus:border-navy focus:outline-none"
          />

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            aria-label={labels.sortLabel}
            className="border-b border-navy/20 bg-transparent pb-2 font-neue font-light text-sm text-navy focus:border-navy focus:outline-none"
          >
            <option value="date-desc">{labels.sortDateDesc}</option>
            <option value="date-asc">{labels.sortDateAsc}</option>
            <option value="alpha-asc">{labels.sortAlphaAsc}</option>
            <option value="alpha-desc">{labels.sortAlphaDesc}</option>
          </select>

          {/* Clear all */}
          {(hasSecondaryFilters || filters.category) && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 font-neue font-light text-xs uppercase tracking-[0.18em] text-navy/40 transition-colors hover:text-navy"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
              Borrar
            </button>
          )}
        </div>

        {/* Grid */}
        {pending ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] bg-navy/5" />
                <div className="mt-5 h-4 w-2/3 bg-navy/10" />
                <div className="mt-2 h-3 w-full bg-navy/5" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="py-16 text-center font-neue font-light text-sm uppercase tracking-[0.2em] text-navy/30">
            {labels.noResults}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !pending && (
          <div className="mt-16 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="border border-navy/30 px-10 py-3 font-neue font-light text-[10px] uppercase tracking-[0.25em] text-navy transition-all duration-300 hover:border-navy hover:bg-navy hover:text-cream disabled:opacity-40"
            >
              {loadingMore ? '…' : labels.loadMore}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
