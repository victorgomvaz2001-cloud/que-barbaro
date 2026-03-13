'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Table, type TableColumn } from '@/components/admin/Table'
import type { ApiListResponse, ISEOPage } from '@falcanna/types'

const columns: TableColumn<ISEOPage>[] = [
  {
    key: 'route',
    label: 'Route',
    className: 'font-mono text-gray-600',
  },
  {
    key: 'title',
    label: 'Title',
  },
  {
    key: 'description',
    label: 'Description',
    className: 'max-w-xs truncate',
    sortable: false,
  },
]

export default function AdminSEOPage() {
  const router = useRouter()
  const [items, setItems] = useState<ISEOPage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get<ApiListResponse<ISEOPage>>('/seo/admin')
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this SEO entry?')) return
    await apiClient.delete(`/seo/admin/${id}`)
    setItems((prev) => prev.filter((s) => s._id !== id))
  }

  if (loading) return <p className="text-gray-500">Loading…</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">SEO Management</h1>
      <Table
        data={items}
        columns={columns}
        exportFileName="seo-routes"
        actions={(item) => (
          <>
            <button
              onClick={() => router.push(`/admin/seo/${item._id}`)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
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
