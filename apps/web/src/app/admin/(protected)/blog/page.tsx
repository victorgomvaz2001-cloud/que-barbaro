'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Table, type TableColumn } from '@/components/admin/Table'
import { useToast } from '@/components/admin/Toast'
import type { ApiListResponse, IBlogCategory, IBlogPost } from '@falcanna/types'

const columns: TableColumn<IBlogPost>[] = [
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

export default function AdminBlogPage() {
  const router = useRouter()
  const { success, error } = useToast()
  const [posts, setPosts] = useState<IBlogPost[]>([])
  const [categories, setCategories] = useState<IBlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingAssignIds, setPendingAssignIds] = useState<string[] | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    Promise.all([
      apiClient.get<ApiListResponse<IBlogPost>>('/blog/admin/list'),
      apiClient.get<{ data: IBlogCategory[] }>('/categories'),
    ])
      .then(([postsRes, catsRes]) => {
        setPosts(postsRes.data)
        setCategories(catsRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(post: IBlogPost) {
    if (!confirm(`¿Eliminar "${post.title}"?`)) return
    try {
      await apiClient.delete(`/blog/admin/${post._id}`)
      setPosts((prev) => prev.filter((p) => p._id !== post._id))
      success(`"${post.title}" eliminado correctamente`)
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar el post', 'Error')
    }
  }

  async function handleBulkDelete(ids: string[]) {
    if (!confirm(`¿Eliminar ${ids.length} post${ids.length !== 1 ? 's' : ''}?`)) return
    try {
      await apiClient.delete('/blog/admin/bulk', { body: { ids } })
      setPosts((prev) => prev.filter((p) => !ids.includes(p._id as string)))
      success(`${ids.length} post${ids.length !== 1 ? 's' : ''} eliminados`)
    } catch (err) {
      error(err instanceof Error ? err.message : 'Error al eliminar posts', 'Error')
    }
  }

  async function handleBulkAssignCategory(ids: string[]) {
    setSelectedCategory('')
    setPendingAssignIds(ids)
    // Return a promise that resolves immediately — the actual API call happens via the modal
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
      error(err instanceof Error ? err.message : 'Error al asignar categoría', 'Error')
    } finally {
      setPendingAssignIds(null)
      setSelectedCategory('')
    }
  }

  if (loading) return <p className="text-gray-500">Loading…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
        <a
          href="/admin/blog/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + New Post
        </a>
      </div>
      <Table
        data={posts}
        columns={columns}
        exportFileName="blog-posts"
        onBulkDelete={handleBulkDelete}
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
              onClick={() => handleDelete(post)}
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
    </div>
  )
}
