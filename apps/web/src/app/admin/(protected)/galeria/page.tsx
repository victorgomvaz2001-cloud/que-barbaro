'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/admin/Button'
import { useToast } from '@/components/admin/Toast'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import type {
  ApiListResponse,
  ApiResponse,
  IGalleryPhoto,
  IGalleryPhotoUpdate,
} from '@falcanna/types'

// ── Photo form modal (create + edit) ──────────────────────────────────────────

const CATEGORIES = ['Estilismo', 'Color', 'Corte', 'Tratamientos', 'Barbería', 'Beauty', 'Espacio', 'Otro']

function PhotoFormModal({
  url,
  photo,
  onSave,
  onClose,
}: {
  url?: string
  photo?: IGalleryPhoto
  onSave: (data: { alt: string; category: string; visible: boolean }) => Promise<void>
  onClose: () => void
}) {
  const [alt, setAlt]           = useState(photo?.alt ?? '')
  const [category, setCategory] = useState(photo?.category ?? '')
  const [visible, setVisible]   = useState(photo?.visible ?? true)
  const [saving, setSaving]     = useState(false)

  const previewSrc = url ?? photo?.url

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await onSave({ alt, category, visible })
    setSaving(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {photo ? 'Editar foto' : 'Añadir foto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Preview */}
          {previewSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewSrc}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-gray-200"
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción (alt text)
            </label>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Ej: Coloración balayage"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sin categoría</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={visible}
              onChange={(e) => setVisible(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Visible en la galería pública</span>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {photo ? 'Guardar cambios' : 'Añadir foto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Admin Gallery Page ─────────────────────────────────────────────────────────

export default function AdminGaleriaPage() {
  const { success, error } = useToast()
  const [photos, setPhotos]             = useState<IGalleryPhoto[]>([])
  const [loading, setLoading]           = useState(true)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [pendingUrl, setPendingUrl]     = useState<string | null>(null)
  const [editingPhoto, setEditingPhoto] = useState<IGalleryPhoto | null>(null)

  useEffect(() => {
    apiClient
      .get<ApiListResponse<IGalleryPhoto>>('/gallery/admin/list')
      .then((res) => setPhotos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  function handleMediaSelect(url: string) {
    setMediaPickerOpen(false)
    setPendingUrl(url)
  }

  async function handleSelectMultiple(urls: string[]) {
    setMediaPickerOpen(false)
    let added = 0
    for (const url of urls) {
      try {
        const res = await apiClient.post<ApiResponse<IGalleryPhoto>>('/gallery/admin', {
          url,
          order: photos.length + added,
        })
        setPhotos((prev) => [res.data, ...prev])
        added++
      } catch {
        // continue with the rest
      }
    }
    if (added > 0) success(`${added} foto${added !== 1 ? 's' : ''} añadida${added !== 1 ? 's' : ''} a la galería`)
  }

  async function handleCreate(data: { alt: string; category: string; visible: boolean }) {
    if (!pendingUrl) return
    try {
      const res = await apiClient.post<ApiResponse<IGalleryPhoto>>('/gallery/admin', {
        url: pendingUrl,
        alt: data.alt,
        category: data.category,
        visible: data.visible,
        order: photos.length,
      })
      setPhotos((prev) => [res.data, ...prev])
      success('Foto añadida a la galería')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al añadir foto', 'Error')
    } finally {
      setPendingUrl(null)
    }
  }

  async function handleUpdate(photo: IGalleryPhoto, data: IGalleryPhotoUpdate) {
    try {
      const res = await apiClient.put<ApiResponse<IGalleryPhoto>>(`/gallery/admin/${photo._id}`, data)
      setPhotos((prev) => prev.map((p) => (p._id === photo._id ? res.data : p)))
      success('Foto actualizada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al actualizar', 'Error')
    } finally {
      setEditingPhoto(null)
    }
  }

  async function handleToggleVisible(photo: IGalleryPhoto) {
    try {
      const res = await apiClient.put<ApiResponse<IGalleryPhoto>>(`/gallery/admin/${photo._id}`, {
        visible: !photo.visible,
      })
      setPhotos((prev) => prev.map((p) => (p._id === photo._id ? res.data : p)))
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error', 'Error')
    }
  }

  async function handleDelete(photo: IGalleryPhoto) {
    if (!confirm('¿Eliminar esta foto de la galería?')) return
    try {
      await apiClient.delete(`/gallery/admin/${photo._id}`)
      setPhotos((prev) => prev.filter((p) => p._id !== photo._id))
      success('Foto eliminada')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    }
  }

  return (
    <div>
      {/* Media picker */}
      <MediaPickerModal
        open={mediaPickerOpen}
        folder="gallery"
        multiple
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        onSelectMultiple={handleSelectMultiple}
      />

      {/* Create / edit modal */}
      {pendingUrl !== null && (
        <PhotoFormModal
          url={pendingUrl}
          onSave={handleCreate}
          onClose={() => setPendingUrl(null)}
        />
      )}
      {editingPhoto !== null && (
        <PhotoFormModal
          photo={editingPhoto}
          onSave={(data) => handleUpdate(editingPhoto, data)}
          onClose={() => setEditingPhoto(null)}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Galería</h1>
          {!loading && (
            <p className="mt-0.5 text-sm text-gray-400">
              {photos.filter((p) => p.visible).length} visibles · {photos.length} total
            </p>
          )}
        </div>
        <Button onClick={() => setMediaPickerOpen(true)}>+ Añadir foto</Button>
      </div>

      {/* States */}
      {loading && <p className="text-gray-500">Cargando...</p>}

      {!loading && photos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-24">
          <svg className="mb-4 h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
          <p className="text-sm text-gray-400">No hay fotos en la galería</p>
          <Button className="mt-4" onClick={() => setMediaPickerOpen(true)}>
            Añadir primera foto
          </Button>
        </div>
      )}

      {!loading && photos.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {photos.map((photo) => (
            <div
              key={photo._id}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
            >
              {/* Thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt={photo.alt}
                className="h-36 w-full object-cover"
              />

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100">
                <button
                  onClick={() => setEditingPhoto(photo)}
                  className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(photo)}
                  className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>

              {/* Visible badge */}
              <button
                onClick={() => handleToggleVisible(photo)}
                title={photo.visible ? 'Ocultar' : 'Mostrar'}
                className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${
                  photo.visible
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                }`}
              >
                {photo.visible ? 'Visible' : 'Oculta'}
              </button>

              {/* Info */}
              <div className="px-2 py-1.5">
                <p className="truncate text-xs text-gray-600">{photo.alt || <span className="italic text-gray-300">Sin descripción</span>}</p>
                {photo.category && (
                  <p className="truncate text-[10px] text-gray-400">{photo.category}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
