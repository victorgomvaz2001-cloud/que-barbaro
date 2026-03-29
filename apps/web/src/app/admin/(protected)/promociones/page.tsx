'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/admin/Toast'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import type {
  ApiListResponse,
  ApiResponse,
  IPromotion,
  IPromotionCreate,
} from '@falcanna/types'

/* ── Promotion form modal ─────────────────────────────────────────────────── */

function PromotionModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: IPromotion
  onSave: (data: IPromotionCreate) => Promise<void>
  onClose: () => void
}) {
  const [internalName,    setInternalName]    = useState(initial?.internalName ?? '')
  const [titleEs,         setTitleEs]         = useState(initial?.title.es ?? '')
  const [titleEn,         setTitleEn]         = useState(initial?.title.en ?? '')
  const [descriptionEs,   setDescriptionEs]   = useState(initial?.description.es ?? '')
  const [descriptionEn,   setDescriptionEn]   = useState(initial?.description.en ?? '')
  const [backgroundImage, setBackgroundImage] = useState(initial?.backgroundImage ?? '')
  const [buttonTextEs,    setButtonTextEs]    = useState(initial?.button.text.es ?? '')
  const [buttonTextEn,    setButtonTextEn]    = useState(initial?.button.text.en ?? '')
  const [buttonUrl,       setButtonUrl]       = useState(initial?.button.url ?? '')
  const [buttonTarget,    setButtonTarget]    = useState<'_self' | '_blank'>(initial?.button.target ?? '_self')
  const [position,        setPosition]        = useState<'top' | 'bottom'>(initial?.position ?? 'top')
  const [size,            setSize]            = useState<'s' | 'm' | 'l'>(initial?.size ?? 's')
  const [mediOpen,        setMediOpen]        = useState(false)
  const [saving,          setSaving]          = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!internalName.trim() || !titleEs.trim() || !titleEn.trim() || !backgroundImage.trim()) return
    setSaving(true)
    await onSave({
      internalName: internalName.trim(),
      title:        { es: titleEs.trim(), en: titleEn.trim() },
      description:  { es: descriptionEs.trim(), en: descriptionEn.trim() },
      backgroundImage: backgroundImage.trim(),
      button: {
        text:   { es: buttonTextEs.trim(), en: buttonTextEn.trim() },
        url:    buttonUrl.trim(),
        target: buttonTarget,
      },
      position,
      size,
    })
    setSaving(false)
  }

  return (
    <>
      <MediaPickerModal
        open={mediOpen}
        folder="promotions"
        onClose={() => setMediOpen(false)}
        onSelect={(url) => { setBackgroundImage(url); setMediOpen(false) }}
      />

      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              {initial ? 'Editar promoción' : 'Nueva promoción'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Internal name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre interno <span className="text-gray-400 font-normal">(solo visible en el dashboard)</span>
              </label>
              <input
                value={internalName}
                onChange={(e) => setInternalName(e.target.value)}
                placeholder="Ej: Promo verano 2025"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Title */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título (ES) *</label>
                <input
                  value={titleEs}
                  onChange={(e) => setTitleEs(e.target.value)}
                  placeholder="Ej: Oferta especial verano"
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título (EN) *</label>
                <input
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="Eg: Summer special offer"
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (ES)</label>
                <textarea
                  value={descriptionEs}
                  onChange={(e) => setDescriptionEs(e.target.value)}
                  placeholder="Ej: Reserva antes del 31 de agosto y obtén un 20% de descuento"
                  rows={2}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (EN)</label>
                <textarea
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Eg: Book before August 31st and get 20% off"
                  rows={2}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Background image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen de fondo *</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMediOpen(true)}
                  className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {backgroundImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
                </button>
                {backgroundImage && (
                  <div className="relative h-12 w-20 overflow-hidden rounded border border-gray-200">
                    <Image
                      src={backgroundImage}
                      alt="Preview"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Button */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Botón</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Texto (ES)</label>
                  <input
                    value={buttonTextEs}
                    onChange={(e) => setButtonTextEs(e.target.value)}
                    placeholder="Ej: Reservar ahora"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Texto (EN)</label>
                  <input
                    value={buttonTextEn}
                    onChange={(e) => setButtonTextEn(e.target.value)}
                    placeholder="Eg: Book now"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL</label>
                  <input
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Abrir en</label>
                  <select
                    value={buttonTarget}
                    onChange={(e) => setButtonTarget(e.target.value as '_self' | '_blank')}
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    <option value="_self">Misma pestaña</option>
                    <option value="_blank">Nueva pestaña</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Posición del banner</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="position"
                    value="top"
                    checked={position === 'top'}
                    onChange={() => setPosition('top')}
                    className="accent-gray-900"
                  />
                  <span className="text-sm text-gray-700">Parte superior</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="position"
                    value="bottom"
                    checked={position === 'bottom'}
                    onChange={() => setPosition('bottom')}
                    className="accent-gray-900"
                  />
                  <span className="text-sm text-gray-700">Parte inferior</span>
                </label>
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño del banner
                <span className="ml-1 text-xs text-gray-400 font-normal">— controla la altura y el tamaño del texto</span>
              </label>
              <div className="flex gap-3">
                {(['s', 'm', 'l'] as const).map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="size"
                      value={opt}
                      checked={size === opt}
                      onChange={() => setSize(opt)}
                      className="accent-gray-900"
                    />
                    <span className="text-sm text-gray-700">
                      {opt === 's' ? 'S — Pequeño' : opt === 'm' ? 'M — Mediano' : 'L — Grande'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || !internalName.trim() || !titleEs.trim() || !titleEn.trim() || !backgroundImage.trim()}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
              >
                {saving ? 'Guardando…' : initial ? 'Guardar cambios' : 'Crear promoción'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

export default function PromocionesPage() {
  const { success, error } = useToast()
  const [promotions,  setPromotions]  = useState<IPromotion[]>([])
  const [loading,     setLoading]     = useState(true)
  const [addOpen,     setAddOpen]     = useState(false)
  const [editTarget,  setEditTarget]  = useState<IPromotion | null>(null)

  useEffect(() => {
    apiClient
      .get<ApiListResponse<IPromotion>>('/promotions/admin/list')
      .then((res) => setPromotions(res.data ?? []))
      .catch(() => error('Error al cargar promociones', 'Error'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(data: IPromotionCreate) {
    try {
      const res = await apiClient.post<ApiResponse<IPromotion>>('/promotions/admin', data)
      setPromotions((prev) => [res.data, ...prev])
      setAddOpen(false)
      success('Promoción creada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al crear', 'Error')
    }
  }

  async function handleEdit(data: IPromotionCreate) {
    if (!editTarget) return
    try {
      const res = await apiClient.put<ApiResponse<IPromotion>>(`/promotions/admin/${editTarget._id}`, data)
      setPromotions((prev) => prev.map((p) => (p._id === editTarget._id ? res.data : p)))
      setEditTarget(null)
      success('Promoción actualizada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al guardar', 'Error')
    }
  }

  async function handleActivate(promotion: IPromotion) {
    // Optimistic update
    setPromotions((prev) =>
      prev.map((p) => ({ ...p, isActive: p._id === promotion._id })),
    )
    try {
      await apiClient.put<ApiResponse<IPromotion>>(`/promotions/admin/${promotion._id}/activate`)
      success(`"${promotion.internalName}" activada en la web`)
    } catch (err) {
      // Rollback
      setPromotions((prev) =>
        prev.map((p) => ({ ...p, isActive: p._id === promotion._id ? promotion.isActive : p.isActive })),
      )
      error(err instanceof Error ? err.message : 'Error', 'Error')
    }
  }

  async function handleDeactivate(promotion: IPromotion) {
    setPromotions((prev) =>
      prev.map((p) => (p._id === promotion._id ? { ...p, isActive: false } : p)),
    )
    try {
      await apiClient.put<ApiResponse<IPromotion>>(`/promotions/admin/${promotion._id}/deactivate`)
      success('Banner desactivado')
    } catch (err) {
      setPromotions((prev) =>
        prev.map((p) => (p._id === promotion._id ? { ...p, isActive: true } : p)),
      )
      error(err instanceof Error ? err.message : 'Error', 'Error')
    }
  }

  async function handleDelete(promotion: IPromotion) {
    if (!confirm(`¿Eliminar la promoción "${promotion.internalName}"?`)) return
    try {
      await apiClient.delete(`/promotions/admin/${promotion._id}`)
      setPromotions((prev) => prev.filter((p) => p._id !== promotion._id))
      success('Promoción eliminada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    }
  }

  const activePromotion = promotions.find((p) => p.isActive)

  return (
    <div>
      {addOpen && (
        <PromotionModal onSave={handleCreate} onClose={() => setAddOpen(false)} />
      )}
      {editTarget && (
        <PromotionModal
          initial={editTarget}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promociones</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-gray-400">
              {activePromotion
                ? `Banner activo: "${activePromotion.internalName}"`
                : 'Sin banner activo'}
              {' · '}{promotions.length} promoción{promotions.length !== 1 ? 'es' : ''} en total
            </p>
          )}
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          + Nueva promoción
        </button>
      </div>

      {/* Active banner preview */}
      {activePromotion && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
            Banner activo ahora
          </p>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold text-gray-900">{activePromotion.internalName}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Posición: {activePromotion.position === 'top' ? 'Parte superior' : 'Parte inferior'}
                {' · '}ES: {activePromotion.title.es}
                {' · '}EN: {activePromotion.title.en}
              </p>
            </div>
            <button
              onClick={() => handleDeactivate(activePromotion)}
              className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Desactivar banner
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500">Cargando…</p>}

      {!loading && promotions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-24">
          <svg className="mb-4 h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="7" width="20" height="10" rx="2" />
            <path d="M8 12h8M12 10v4" />
          </svg>
          <p className="mb-1 text-sm font-medium text-gray-500">No hay promociones todavía</p>
          <p className="mb-4 text-xs text-gray-400">Crea una promoción y actívala para mostrarla en el banner de la web</p>
          <button
            onClick={() => setAddOpen(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Crear primera promoción
          </button>
        </div>
      )}

      {!loading && promotions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {promotions.map((promotion) => (
            <div
              key={promotion._id}
              className={`relative rounded-xl border p-4 transition-all duration-200 ${
                promotion.isActive
                  ? 'border-green-300 bg-white ring-1 ring-green-200'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {/* Background image preview */}
              <div className="relative mb-3 h-28 w-full overflow-hidden rounded-lg bg-gray-100">
                {promotion.backgroundImage && (
                  <Image
                    src={promotion.backgroundImage}
                    alt={promotion.internalName}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1 px-3 text-center">
                  <p className="text-xs font-semibold text-white leading-tight line-clamp-1">
                    {promotion.title.es}
                  </p>
                  <p className="text-[10px] text-white/70 leading-tight line-clamp-1">
                    {promotion.description.es}
                  </p>
                </div>
                {promotion.isActive && (
                  <div className="absolute top-2 right-2 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    Activa
                  </div>
                )}
              </div>

              {/* Info */}
              <p className="text-sm font-semibold text-gray-900 truncate">{promotion.internalName}</p>
              <p className="mt-0.5 text-xs text-gray-400">
                {promotion.position === 'top' ? 'Superior' : 'Inferior'}
                {' · '}Tamaño: {(promotion.size ?? 's').toUpperCase()}
                {' · '}Botón: {promotion.button.text.es || '—'}
              </p>

              {/* Actions */}
              <div className="mt-3 flex items-center gap-2">
                {!promotion.isActive ? (
                  <button
                    onClick={() => handleActivate(promotion)}
                    className="flex-1 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition-colors"
                  >
                    Activar banner
                  </button>
                ) : (
                  <button
                    onClick={() => handleDeactivate(promotion)}
                    className="flex-1 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                  >
                    Desactivar
                  </button>
                )}
                <button
                  onClick={() => setEditTarget(promotion)}
                  className="rounded border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(promotion)}
                  disabled={promotion.isActive}
                  title={promotion.isActive ? 'Desactiva el banner antes de eliminar' : 'Eliminar'}
                  className="rounded border border-red-200 px-2 py-1.5 text-xs text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
