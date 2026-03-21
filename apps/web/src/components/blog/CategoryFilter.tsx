'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface CategoryFilterProps {
  categories: string[]
  active: string | null
}

export default function CategoryFilter({ categories, active }: CategoryFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigate = useCallback(
    (cat: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('page') // reset pagination on filter change
      if (cat) {
        params.set('category', cat)
      } else {
        params.delete('category')
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  if (!categories.length) return null

  return (
    <div className="mb-12 flex flex-wrap items-center gap-2 border-b border-navy/10 pb-8">
      <button
        onClick={() => navigate(null)}
        className={[
          'px-4 py-1.5 text-xs uppercase tracking-widest transition-colors',
          !active
            ? 'bg-navy text-white'
            : 'border border-navy/20 text-navy/50 hover:border-navy hover:text-navy',
        ].join(' ')}
      >
        Todos
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => navigate(cat)}
          className={[
            'px-4 py-1.5 text-xs uppercase tracking-widest transition-colors',
            active === cat
              ? 'bg-navy text-white'
              : 'border border-navy/20 text-navy/50 hover:border-navy hover:text-navy',
          ].join(' ')}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
