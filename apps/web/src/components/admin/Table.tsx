'use client'

import { useState, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TableColumn<T> {
  /** Dot-notation key to read from the row object, e.g. "og.title" */
  key: string
  label: string
  /** Custom cell renderer. Falls back to string coercion. */
  render?: (value: unknown, row: T) => React.ReactNode
  /** Whether to allow sorting on this column. Defaults to true. */
  sortable?: boolean
  /** Extra className applied to <td> */
  className?: string
  /** Extra className applied to <th> */
  headerClassName?: string
}

export interface TableProps<T extends object> {
  columns: TableColumn<T>[]
  data: T[]
  /** Optional action buttons rendered in the last column */
  actions?: (row: T) => React.ReactNode
  /** Base file name used for CSV / JSON / PDF exports */
  exportFileName?: string
  /** Field used as React key (defaults to "_id") */
  keyField?: string
}

const PAGE_SIZES = [10, 25, 50] as const
type PageSize = (typeof PAGE_SIZES)[number]

// ─── Utilities ────────────────────────────────────────────────────────────────

function getValue(row: Record<string, unknown>, key: string): unknown {
  return key.split('.').reduce<unknown>((obj, k) => {
    if (obj !== null && typeof obj === 'object') return (obj as Record<string, unknown>)[k]
    return undefined
  }, row)
}

function coerce(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function getPageNumbers(total: number, current: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

// ─── Export helpers ───────────────────────────────────────────────────────────

function downloadBlob(content: string, mimeType: string, fileName: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}

function doExportCSV<T extends object>(
  columns: TableColumn<T>[],
  data: T[],
  fileName: string,
) {
  const header = columns.map((c) => `"${c.label}"`).join(',')
  const rows = data.map((row) =>
    columns
      .map((c) => `"${coerce(getValue(row as Record<string, unknown>, c.key)).replace(/"/g, '""')}"`)
      .join(','),
  )
  downloadBlob([header, ...rows].join('\n'), 'text/csv;charset=utf-8;', `${fileName}.csv`)
}

function doExportJSON<T extends object>(data: T[], fileName: string) {
  downloadBlob(JSON.stringify(data, null, 2), 'application/json', `${fileName}.json`)
}

function doExportPDF<T extends object>(
  columns: TableColumn<T>[],
  data: T[],
  fileName: string,
) {
  const headerCells = columns.map((c) => `<th>${c.label}</th>`).join('')
  const bodyRows = data
    .map(
      (row) =>
        `<tr>${columns
          .map(
            (c) =>
              `<td>${coerce(getValue(row as Record<string, unknown>, c.key))}</td>`,
          )
          .join('')}</tr>`,
    )
    .join('')

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${fileName}</title>
  <style>
    body{font-family:sans-serif;font-size:12px;padding:20px}
    h1{font-size:15px;margin-bottom:14px;color:#111827}
    table{width:100%;border-collapse:collapse}
    th{background:#f3f4f6;padding:6px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid #e5e7eb;color:#6b7280}
    td{padding:6px 10px;border-bottom:1px solid #f3f4f6;color:#374151}
    tr:nth-child(even) td{background:#f9fafb}
    @media print{body{padding:0}}
  </style></head>
  <body><h1>${fileName}</h1>
  <table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table>
  </body></html>`

  const win = window.open('', '_blank', 'width=900,height=700')
  if (!win) return
  win.document.write(html)
  win.document.close()
  win.focus()
  setTimeout(() => {
    win.print()
    win.close()
  }, 300)
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ state }: { state: 'asc' | 'desc' | null }) {
  if (!state)
    return (
      <svg
        className="ml-1 inline-block h-3 w-3 text-gray-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
      </svg>
    )
  return state === 'asc' ? (
    <svg
      className="ml-1 inline-block h-3 w-3 text-blue-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
  ) : (
    <svg
      className="ml-1 inline-block h-3 w-3 text-blue-500"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Table<T extends object>({
  columns,
  data,
  actions,
  exportFileName = 'export',
  keyField = '_id',
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [pageSize, setPageSize] = useState<PageSize>(10)
  const [page, setPage] = useState(1)

  // Sorted
  const sorted = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      const av = coerce(getValue(a as Record<string, unknown>, sortKey))
      const bv = coerce(getValue(b as Record<string, unknown>, sortKey))
      const cmp = av.localeCompare(bv, undefined, { numeric: true })
      return sortDir === 'asc' ? cmp : -cmp
    })
  }, [data, sortKey, sortDir])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paginated = useMemo(
    () => sorted.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sorted, safePage, pageSize],
  )

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
    setPage(1)
  }

  function handlePageSize(size: PageSize) {
    setPageSize(size)
    setPage(1)
  }

  const colCount = columns.length + (actions ? 1 : 0)
  const from = sorted.length === 0 ? 0 : (safePage - 1) * pageSize + 1
  const to = Math.min(safePage * pageSize, sorted.length)

  return (
    <div className="space-y-3">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Page size selector */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="hidden sm:inline">Show</span>
          <div className="flex gap-1">
            {PAGE_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => handlePageSize(size)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                  pageSize === size
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <span className="hidden sm:inline text-gray-400">entries</span>
        </div>

        {/* Export */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">Export:</span>
          <button
            onClick={() => doExportCSV(columns, sorted, exportFileName)}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            CSV
          </button>
          <button
            onClick={() => doExportJSON(sorted, exportFileName)}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            JSON
          </button>
          <button
            onClick={() => doExportPDF(columns, sorted, exportFileName)}
            className="rounded border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            PDF
          </button>
        </div>
      </div>

      {/* ── Table container ── */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* ── Desktop / Tablet (md+) ── */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                    className={[
                      'px-4 py-3 whitespace-nowrap',
                      col.sortable !== false
                        ? 'cursor-pointer select-none hover:bg-gray-100 transition-colors'
                        : '',
                      col.headerClassName ?? '',
                    ].join(' ')}
                  >
                    {col.label}
                    {col.sortable !== false && (
                      <SortIcon state={sortKey === col.key ? sortDir : null} />
                    )}
                  </th>
                ))}
                {actions && (
                  <th className="px-4 py-3 text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={colCount}
                    className="px-4 py-10 text-center text-sm text-gray-400"
                  >
                    No records found.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => {
                  const key = coerce(getValue(row as Record<string, unknown>, keyField)) || String(i)
                  return (
                    <tr
                      key={key}
                      className="transition-colors hover:bg-blue-50/50"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={['px-4 py-3 text-gray-700', col.className ?? ''].join(' ')}
                        >
                          {col.render
                            ? col.render(getValue(row as Record<string, unknown>, col.key), row)
                            : coerce(getValue(row as Record<string, unknown>, col.key))}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-3">
                            {actions(row)}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Mobile cards (< md) ── */}
        <div className="divide-y divide-gray-100 md:hidden">
          {paginated.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400">No records found.</p>
          ) : (
            paginated.map((row, i) => {
              const key = coerce(getValue(row as Record<string, unknown>, keyField)) || String(i)
              return (
                <div
                  key={key}
                  className="p-4 transition-colors hover:bg-blue-50/50"
                >
                  <dl className="space-y-2">
                    {columns.map((col) => (
                      <div key={col.key} className="flex flex-wrap gap-x-2 text-sm">
                        <dt className="min-w-[6rem] font-medium text-gray-500">{col.label}</dt>
                        <dd className="text-gray-800">
                          {col.render
                            ? col.render(getValue(row as Record<string, unknown>, col.key), row)
                            : coerce(getValue(row as Record<string, unknown>, col.key))}
                        </dd>
                      </div>
                    ))}
                  </dl>
                  {actions && (
                    <div className="mt-3 flex flex-wrap gap-3 border-t border-gray-100 pt-3">
                      {actions(row)}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* ── Pagination ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
        <span className="text-xs text-gray-400">
          {sorted.length === 0
            ? 'No results'
            : `Showing ${from}–${to} of ${sorted.length} results`}
        </span>

        <div className="flex items-center gap-1">
          {/* First */}
          <button
            onClick={() => setPage(1)}
            disabled={safePage === 1}
            aria-label="First page"
            className="rounded border border-gray-300 px-2 py-1 text-xs transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            «
          </button>
          {/* Prev */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            aria-label="Previous page"
            className="rounded border border-gray-300 px-2.5 py-1 text-xs transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            ‹ Prev
          </button>

          {/* Page numbers */}
          {getPageNumbers(totalPages, safePage).map((item, idx) =>
            item === '…' ? (
              <span key={`gap-${idx}`} className="px-1 text-gray-400">
                …
              </span>
            ) : (
              <button
                key={item}
                onClick={() => setPage(item)}
                className={[
                  'rounded border px-2.5 py-1 text-xs font-medium transition-colors',
                  safePage === item
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-gray-300 hover:bg-gray-50',
                ].join(' ')}
              >
                {item}
              </button>
            ),
          )}

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            aria-label="Next page"
            className="rounded border border-gray-300 px-2.5 py-1 text-xs transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            Next ›
          </button>
          {/* Last */}
          <button
            onClick={() => setPage(totalPages)}
            disabled={safePage === totalPages}
            aria-label="Last page"
            className="rounded border border-gray-300 px-2 py-1 text-xs transition-colors hover:bg-gray-50 disabled:opacity-40"
          >
            »
          </button>
        </div>
      </div>
    </div>
  )
}
