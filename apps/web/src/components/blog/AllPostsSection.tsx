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
}

interface Props {
  locale: string
  labels: {
    title: string
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
  if (filters.q)    params.set('q', filters.q)
  if (filters.date) params.set('date', filters.date)
  if (filters.sort) params.set('sort', filters.sort)
  const res = await fetch(`${API_URL}/blog/page?${params.toString()}`)
  if (!res.ok) return { data: [], total: 0, hasMore: false }
  return res.json()
}

export default function AllPostsSection({ locale, labels }: Props) {
  const [posts, setPosts] = useState<IBlogPost[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [offset, setOffset] = useState(0)
  const [filters, setFilters] = useState<Filters>({ q: '', date: '', sort: 'date-desc' })
  const [pending, startTransition] = useTransition()
  const [loadingMore, setLoadingMore] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Initial fetch + filter changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      startTransition(async () => {
        const result = await fetchPosts(locale, filters, 0)
        setPosts(result.data)
        setHasMore(result.hasMore)
        setOffset(result.data.length)
      })
    }, 300)
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

  const hasActiveFilters = filters.q !== '' || filters.date !== '' || filters.sort !== 'date-desc'

  function clearFilters() {
    setFilters({ q: '', date: '', sort: 'date-desc' })
  }

  return (
    <section className="px-8 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-primary mb-10 text-4xl uppercase tracking-wide text-navy md:text-5xl">
          {labels.title}
        </h2>

        {/* Filter bar */}
        <div className="mb-10 flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="min-w-[220px] flex-1">
            <input
              type="search"
              placeholder={labels.searchPlaceholder}
              value={filters.q}
              onChange={(e) => updateFilter('q', e.target.value)}
              className="w-full rounded border border-navy/20 bg-transparent px-4 py-2.5 font-neue font-light text-sm text-navy placeholder-navy/40 focus:border-navy focus:outline-none"
            />
          </div>

          {/* Date filter */}
          <div>
            <input
              type="month"
              value={filters.date}
              onChange={(e) => {
                // Convert YYYY-MM to YYYY-MM prefix for API
                updateFilter('date', e.target.value)
              }}
              aria-label={labels.filterDate}
              className="rounded border border-navy/20 bg-transparent px-4 py-2.5 font-neue font-light text-sm text-navy focus:border-navy focus:outline-none"
            />
          </div>

          {/* Sort */}
          <div>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              aria-label={labels.sortLabel}
              className="rounded border border-navy/20 bg-white px-4 py-2.5 font-neue font-light text-sm text-navy focus:border-navy focus:outline-none"
            >
              <option value="date-desc">{labels.sortDateDesc}</option>
              <option value="date-asc">{labels.sortDateAsc}</option>
              <option value="alpha-asc">{labels.sortAlphaAsc}</option>
              <option value="alpha-desc">{labels.sortAlphaDesc}</option>
            </select>
          </div>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 font-neue font-light text-sm text-navy/50 underline underline-offset-2 transition-colors hover:text-navy"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l10 10M11 1L1 11" />
              </svg>
              Borrar filtros
            </button>
          )}
        </div>

        {/* Grid */}
        {pending ? (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[16/9] rounded bg-navy/5" />
                <div className="mt-5 h-4 w-2/3 rounded bg-navy/10" />
                <div className="mt-2 h-3 w-full rounded bg-navy/5" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="py-16 text-center font-neue font-light text-sm text-navy/40">{labels.noResults}</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
        )}

        {/* Load more */}
        {hasMore && !pending && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="rounded border border-navy px-8 py-3 font-neue font-light text-xs uppercase tracking-widest text-navy transition-colors hover:bg-navy hover:text-white disabled:opacity-50"
            >
              {loadingMore ? '…' : labels.loadMore}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
