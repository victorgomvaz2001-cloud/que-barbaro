'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/admin/Button'
import { useToast } from '@/components/admin/Toast'
import { Modal } from '@/components/admin/Modal'
import type { ApiResponse, IBlogCategory, IBlogCategoryCreate } from '@falcanna/types'

const inputCls = 'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelCls = 'block text-sm font-medium text-gray-700'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

const EMPTY_FORM: IBlogCategoryCreate = {
  slug: '',
  nameEs: '',
  nameEn: '',
  descriptionEs: '',
  descriptionEn: '',
  order: 0,
}

export default function AdminBlogCategoriasPage() {
  const { success, error: toastError } = useToast()
  const [categories, setCategories] = useState<IBlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<IBlogCategory | null>(null)
  const [form, setForm] = useState<IBlogCategoryCreate>(EMPTY_FORM)
  const [slugManual, setSlugManual] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchCategories()
  }, [])

  function fetchCategories() {
    setLoading(true)
    apiClient
      .get<ApiResponse<IBlogCategory[]>>('/categories')
      .then((res) => setCategories(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  function openCreate() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setSlugManual(false)
    setModalOpen(true)
  }

  function openEdit(cat: IBlogCategory) {
    setEditTarget(cat)
    setForm({
      slug: cat.slug,
      nameEs: cat.nameEs,
      nameEn: cat.nameEn,
      descriptionEs: cat.descriptionEs,
      descriptionEn: cat.descriptionEn,
      order: cat.order,
    })
    setSlugManual(true)
    setModalOpen(true)
  }

  function handleNameEsChange(value: string) {
    setForm((prev) => ({
      ...prev,
      nameEs: value,
      slug: slugManual ? prev.slug : slugify(value),
    }))
  }

  async function handleSave() {
    if (!form.nameEs || !form.nameEn || !form.slug) {
      toastError('Nombre ES, nombre EN y slug son obligatorios.', 'Error')
      return
    }
    setSaving(true)
    try {
      if (editTarget) {
        const res = await apiClient.put<ApiResponse<IBlogCategory>>(`/categories/admin/${editTarget._id}`, form)
        setCategories((prev) => prev.map((c) => (c._id === editTarget._id ? res.data : c)))
        success('Categoría actualizada correctamente')
      } else {
        const res = await apiClient.post<ApiResponse<IBlogCategory>>('/categories/admin', form)
        setCategories((prev) => [...prev, res.data])
        success('Categoría creada correctamente')
      }
      setModalOpen(false)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al guardar la categoría', 'Error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(cat: IBlogCategory) {
    if (!confirm(`¿Eliminar la categoría "${cat.nameEs}"? Los posts asociados perderán su categoría.`)) return
    setDeleting(true)
    try {
      await apiClient.delete(`/categories/admin/${cat._id}`)
      setCategories((prev) => prev.filter((c) => c._id !== cat._id))
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(cat._id as string); return next })
      success(`"${cat.nameEs}" eliminada correctamente`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar la categoría', 'Error')
    } finally {
      setDeleting(false)
    }
  }

  async function handleReorder(index: number, direction: 'up' | 'down') {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= categories.length) return
    const item = categories[index]
    const target = categories[targetIndex]
    if (!item || !target) return
    setReordering(true)
    try {
      await apiClient.put('/categories/admin/reorder', { id1: item._id, id2: target._id })
      setCategories((prev) => {
        const next = [...prev]
        const o1 = item.order
        const o2 = target.order
        next[index] = { ...item, order: o2 } as typeof item
        next[targetIndex] = { ...target, order: o1 } as typeof target
        return next.sort((a, b) => a.order - b.order)
      })
    } catch { /* ignore */ }
    finally { setReordering(false) }
  }

  async function handleBulkDelete() {
    if (!confirm(`¿Eliminar ${selectedIds.size} categoría${selectedIds.size !== 1 ? 's' : ''}?`)) return
    try {
      await apiClient.delete('/categories/admin/bulk', { body: { ids: [...selectedIds] } })
      setCategories((prev) => prev.filter((c) => !selectedIds.has(c._id as string)))
      success(`${selectedIds.size} categoría${selectedIds.size !== 1 ? 's' : ''} eliminadas`)
      setSelectedIds(new Set())
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar categorías', 'Error')
    }
  }

  const allSelected = categories.length > 0 && categories.every((c) => selectedIds.has(c._id as string))

  if (loading) return <p className="text-gray-500">Cargando…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías del Blog</h1>
          <p className="mt-1 text-sm text-gray-500">
            Cada categoría muestra un carrusel de posts en la página del blog. Los posts deben asociarse a una categoría obligatoriamente.
          </p>
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
          <Button onClick={openCreate}>+ Nueva categoría</Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200 p-12 text-center text-sm text-gray-400">
          No hay categorías todavía. Crea la primera.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="w-8 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedIds(new Set(categories.map((c) => c._id as string)))
                      } else {
                        setSelectedIds(new Set())
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 accent-gray-900 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Orden</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre ES</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre EN</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Descripción ES</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Mover</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat, index) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="w-8 px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(cat._id as string)}
                      onChange={(e) => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev)
                          if (e.target.checked) next.add(cat._id as string)
                          else next.delete(cat._id as string)
                          return next
                        })
                      }}
                      className="h-4 w-4 rounded border-gray-300 accent-gray-900 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-500">{cat.order}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.nameEs}</td>
                  <td className="px-4 py-3 text-gray-700">{cat.nameEn}</td>
                  <td className="max-w-xs px-4 py-3 text-gray-500">
                    <p className="line-clamp-2">{cat.descriptionEs || <span className="italic text-gray-300">Sin descripción</span>}</p>
                  </td>
                  <td className="px-4 py-3">
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
                        disabled={index === categories.length - 1 || reordering}
                        className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Mover abajo"
                      >
                        ↓
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deleting}
                        className="text-sm text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editTarget ? `Editar: ${editTarget.nameEs}` : 'Nueva categoría'}
        onClose={() => setModalOpen(false)}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" loading={saving} onClick={handleSave}>
              {editTarget ? 'Guardar cambios' : 'Crear categoría'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Nombre en español <span className="text-red-500">*</span></label>
              <input
                value={form.nameEs}
                onChange={(e) => handleNameEsChange(e.target.value)}
                className={inputCls}
                placeholder="Cuidado capilar"
              />
            </div>
            <div>
              <label className={labelCls}>Nombre en inglés <span className="text-red-500">*</span></label>
              <input
                value={form.nameEn}
                onChange={(e) => setForm((prev) => ({ ...prev, nameEn: e.target.value }))}
                className={inputCls}
                placeholder="Hair care"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Slug <span className="text-red-500">*</span></label>
            <input
              value={form.slug}
              onChange={(e) => { setForm((prev) => ({ ...prev, slug: e.target.value })); setSlugManual(true) }}
              className={inputCls}
              placeholder="cuidado-capilar"
            />
            <p className="mt-1 text-xs text-gray-400">Identificador único. Los posts se asocian por este slug.</p>
          </div>
          <div>
            <label className={labelCls}>Descripción en español</label>
            <textarea
              value={form.descriptionEs}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionEs: e.target.value }))}
              rows={3}
              className={inputCls}
              placeholder="Breve descripción de la categoría en español…"
            />
          </div>
          <div>
            <label className={labelCls}>Descripción en inglés</label>
            <textarea
              value={form.descriptionEn}
              onChange={(e) => setForm((prev) => ({ ...prev, descriptionEn: e.target.value }))}
              rows={3}
              className={inputCls}
              placeholder="Brief description of the category in English…"
            />
          </div>
          {editTarget && (
            <div className="w-24">
              <label className={labelCls}>Orden</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm((prev) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                className={inputCls}
                min={0}
              />
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
