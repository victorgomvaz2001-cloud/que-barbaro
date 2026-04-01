'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/admin/Toast'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import type { ApiListResponse, ApiResponse, IMention, IMentionCreate, IMentionConfig } from '@falcanna/types'

/* ── Mention form modal ──────────────────────────────────────────────────── */

function MentionModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: IMention
  onSave: (data: IMentionCreate & { visible?: boolean }) => Promise<void>
  onClose: () => void
}) {
  const [name,     setName]     = useState(initial?.name ?? '')
  const [logoUrl,  setLogoUrl]  = useState(initial?.logoUrl ?? '')
  const [link,     setLink]     = useState(initial?.link ?? '')
  const [visible,  setVisible]  = useState(initial?.visible ?? true)
  const [mediOpen, setMediOpen] = useState(false)
  const [saving,   setSaving]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !logoUrl.trim() || !link.trim()) return
    setSaving(true)
    await onSave({ name: name.trim(), logoUrl: logoUrl.trim(), link: link.trim(), order: initial?.order ?? 0, visible })
    setSaving(false)
  }

  return (
    <>
      <MediaPickerModal
        open={mediOpen}
        folder="mentions"
        onClose={() => setMediOpen(false)}
        onSelect={(url) => { setLogoUrl(url); setMediOpen(false) }}
      />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>

          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              {initial ? 'Editar mención' : 'Añadir mención'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">

            {/* Name (internal) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre interno <span className="text-gray-400 font-normal">(identificador, no visible en la web)</span>
              </label>
              <input
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Vogue España"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo *</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMediOpen(true)}
                  className="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {logoUrl ? 'Cambiar logo' : 'Seleccionar logo'}
                </button>
                {logoUrl && (
                  <div className="relative h-12 w-12 border border-gray-200 bg-gray-50">
                    <Image src={logoUrl} alt="Logo preview" fill className="object-contain p-1" />
                  </div>
                )}
              </div>
              {!logoUrl && (
                <input
                  value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="O pega una URL directamente…"
                  type="url"
                  className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              )}
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enlace a la publicación *</label>
              <input
                value={link} onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                type="url"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Visible */}
            {initial && (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${visible ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${visible ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-gray-700">Visible en la web</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={onClose}
                className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Cancelar
              </button>
              <button type="submit" disabled={saving || !logoUrl}
                className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50">
                {saving ? 'Guardando…' : (initial ? 'Guardar cambios' : 'Añadir mención')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */

export default function AdminMencionesPage() {
  const { success, error } = useToast()
  const [mentions,    setMentions]    = useState<IMention[]>([])
  const [config,      setConfig]      = useState<IMentionConfig>({ maxDisplay: 0 })
  const [loading,     setLoading]     = useState(true)
  const [addOpen,     setAddOpen]     = useState(false)
  const [editTarget,  setEditTarget]  = useState<IMention | null>(null)
  const [savingCfg,   setSavingCfg]   = useState(false)
  const [maxInput,    setMaxInput]    = useState(0)
  const [reordering,  setReordering]  = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    Promise.all([
      apiClient.get<ApiListResponse<IMention>>('/mentions/admin/list'),
      apiClient.get<ApiResponse<IMentionConfig>>('/mentions/admin/config'),
    ])
      .then(([listRes, cfgRes]) => {
        setMentions(listRes.data)
        setConfig(cfgRes.data)
        setMaxInput(cfgRes.data.maxDisplay)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleSaveConfig() {
    setSavingCfg(true)
    try {
      const res = await apiClient.put<ApiResponse<IMentionConfig>>('/mentions/admin/config', { maxDisplay: maxInput })
      setConfig(res.data)
      success('Configuración guardada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error', 'Error')
    } finally {
      setSavingCfg(false)
    }
  }

  async function handleAdd(data: IMentionCreate) {
    try {
      const res = await apiClient.post<ApiResponse<IMention>>('/mentions/admin', data)
      setMentions((prev) => [...prev, res.data].sort((a, b) => a.order - b.order))
      setAddOpen(false)
      success('Mención añadida')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al añadir', 'Error')
    }
  }

  async function handleEdit(data: Partial<IMention>) {
    if (!editTarget) return
    try {
      const res = await apiClient.put<ApiResponse<IMention>>(`/mentions/admin/${editTarget._id}`, data)
      setMentions((prev) => prev.map((m) => (m._id === editTarget._id ? res.data : m)))
      setEditTarget(null)
      success('Mención actualizada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al guardar', 'Error')
    }
  }

  async function handleToggleVisible(mention: IMention) {
    const newVisible = !mention.visible
    setMentions((prev) => prev.map((m) => (m._id === mention._id ? { ...m, visible: newVisible } : m)))
    try {
      await apiClient.put<ApiResponse<IMention>>(`/mentions/admin/${mention._id}`, { visible: newVisible })
      success(newVisible ? 'Mención visible en la web' : 'Mención ocultada')
    } catch (err) {
      setMentions((prev) => prev.map((m) => (m._id === mention._id ? { ...m, visible: mention.visible } : m)))
      error(err instanceof Error ? err.message : 'Error', 'Error')
    }
  }

  async function handleDelete(mention: IMention) {
    if (!confirm(`¿Eliminar la mención de "${mention.name}"?`)) return
    try {
      await apiClient.delete(`/mentions/admin/${mention._id}`)
      setMentions((prev) => prev.filter((m) => m._id !== mention._id))
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(mention._id as string); return next })
      success('Mención eliminada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    }
  }

  async function handleReorder(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= mentions.length) return
    const item = mentions[index]
    const target = mentions[targetIndex]
    if (!item || !target) return
    setReordering(true)
    try {
      await apiClient.put('/mentions/admin/reorder', { id1: item._id, id2: target._id })
      setMentions((prev) => {
        const next = [...prev]
        const o1 = item.order
        const o2 = target.order
        next[index] = { ...item, order: o2 } as typeof item
        next[targetIndex] = { ...target, order: o1 } as typeof target
        return next.sort((a, b) => a.order - b.order)
      })
    } finally { setReordering(false) }
  }

  async function handleBulkDelete() {
    if (!confirm(`¿Eliminar ${selectedIds.size} mención${selectedIds.size !== 1 ? 'es' : ''}?`)) return
    try {
      await apiClient.delete('/mentions/admin/bulk', { body: { ids: [...selectedIds] } })
      setMentions((prev) => prev.filter((m) => !selectedIds.has(m._id as string)))
      success(`${selectedIds.size} mención${selectedIds.size !== 1 ? 'es' : ''} eliminadas`)
      setSelectedIds(new Set())
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    }
  }

  const visibleCount = mentions.filter((m) => m.visible).length

  return (
    <div>
      {addOpen && (
        <MentionModal onSave={handleAdd} onClose={() => setAddOpen(false)} />
      )}
      {editTarget && (
        <MentionModal
          initial={editTarget}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menciones en prensa</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-gray-400">
              {visibleCount} visibles en web · {mentions.length} total
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
            >
              Eliminar seleccionados ({selectedIds.size})
            </button>
          )}
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
          >
            + Añadir mención
          </button>
        </div>
      </div>

      {/* Config */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-semibold text-gray-900 mb-3">Configuración de la sección</p>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-700">Máximo de menciones a mostrar</label>
            <input
              type="number"
              min={0}
              value={maxInput}
              onChange={(e) => setMaxInput(Number(e.target.value))}
              className="w-20 rounded border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <span className="text-xs text-gray-400">(0 = mostrar todas las visibles)</span>
          </div>
          <button
            onClick={handleSaveConfig}
            disabled={savingCfg || maxInput === config.maxDisplay}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 transition-colors"
          >
            {savingCfg ? 'Guardando…' : 'Guardar'}
          </button>
        </div>
      </div>

      {loading && <p className="text-gray-500">Cargando…</p>}

      {!loading && mentions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-24">
          <svg className="mb-4 h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 12h6M12 9v6" />
          </svg>
          <p className="mb-1 text-sm font-medium text-gray-500">No hay menciones todavía</p>
          <p className="mb-4 text-xs text-gray-400">Añade revistas, periódicos o blogs que hayan mencionado al salón</p>
          <button
            onClick={() => setAddOpen(true)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Añadir primera mención
          </button>
        </div>
      )}

      {!loading && mentions.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {mentions.map((mention, index) => (
            <div
              key={mention._id}
              className={`relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 ${
                mention.visible ? 'border-gray-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              {/* Checkbox (top-left overlay) */}
              <div className="absolute left-2 top-2" onClick={(e) => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={selectedIds.has(mention._id as string)}
                  onChange={(e) => {
                    setSelectedIds((prev) => {
                      const next = new Set(prev)
                      if (e.target.checked) next.add(mention._id as string)
                      else next.delete(mention._id as string)
                      return next
                    })
                  }}
                  className="h-4 w-4 rounded border-gray-300 accent-gray-900 cursor-pointer"
                />
              </div>

              {/* Logo */}
              <div className="relative h-16 w-16 shrink-0 border border-gray-100 bg-white ml-5">
                <Image
                  src={mention.logoUrl}
                  alt={mention.name}
                  fill
                  sizes="64px"
                  className="object-contain p-2"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-gray-900">{mention.name}</p>
                <a
                  href={mention.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-xs text-blue-500 hover:underline block"
                >
                  {mention.link}
                </a>
                <p className="mt-0.5 text-xs text-gray-400">Orden: {mention.order}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                {/* Order arrows */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0 || reordering}
                    className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Mover arriba"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === mentions.length - 1 || reordering}
                    className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Mover abajo"
                  >
                    ↓
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditTarget(mention)}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(mention)}
                    className="rounded border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50 transition-colors"
                    title="Eliminar"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => handleToggleVisible(mention)}
                  className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                    mention.visible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {mention.visible ? '✓ Visible' : 'Oculta'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
