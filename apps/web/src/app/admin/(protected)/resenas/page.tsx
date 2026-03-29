'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/admin/Toast'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import type { ApiListResponse, ApiResponse, IReview, IReviewCreate } from '@falcanna/types'

/* ── Star rating display ─────────────────────────────────────────────────── */

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24"
          fill={i < rating ? '#f59e0b' : 'none'}
          stroke={i < rating ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </span>
  )
}

/* ── Interactive star picker ─────────────────────────────────────────────── */

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < (hovered || value)
        return (
          <button key={i} type="button"
            onMouseEnter={() => setHovered(i + 1)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i + 1)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24"
              fill={filled ? '#f59e0b' : 'none'}
              stroke={filled ? '#f59e0b' : '#d1d5db'} strokeWidth="1.5">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        )
      })}
    </span>
  )
}

/* ── Add review modal ────────────────────────────────────────────────────── */

function AddReviewModal({
  onSave,
  onClose,
}: {
  onSave: (data: IReviewCreate) => Promise<void>
  onClose: () => void
}) {
  const [authorName, setAuthorName]       = useState('')
  const [rating, setRating]               = useState(5)
  const [text, setText]                   = useState('')
  const [relativeTime, setRelativeTime]   = useState('')
  const [photoMode, setPhotoMode]         = useState<'url' | 's3'>('url')
  const [photoUrl, setPhotoUrl]           = useState('')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [saving, setSaving]               = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!authorName.trim() || !text.trim()) return
    setSaving(true)
    await onSave({
      authorName:     authorName.trim(),
      rating,
      text:           text.trim(),
      relativeTime:   relativeTime.trim(),
      authorPhotoUrl: photoUrl.trim(),
    })
    setSaving(false)
  }

  return (
    <>
      <MediaPickerModal
        open={mediaPickerOpen}
        folder="reviews"
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => { setPhotoUrl(url); setMediaPickerOpen(false) }}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>

          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">Añadir reseña manual</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del cliente *</label>
              <input
                value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Ej: Carmen R."
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Valoración *</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            {/* Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reseña *</label>
              <textarea
                value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Texto de la reseña..."
                rows={4} required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
              />
            </div>

            {/* Relative time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha (texto libre)</label>
              <input
                value={relativeTime} onChange={(e) => setRelativeTime(e.target.value)}
                placeholder="Ej: hace 2 semanas"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Foto del cliente</label>

              {/* Mode toggle */}
              <div className="flex rounded border border-gray-200 mb-3 overflow-hidden text-sm">
                <button type="button"
                  onClick={() => setPhotoMode('url')}
                  className={`flex-1 py-1.5 text-center transition-colors ${photoMode === 'url' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  URL externa
                </button>
                <button type="button"
                  onClick={() => setPhotoMode('s3')}
                  className={`flex-1 py-1.5 text-center transition-colors ${photoMode === 's3' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  Subir foto
                </button>
              </div>

              {photoMode === 'url' ? (
                <input
                  value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://..."
                  type="url"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <button type="button"
                    onClick={() => setMediaPickerOpen(true)}
                    className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {photoUrl ? 'Cambiar foto' : 'Seleccionar foto'}
                  </button>
                  {photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt="Preview" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={saving}
                className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50">
                {saving ? 'Guardando...' : 'Añadir reseña'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */

export default function AdminResenasPage() {
  const { success, error } = useToast()
  const [reviews, setReviews]       = useState<IReview[]>([])
  const [loading, setLoading]       = useState(true)
  const [syncing, setSyncing]       = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)

  useEffect(() => {
    apiClient
      .get<ApiListResponse<IReview>>('/reviews/admin/list')
      .then((res) => setReviews(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await apiClient.post<ApiListResponse<IReview>>('/reviews/admin/sync')
      setReviews(res.data)
      success('Reseñas sincronizadas desde Google')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al sincronizar', 'Error')
    } finally {
      setSyncing(false)
    }
  }

  async function handleAdd(data: IReviewCreate) {
    try {
      const res = await apiClient.post<ApiResponse<IReview>>('/reviews/admin', data)
      setReviews((prev) => [res.data, ...prev])
      setAddModalOpen(false)
      success('Reseña añadida')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al añadir', 'Error')
    }
  }

  async function handleToggleSelected(review: IReview) {
    const newSelected = !review.selected
    setReviews((prev) => prev.map((r) => (r._id === review._id ? { ...r, selected: newSelected } : r)))
    try {
      await apiClient.put<ApiResponse<IReview>>(`/reviews/admin/${review._id}`, { selected: newSelected })
      success(newSelected ? 'Reseña activada en testimonials' : 'Reseña desactivada')
    } catch (err) {
      setReviews((prev) => prev.map((r) => (r._id === review._id ? { ...r, selected: review.selected } : r)))
      error(err instanceof Error ? err.message : 'Error', 'Error')
    }
  }

  async function handleDelete(review: IReview) {
    if (!confirm(`¿Eliminar la reseña de ${review.authorName}?`)) return
    try {
      await apiClient.delete(`/reviews/admin/${review._id}`)
      setReviews((prev) => prev.filter((r) => r._id !== review._id))
      success('Reseña eliminada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    }
  }

  const selectedCount = reviews.filter((r) => r.selected).length

  return (
    <div>
      {addModalOpen && (
        <AddReviewModal onSave={handleAdd} onClose={() => setAddModalOpen(false)} />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reseñas</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-gray-400">
              {selectedCount} activas en testimonials · {reviews.length} total
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            + Añadir manual
          </button>
          <button
            onClick={handleSync} disabled={syncing}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 disabled:opacity-50"
          >
            {syncing ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
                Sincronizando...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M23 4v6h-6M1 20v-6h6" />
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                </svg>
                Sincronizar con Google
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="mb-6 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
        Activa las reseñas que quieres mostrar en la sección de testimonials. Los cambios se aplican de inmediato.
      </div>

      {loading && <p className="text-gray-500">Cargando...</p>}

      {!loading && reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-24">
          <svg className="mb-4 h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <p className="mb-1 text-sm font-medium text-gray-500">No hay reseñas guardadas</p>
          <p className="mb-4 text-xs text-gray-400">Sincroniza con Google o añade una manualmente</p>
          <div className="flex gap-2">
            <button onClick={() => setAddModalOpen(true)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Añadir manual
            </button>
            <button onClick={handleSync} disabled={syncing}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50">
              Sincronizar con Google
            </button>
          </div>
        </div>
      )}

      {!loading && reviews.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review._id}
              className={`relative flex flex-col gap-4 rounded-xl border p-5 transition-all duration-200 ${
                review.selected ? 'border-green-200 bg-green-50 shadow-sm' : 'border-gray-200 bg-white'
              }`}
            >
              {/* Badges */}
              <div className="absolute right-4 top-4 flex items-center gap-1.5">
                {review.source === 'manual' && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    Manual
                  </span>
                )}
                {review.selected && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700">
                    Activa
                  </span>
                )}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pr-20">
                {review.authorPhotoUrl ? (
                  <Image src={review.authorPhotoUrl} alt={review.authorName}
                    width={40} height={40}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-white shrink-0"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-bold text-gray-500 shrink-0">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{review.authorName}</p>
                  <p className="text-[11px] text-gray-400">{review.relativeTime || '-'}</p>
                </div>
              </div>

              <StarRating rating={review.rating} />

              <p className="flex-1 text-sm leading-relaxed text-gray-700 line-clamp-4">{review.text}</p>

              {/* Actions */}
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleToggleSelected(review)}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    review.selected
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {review.selected ? '✓ Mostrando en web' : 'Mostrar en testimonials'}
                </button>
                {review.source === 'manual' && (
                  <button
                    onClick={() => handleDelete(review)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    title="Eliminar reseña"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
