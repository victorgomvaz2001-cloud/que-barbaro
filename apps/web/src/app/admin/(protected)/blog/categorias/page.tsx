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
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<IBlogCategory | null>(null)
  const [form, setForm] = useState<IBlogCategoryCreate>(EMPTY_FORM)
  const [slugManual, setSlugManual] = useState(false)

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
      success(`"${cat.nameEs}" eliminada correctamente`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar la categoría', 'Error')
    } finally {
      setDeleting(false)
    }
  }

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
        <Button onClick={openCreate}>+ Nueva categoría</Button>
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
                <th className="px-4 py-3 text-left font-medium text-gray-600">Orden</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre ES</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Nombre EN</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Descripción ES</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{cat.order}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.nameEs}</td>
                  <td className="px-4 py-3 text-gray-700">{cat.nameEn}</td>
                  <td className="max-w-xs px-4 py-3 text-gray-500">
                    <p className="line-clamp-2">{cat.descriptionEs || <span className="italic text-gray-300">Sin descripción</span>}</p>
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
        </div>
      </Modal>
    </div>
  )
}
