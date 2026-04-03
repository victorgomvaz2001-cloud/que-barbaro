'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Table, type TableColumn } from '@/components/admin/Table'
import { Button } from '@/components/admin/Button'
import { Modal } from '@/components/admin/Modal'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import { useToast } from '@/components/admin/Toast'
import type { ApiResponse, IBlogCategory, IBlogCategoryCreate, IBlogPost } from '@falcanna/types'

// ── Types ──────────────────────────────────────────────────────────────────────

type BlogTab = 'posts' | 'categorias'

// ── Posts tab ──────────────────────────────────────────────────────────────────

const POST_COLUMNS: TableColumn<IBlogPost>[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'category', label: 'Category' },
  {
    key: 'draft',
    label: 'Status',
    sortable: false,
    render: (value) => (
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
          value ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
        }`}
      >
        {value ? 'Draft' : 'Published'}
      </span>
    ),
  },
]

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminBlogPage() {
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const [activeTab, setActiveTab] = useState<BlogTab>('posts')

  // Posts state
  const [posts, setPosts] = useState<IBlogPost[]>([])
  const [postsLoading, setPostsLoading] = useState(true)
  const [pendingAssignIds, setPendingAssignIds] = useState<string[] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  // Categories state
  const [categories, setCategories] = useState<IBlogCategory[]>([])
  const [catsLoading, setCatsLoading] = useState(false)
  const [catsFetched, setCatsFetched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<IBlogCategory | null>(null)
  const [form, setForm] = useState<IBlogCategoryCreate>(EMPTY_FORM)
  const [slugManual, setSlugManual] = useState(false)
  const [selectedCatIds, setSelectedCatIds] = useState<Set<string>>(new Set())
  const [backgroundImage, setBackgroundImage] = useState('')
  const [bgPickerOpen, setBgPickerOpen] = useState(false)

  // Load posts + categories on mount (categories needed for bulk assign)
  useEffect(() => {
    Promise.all([
      apiClient.get<{ data: IBlogPost[] }>('/blog/admin/list'),
      apiClient.get<ApiResponse<IBlogCategory[]>>('/categories'),
    ])
      .then(([postsRes, catsRes]) => {
        setPosts(postsRes.data)
        setCategories(catsRes.data)
        setCatsFetched(true)
      })
      .catch(console.error)
      .finally(() => setPostsLoading(false))
  }, [])

  function fetchCategories() {
    setCatsLoading(true)
    apiClient
      .get<ApiResponse<IBlogCategory[]>>('/categories')
      .then((res) => { setCategories(res.data); setCatsFetched(true) })
      .catch(console.error)
      .finally(() => setCatsLoading(false))
  }

  // ── Posts actions ────────────────────────────────────────────────────────────

  async function handleDeletePost(post: IBlogPost) {
    if (!confirm(`¿Eliminar "${post.title}"?`)) return
    try {
      await apiClient.delete(`/blog/admin/${post._id}`)
      setPosts((prev) => prev.filter((p) => p._id !== post._id))
      success(`"${post.title}" eliminado correctamente`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar el post', 'Error')
    }
  }

  async function handleBulkDeletePosts(ids: string[]) {
    if (!confirm(`¿Eliminar ${ids.length} post${ids.length !== 1 ? 's' : ''}?`)) return
    try {
      await apiClient.delete('/blog/admin/bulk', { body: { ids } })
      setPosts((prev) => prev.filter((p) => !ids.includes(p._id as string)))
      success(`${ids.length} post${ids.length !== 1 ? 's' : ''} eliminados`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar posts', 'Error')
    }
  }

  async function handleBulkAssignCategory(ids: string[]) {
    setSelectedCategory('')
    setPendingAssignIds(ids)
    return Promise.resolve()
  }

  async function confirmAssignCategory() {
    if (!pendingAssignIds || !selectedCategory) return
    try {
      await apiClient.put('/blog/admin/bulk-category', { ids: pendingAssignIds, category: selectedCategory })
      setPosts((prev) =>
        prev.map((p) => (pendingAssignIds.includes(p._id as string) ? { ...p, category: selectedCategory } : p)),
      )
      success(`Categoría asignada a ${pendingAssignIds.length} post${pendingAssignIds.length !== 1 ? 's' : ''}`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al asignar categoría', 'Error')
    } finally {
      setPendingAssignIds(null)
      setSelectedCategory('')
    }
  }

  // ── Category actions ─────────────────────────────────────────────────────────

  function openCreateCat() {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setBackgroundImage('')
    setSlugManual(false)
    setModalOpen(true)
  }

  function openEditCat(cat: IBlogCategory) {
    setEditTarget(cat)
    setForm({
      slug: cat.slug,
      nameEs: cat.nameEs,
      nameEn: cat.nameEn,
      descriptionEs: cat.descriptionEs,
      descriptionEn: cat.descriptionEn,
      order: cat.order,
    })
    setBackgroundImage(cat.backgroundImage ?? '')
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

  async function handleSaveCat() {
    if (!form.nameEs || !form.nameEn || !form.slug) {
      toastError('Nombre ES, nombre EN y slug son obligatorios.', 'Error')
      return
    }
    setSaving(true)
    try {
      const payload = { ...form, backgroundImage: backgroundImage || '' }
      if (editTarget) {
        const res = await apiClient.put<ApiResponse<IBlogCategory>>(`/categories/admin/${editTarget._id}`, payload)
        setCategories((prev) => prev.map((c) => (c._id === editTarget._id ? res.data : c)))
        success('Categoría actualizada correctamente')
      } else {
        const res = await apiClient.post<ApiResponse<IBlogCategory>>('/categories/admin', payload)
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

  async function handleDeleteCat(cat: IBlogCategory) {
    if (!confirm(`¿Eliminar la categoría "${cat.nameEs}"? Los posts asociados perderán su categoría.`)) return
    setDeleting(true)
    try {
      await apiClient.delete(`/categories/admin/${cat._id}`)
      setCategories((prev) => prev.filter((c) => c._id !== cat._id))
      setSelectedCatIds((prev) => { const next = new Set(prev); next.delete(cat._id as string); return next })
      success(`"${cat.nameEs}" eliminada correctamente`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar la categoría', 'Error')
    } finally {
      setDeleting(false)
    }
  }

  async function handleReorderCat(index: number, direction: 'up' | 'down') {
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
        const o1 = item.order, o2 = target.order
        next[index] = { ...item, order: o2 } as typeof item
        next[targetIndex] = { ...target, order: o1 } as typeof target
        return next.sort((a, b) => a.order - b.order)
      })
    } catch { /* ignore */ }
    finally { setReordering(false) }
  }

  async function handleBulkDeleteCats() {
    if (!confirm(`¿Eliminar ${selectedCatIds.size} categoría${selectedCatIds.size !== 1 ? 's' : ''}?`)) return
    try {
      await apiClient.delete('/categories/admin/bulk', { body: { ids: [...selectedCatIds] } })
      setCategories((prev) => prev.filter((c) => !selectedCatIds.has(c._id as string)))
      success(`${selectedCatIds.size} categoría${selectedCatIds.size !== 1 ? 's' : ''} eliminadas`)
      setSelectedCatIds(new Set())
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar categorías', 'Error')
    }
  }

  // Switch to categorias tab: lazy-load if not yet fetched
  function handleTabChange(tab: BlogTab) {
    setActiveTab(tab)
    if (tab === 'categorias' && !catsFetched) fetchCategories()
  }

  const allCatsSelected = categories.length > 0 && categories.every((c) => selectedCatIds.has(c._id as string))

  if (postsLoading) return <p className="text-gray-500">Loading…</p>

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Blog</h1>
        {activeTab === 'posts' && (
          <a
            href="/admin/blog/new"
            className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + New Post
          </a>
        )}
        {activeTab === 'categorias' && (
          <div className="flex items-center gap-2">
            {selectedCatIds.size > 0 && (
              <button
                onClick={handleBulkDeleteCats}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Eliminar seleccionados ({selectedCatIds.size})
              </button>
            )}
            <Button onClick={openCreateCat}>+ Nueva categoría</Button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 border-b border-gray-200">
        {(['posts', 'categorias'] as BlogTab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={[
              'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px capitalize',
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab === 'posts' ? 'Posts' : 'Categorías'}
          </button>
        ))}
      </div>

      {/* Posts tab */}
      {activeTab === 'posts' && (
        <>
          <Table
            data={posts}
            columns={POST_COLUMNS}
            exportFileName="blog-posts"
            onBulkDelete={handleBulkDeletePosts}
            bulkActions={[
              {
                label: 'Asignar categoría',
                className: 'rounded bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 transition-colors',
                onClick: handleBulkAssignCategory,
              },
            ]}
            actions={(post) => (
              <>
                <button
                  onClick={() => router.push(`/admin/blog/${post._id}`)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePost(post)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </>
            )}
          />

          {/* Category assign modal */}
          {pendingAssignIds && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                <h2 className="mb-4 text-base font-semibold text-gray-900">
                  Asignar categoría a {pendingAssignIds.length} post{pendingAssignIds.length !== 1 ? 's' : ''}
                </h2>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                >
                  <option value="">— Selecciona una categoría —</option>
                  {categories.map((cat) => (
                    <option key={cat._id as string} value={cat.slug}>
                      {cat.nameEs}
                    </option>
                  ))}
                </select>
                <div className="mt-5 flex justify-end gap-3">
                  <button
                    onClick={() => { setPendingAssignIds(null); setSelectedCategory('') }}
                    className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmAssignCategory}
                    disabled={!selectedCategory}
                    className="rounded bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40"
                  >
                    Asignar
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Categorías tab */}
      {activeTab === 'categorias' && (
        <>
          {catsLoading ? (
            <p className="text-gray-500">Cargando…</p>
          ) : categories.length === 0 ? (
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
                        checked={allCatsSelected}
                        onChange={(e) => {
                          if (e.target.checked) setSelectedCatIds(new Set(categories.map((c) => c._id as string)))
                          else setSelectedCatIds(new Set())
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
                          checked={selectedCatIds.has(cat._id as string)}
                          onChange={(e) => {
                            setSelectedCatIds((prev) => {
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
                            onClick={() => handleReorderCat(index, 'up')}
                            disabled={index === 0 || reordering}
                            className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >↑</button>
                          <button
                            onClick={() => handleReorderCat(index, 'down')}
                            disabled={index === categories.length - 1 || reordering}
                            className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >↓</button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          <button onClick={() => openEditCat(cat)} className="text-sm text-blue-600 hover:underline">
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCat(cat)}
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
                <Button size="sm" loading={saving} onClick={handleSaveCat}>
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
              <div>
                <label className={labelCls}>Imagen de fondo</label>
                {backgroundImage ? (
                  <div className="relative mt-1 overflow-hidden rounded border border-gray-200 bg-gray-50" style={{ height: '100px' }}>
                    <img src={backgroundImage} alt="Fondo" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <button type="button" onClick={() => setBgPickerOpen(true)} className="rounded bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">Cambiar</button>
                      <button type="button" onClick={() => setBackgroundImage('')} className="rounded bg-red-500 px-2 py-1 text-xs font-medium text-white hover:bg-red-600">Eliminar</button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBgPickerOpen(true)}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded border-2 border-dashed border-gray-200 py-4 text-sm text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
                  >
                    + Seleccionar imagen de fondo
                  </button>
                )}
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

          {bgPickerOpen && (
            <MediaPickerModal
              open
              folder="blog"
              onClose={() => setBgPickerOpen(false)}
              onSelect={(url) => { setBackgroundImage(url); setBgPickerOpen(false) }}
              onSelectMultiple={(urls) => { if (urls[0]) setBackgroundImage(urls[0]); setBgPickerOpen(false) }}
            />
          )}
        </>
      )}
    </div>
  )
}
