'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/admin/Button'
import { useToast } from '@/components/admin/Toast'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import type {
  ApiListResponse,
  ApiResponse,
  IGalleryCategory,
  IGalleryCategoryCreate,
  IGalleryPhoto,
} from '@falcanna/types'

// ── Category form modal ────────────────────────────────────────────────────────

function CategoryFormModal({
  category,
  onSave,
  onClose,
}: {
  category?: IGalleryCategory
  onSave: (data: IGalleryCategoryCreate) => Promise<void>
  onClose: () => void
}) {
  const [slug,          setSlug]          = useState(category?.slug ?? '')
  const [nameEs,        setNameEs]        = useState(category?.nameEs ?? '')
  const [nameEn,        setNameEn]        = useState(category?.nameEn ?? '')
  const [descriptionEs, setDescriptionEs] = useState(category?.descriptionEs ?? '')
  const [descriptionEn, setDescriptionEn] = useState(category?.descriptionEn ?? '')
  const [order,         setOrder]         = useState(category?.order ?? 0)
  const [saving,        setSaving]        = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({ slug, nameEs, nameEn, descriptionEs, descriptionEn, order })
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{category ? 'Editar categoría' : 'Nueva categoría'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Slug (identificador único)</label>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="cortes-peinados"
                required
                disabled={!!category}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Orden</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Nombre (ES)</label>
              <input
                value={nameEs}
                onChange={(e) => setNameEs(e.target.value)}
                placeholder="Cortes y peinados"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Nombre (EN)</label>
              <input
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="Cuts & styling"
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Descripción (ES)</label>
            <textarea
              value={descriptionEs}
              onChange={(e) => setDescriptionEs(e.target.value)}
              rows={2}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Descripción (EN)</label>
            <textarea
              value={descriptionEn}
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={2}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={saving}>{category ? 'Guardar cambios' : 'Crear categoría'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Category photos panel ─────────────────────────────────────────────────────

function CategoryPhotosPanel({
  category,
  onClose,
}: {
  category: IGalleryCategory
  onClose: () => void
}) {
  const { success, error } = useToast()
  const [photos, setPhotos]           = useState<IGalleryPhoto[]>([])
  const [loading, setLoading]         = useState(true)
  const [pickerOpen, setPickerOpen]   = useState(false)

  useEffect(() => {
    setLoading(true)
    apiClient
      .get<ApiListResponse<IGalleryPhoto>>(`/gallery/admin/list?section=services`)
      .then((res) => setPhotos(res.data.filter((p) => p.category === category.slug)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [category.slug])

  async function handleAddMultiple(urls: string[]) {
    setPickerOpen(false)
    let added = 0
    for (const url of urls) {
      try {
        const res = await apiClient.post<ApiResponse<IGalleryPhoto>>('/gallery/admin', {
          url,
          section: 'services',
          category: category.slug,
          order: photos.length + added,
          visible: true,
        })
        setPhotos((prev) => [res.data, ...prev])
        added++
      } catch { /* continue */ }
    }
    if (added > 0) success(`${added} foto${added !== 1 ? 's' : ''} añadida${added !== 1 ? 's' : ''}`)
  }

  async function handleToggleVisible(photo: IGalleryPhoto) {
    try {
      const res = await apiClient.put<ApiResponse<IGalleryPhoto>>(`/gallery/admin/${photo._id}`, { visible: !photo.visible })
      setPhotos((prev) => prev.map((p) => (p._id === photo._id ? res.data : p)))
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error', 'Error')
    }
  }

  async function handleDelete(photo: IGalleryPhoto) {
    if (!confirm('¿Eliminar esta foto?')) return
    try {
      await apiClient.delete(`/gallery/admin/${photo._id}`)
      setPhotos((prev) => prev.filter((p) => p._id !== photo._id))
      success('Foto eliminada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    }
  }

  return (
    <>
      {pickerOpen && (
        <MediaPickerModal
          open
          folder="gallery"
          multiple
          onClose={() => setPickerOpen(false)}
          onSelectMultiple={handleAddMultiple}
          onSelect={(url) => handleAddMultiple([url])}
        />
      )}

      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="sticky top-0 bg-white flex items-center justify-between border-b border-gray-100 px-6 py-4 z-10">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Fotos — {category.nameEs}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Sección: services · Categoría: {category.slug}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => setPickerOpen(true)}>+ Añadir fotos</Button>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <p className="text-sm text-gray-400">Cargando...</p>
            ) : photos.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-16">
                <p className="text-sm text-gray-400 mb-4">No hay fotos en esta categoría</p>
                <Button onClick={() => setPickerOpen(true)}>+ Añadir primera foto</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((photo) => (
                  <div key={photo._id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo.url} alt={photo.alt} className="h-32 w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100">
                      <button onClick={() => handleDelete(photo)} className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600">Eliminar</button>
                    </div>
                    <button
                      onClick={() => handleToggleVisible(photo)}
                      className={`absolute right-1.5 top-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${photo.visible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                    >
                      {photo.visible ? 'Visible' : 'Oculta'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ServiceCategoryManager() {
  const { success, error } = useToast()
  const [categories, setCategories]         = useState<IGalleryCategory[]>([])
  const [loading, setLoading]               = useState(true)
  const [formOpen, setFormOpen]             = useState(false)
  const [editingCat, setEditingCat]         = useState<IGalleryCategory | null>(null)
  const [photosPanelCat, setPhotosPanelCat] = useState<IGalleryCategory | null>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    apiClient
      .get<ApiListResponse<IGalleryCategory>>('/gallery/admin/categories')
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  async function handleCreate(data: IGalleryCategoryCreate) {
    try {
      const res = await apiClient.post<ApiResponse<IGalleryCategory>>('/gallery/admin/categories', data)
      setCategories((prev) => [...prev, res.data].sort((a, b) => a.order - b.order))
      success('Categoría creada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al crear', 'Error')
    } finally {
      setFormOpen(false)
    }
  }

  async function handleUpdate(cat: IGalleryCategory, data: Partial<IGalleryCategoryCreate>) {
    try {
      const res = await apiClient.put<ApiResponse<IGalleryCategory>>(`/gallery/admin/categories/${cat._id}`, data)
      setCategories((prev) => prev.map((c) => (c._id === cat._id ? res.data : c)))
      success('Categoría actualizada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al actualizar', 'Error')
    } finally {
      setEditingCat(null)
    }
  }

  async function handleToggleActive(cat: IGalleryCategory) {
    try {
      const res = await apiClient.put<ApiResponse<IGalleryCategory>>(`/gallery/admin/categories/${cat._id}`, { active: !cat.active })
      setCategories((prev) => prev.map((c) => (c._id === cat._id ? res.data : c)))
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error', 'Error')
    }
  }

  async function handleDelete(cat: IGalleryCategory) {
    if (!confirm(`¿Eliminar la categoría "${cat.nameEs}"? Las fotos asociadas NO se eliminarán.`)) return
    try {
      await apiClient.delete(`/gallery/admin/categories/${cat._id}`)
      setCategories((prev) => prev.filter((c) => c._id !== cat._id))
      success('Categoría eliminada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    }
  }

  return (
    <>
      {formOpen && (
        <CategoryFormModal
          onSave={handleCreate}
          onClose={() => setFormOpen(false)}
        />
      )}
      {editingCat && (
        <CategoryFormModal
          category={editingCat}
          onSave={(data) => handleUpdate(editingCat, data)}
          onClose={() => setEditingCat(null)}
        />
      )}
      {photosPanelCat && (
        <CategoryPhotosPanel
          category={photosPanelCat}
          onClose={() => setPhotosPanelCat(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {loading ? 'Cargando...' : `${categories.length} categoría${categories.length !== 1 ? 's' : ''}`}
        </p>
        <Button onClick={() => setFormOpen(true)}>+ Nueva categoría</Button>
      </div>

      {/* Category list */}
      {loading ? (
        <p className="text-sm text-gray-400">Cargando...</p>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
          <p className="text-sm text-gray-400 mb-4">No hay categorías de galería</p>
          <Button onClick={() => setFormOpen(true)}>+ Crear primera categoría</Button>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3"
            >
              {/* Order badge */}
              <span className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-500">
                {cat.order}
              </span>

              {/* Names */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{cat.nameEs}</p>
                <p className="text-xs text-gray-400 truncate">{cat.nameEn} · <span className="font-mono">{cat.slug}</span></p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(cat)}
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors ${cat.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                >
                  {cat.active ? 'Activa' : 'Inactiva'}
                </button>
                <button
                  onClick={() => setPhotosPanelCat(cat)}
                  className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  Fotos
                </button>
                <button
                  onClick={() => setEditingCat(cat)}
                  className="rounded border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-gray-400 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="rounded border border-gray-200 px-2.5 py-1 text-xs text-red-400 hover:border-red-400 hover:text-red-600 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
