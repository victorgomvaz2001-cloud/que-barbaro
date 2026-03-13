'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Table, type TableColumn } from '@/components/admin/Table'
import type { ApiListResponse, ILocation } from '@falcanna/types'

const columns: TableColumn<ILocation>[] = [
  { key: 'name', label: 'Name' },
  { key: 'region', label: 'Region' },
  { key: 'address', label: 'Address', sortable: false },
]

export default function AdminLocationsPage() {
  const router = useRouter()
  const [locations, setLocations] = useState<ILocation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get<ApiListResponse<ILocation>>('/locations/admin/list')
      .then((res) => setLocations(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this location?')) return
    await apiClient.delete(`/locations/admin/${id}`)
    setLocations((prev) => prev.filter((l) => l._id !== id))
  }

  if (loading) return <p className="text-gray-500">Loading…</p>

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Locations</h1>
      <Table
        data={locations}
        columns={columns}
        exportFileName="locations"
        actions={(loc) => (
          <>
            <button
              onClick={() => router.push(`/admin/locations/${loc._id}`)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(loc._id)}
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
