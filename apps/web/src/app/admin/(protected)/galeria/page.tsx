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
  GallerySection,
} from '@falcanna/types'

// ── Constants ──────────────────────────────────────────────────────────────────

const SECTIONS: { key: GallerySection; label: string }[] = [
  { key: 'general',       label: 'General' },
  { key: 'antes-despues', label: 'Antes y después' },
  { key: 'espacio',       label: 'Espacio' },
  { key: 'eventos',       label: 'Bodas y eventos' },
]

const GENERAL_CATEGORIES = ['Cortes y peinados', 'Coloración y rubios', 'Tratamientos', 'Maquillaje', 'Sin categoría']

// ── Photo form modal (general / espacio / eventos) ────────────────────────────

function PhotoFormModal({
  url,
  photo,
  section,
  onSave,
  onClose,
}: {
  url?: string
  photo?: IGalleryPhoto
  section: GallerySection
  onSave: (data: Partial<IGalleryPhoto>) => Promise<void>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">{photo ? 'Editar foto' : 'Añadir foto'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {previewSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewSrc} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-gray-200" />
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (alt text)</label>
            <input
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Ej: Coloración balayage"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {section === 'general' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {GENERAL_CATEGORIES.map((c) => (
                  <option key={c} value={c === 'Sin categoría' ? '' : c}>{c}</option>
                ))}
              </select>
            </div>
          )}
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
            <Button type="submit" loading={saving}>{photo ? 'Guardar cambios' : 'Añadir foto'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Antes y Después form modal ─────────────────────────────────────────────────

function AntesYDespuesModal({
  photo,
  onSave,
  onClose,
}: {
  photo?: IGalleryPhoto
  onSave: (data: Partial<IGalleryPhoto>) => Promise<void>
  onClose: () => void
}) {
  const [pairLabel, setPairLabel] = useState(photo?.pairLabel ?? '')
  const [urlBefore, setUrlBefore] = useState(photo?.url ?? '')
  const [urlAfter, setUrlAfter]   = useState(photo?.urlAfter ?? '')
  const [visible, setVisible]     = useState(photo?.visible ?? true)
  const [saving, setSaving]       = useState(false)
  const [pickerTarget, setPickerTarget] = useState<'before' | 'after' | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!urlBefore || !urlAfter) return
    setSaving(true)
    await onSave({ url: urlBefore, urlAfter, pairLabel, visible, section: 'antes-despues' })
    setSaving(false)
  }

  return (
    <>
      {pickerTarget && (
        <MediaPickerModal
          open
          folder="gallery"
          onClose={() => setPickerTarget(null)}
          onSelect={(url) => {
            if (pickerTarget === 'before') setUrlBefore(url)
            else setUrlAfter(url)
            setPickerTarget(null)
          }}
        />
      )}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <div className="w-full max-w-lg rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold text-gray-900">{photo ? 'Editar par' : 'Añadir par antes / después'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del servicio</label>
              <input
                value={pairLabel}
                onChange={(e) => setPairLabel(e.target.value)}
                placeholder="Ej: Balayage completo"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Photo pickers */}
            <div className="grid grid-cols-2 gap-4">
              {/* Before */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Foto — Antes</p>
                {urlBefore ? (
                  <div className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={urlBefore} alt="Antes" className="w-full h-36 object-cover rounded-lg border border-gray-200" />
                    <button
                      type="button"
                      onClick={() => setPickerTarget('before')}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-lg text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickerTarget('before')}
                    className="w-full h-36 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
                  >
                    <span className="text-2xl leading-none">+</span>
                    Seleccionar
                  </button>
                )}
              </div>
              {/* After */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Foto — Después</p>
                {urlAfter ? (
                  <div className="relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={urlAfter} alt="Después" className="w-full h-36 object-cover rounded-lg border border-orange-200" />
                    <button
                      type="button"
                      onClick={() => setPickerTarget('after')}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-lg text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-all"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPickerTarget('after')}
                    className="w-full h-36 rounded-lg border-2 border-dashed border-orange-300 flex flex-col items-center justify-center gap-1 text-orange-400 hover:border-orange-500 hover:text-orange-500 transition-colors text-sm"
                  >
                    <span className="text-2xl leading-none">+</span>
                    Seleccionar
                  </button>
                )}
              </div>
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
            <div className="flex justify-end gap-3 pt-1">
              <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
              <Button type="submit" loading={saving} disabled={!urlBefore || !urlAfter}>
                {photo ? 'Guardar cambios' : 'Añadir par'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

// ── Section grid ───────────────────────────────────────────────────────────────

function SectionGrid({
  photos,
  section,
  onEdit,
  onDelete,
  onToggleVisible,
  onAdd,
}: {
  photos: IGalleryPhoto[]
  section: GallerySection
  onEdit: (p: IGalleryPhoto) => void
  onDelete: (p: IGalleryPhoto) => void
  onToggleVisible: (p: IGalleryPhoto) => void
  onAdd: () => void
}) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 py-20">
        <svg className="mb-4 h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <p className="text-sm text-gray-400 mb-4">
          {section === 'antes-despues' ? 'No hay pares añadidos' : 'No hay fotos en esta sección'}
        </p>
        <Button onClick={onAdd}>
          {section === 'antes-despues' ? '+ Añadir primer par' : '+ Añadir primera foto'}
        </Button>
      </div>
    )
  }

  if (section === 'antes-despues') {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo._id} className="group relative rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="grid grid-cols-2 gap-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="Antes" className="h-32 w-full object-cover" />
              {photo.urlAfter
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={photo.urlAfter} alt="Después" className="h-32 w-full object-cover" />
                : <div className="h-32 w-full bg-orange-50 flex items-center justify-center text-orange-300 text-xs">Sin foto</div>
              }
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/40 group-hover:opacity-100">
              <button onClick={() => onEdit(photo)} className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100">Editar</button>
              <button onClick={() => onDelete(photo)} className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Eliminar</button>
            </div>
            <button
              onClick={() => onToggleVisible(photo)}
              className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${photo.visible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
            >
              {photo.visible ? 'Visible' : 'Oculta'}
            </button>
            <div className="px-3 py-2">
              <p className="text-xs font-medium text-gray-700">{photo.pairLabel || <span className="italic text-gray-300">Sin etiqueta</span>}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Antes / Después</p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {photos.map((photo) => (
        <div key={photo._id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={photo.alt} className="h-36 w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover:bg-black/45 group-hover:opacity-100">
            <button onClick={() => onEdit(photo)} className="rounded bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100">Editar</button>
            <button onClick={() => onDelete(photo)} className="rounded bg-red-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-600">Eliminar</button>
          </div>
          <button
            onClick={() => onToggleVisible(photo)}
            className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors ${photo.visible ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
          >
            {photo.visible ? 'Visible' : 'Oculta'}
          </button>
          <div className="px-2 py-1.5">
            <p className="truncate text-xs text-gray-600">{photo.alt || <span className="italic text-gray-300">Sin descripción</span>}</p>
            {photo.category && <p className="truncate text-[10px] text-gray-400">{photo.category}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Admin Gallery Page ─────────────────────────────────────────────────────────

export default function AdminGaleriaPage() {
  const { success, error } = useToast()
  const [activeSection, setActiveSection] = useState<GallerySection>('general')
  const [photos, setPhotos]               = useState<IGalleryPhoto[]>([])
  const [loading, setLoading]             = useState(true)
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [pendingUrl, setPendingUrl]       = useState<string | null>(null)
  const [editingPhoto, setEditingPhoto]   = useState<IGalleryPhoto | null>(null)
  const [antesYDespuesOpen, setAntesYDespuesOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    apiClient
      .get<ApiListResponse<IGalleryPhoto>>(`/gallery/admin/list?section=${activeSection}`)
      .then((res) => setPhotos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [activeSection])

  const sectionPhotos = photos

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
          section: activeSection,
          order: photos.length + added,
        })
        setPhotos((prev) => [res.data, ...prev])
        added++
      } catch { /* continue */ }
    }
    if (added > 0) success(`${added} foto${added !== 1 ? 's' : ''} añadida${added !== 1 ? 's' : ''}`)
  }

  async function handleCreate(data: Partial<IGalleryPhoto>) {
    const url = data.url ?? pendingUrl
    if (!url) return
    try {
      const res = await apiClient.post<ApiResponse<IGalleryPhoto>>('/gallery/admin', {
        ...data,
        url,
        section: activeSection,
        order: photos.length,
      })
      setPhotos((prev) => [res.data, ...prev])
      success('Foto añadida')
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al añadir foto', 'Error')
    } finally {
      setPendingUrl(null)
      setAntesYDespuesOpen(false)
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
      setAntesYDespuesOpen(false)
    }
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

  const isAntesYDespues = activeSection === 'antes-despues'

  function handleAddClick() {
    if (isAntesYDespues) {
      setAntesYDespuesOpen(true)
    } else {
      setMediaPickerOpen(true)
    }
  }

  return (
    <div>
      {/* Media picker (non antes-y-después) */}
      <MediaPickerModal
        open={mediaPickerOpen}
        folder="gallery"
        multiple={!isAntesYDespues}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={handleMediaSelect}
        onSelectMultiple={handleSelectMultiple}
      />

      {/* Create single photo modal */}
      {pendingUrl !== null && (
        <PhotoFormModal
          url={pendingUrl}
          section={activeSection}
          onSave={handleCreate}
          onClose={() => setPendingUrl(null)}
        />
      )}

      {/* Edit single photo modal */}
      {editingPhoto !== null && activeSection !== 'antes-despues' && (
        <PhotoFormModal
          photo={editingPhoto}
          section={activeSection}
          onSave={(data) => handleUpdate(editingPhoto, data)}
          onClose={() => setEditingPhoto(null)}
        />
      )}

      {/* Antes y después modal (create) */}
      {antesYDespuesOpen && !editingPhoto && (
        <AntesYDespuesModal
          onSave={handleCreate}
          onClose={() => setAntesYDespuesOpen(false)}
        />
      )}

      {/* Antes y después modal (edit) */}
      {editingPhoto !== null && activeSection === 'antes-despues' && (
        <AntesYDespuesModal
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
              {sectionPhotos.filter((p) => p.visible).length} visibles · {sectionPhotos.length} total en esta sección
            </p>
          )}
        </div>
        <Button onClick={handleAddClick}>
          {isAntesYDespues ? '+ Añadir par' : '+ Añadir foto'}
        </Button>
      </div>

      {/* Section tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {SECTIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={[
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
              activeSection === s.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Cargando...</p>
      ) : (
        <SectionGrid
          photos={sectionPhotos}
          section={activeSection}
          onEdit={setEditingPhoto}
          onDelete={handleDelete}
          onToggleVisible={handleToggleVisible}
          onAdd={handleAddClick}
        />
      )}
    </div>
  )
}
