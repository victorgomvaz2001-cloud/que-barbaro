'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface PaginationProps {
  page: number
  totalPages: number
}

export default function Pagination({ page, totalPages }: PaginationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const navigate = useCallback(
    (p: number) => {
      const params = new URLSearchParams(searchParams.toString())
      if (p === 1) {
        params.delete('page')
      } else {
        params.set('page', String(p))
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-16 flex items-center justify-center gap-1 border-t border-navy/10 pt-10">
      <button
        onClick={() => navigate(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 text-xs uppercase tracking-widest text-navy/50 transition-colors hover:text-navy disabled:pointer-events-none disabled:opacity-20"
      >
        ← Anterior
      </button>

      <div className="flex items-center gap-1 px-4">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => navigate(p)}
            className={[
              'h-8 w-8 text-xs uppercase tracking-widest transition-colors',
              p === page
                ? 'bg-navy text-white'
                : 'text-navy/40 hover:text-navy',
            ].join(' ')}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => navigate(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 text-xs uppercase tracking-widest text-navy/50 transition-colors hover:text-navy disabled:pointer-events-none disabled:opacity-20"
      >
        Siguiente →
      </button>
    </nav>
  )
}
