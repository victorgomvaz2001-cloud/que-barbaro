'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Table, type TableColumn } from '@/components/admin/Table'
import { useToast } from '@/components/admin/Toast'
import type { ApiListResponse, IBlogPost } from '@falcanna/types'

const columns: TableColumn<IBlogPost>[] = [
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get<ApiListResponse<IBlogPost>>('/blog/admin/list')
      .then((res) => setPosts(res.data))
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
    </div>
  )
}
