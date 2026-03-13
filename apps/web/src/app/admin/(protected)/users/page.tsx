'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Table, type TableColumn } from '@/components/admin/Table'
import { Button } from '@/components/admin/Button'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import type { ApiListResponse, IUser } from '@falcanna/types'

const columns: TableColumn<IUser>[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  {
    key: 'role',
    label: 'Role',
    render: (value) => (
      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
        {String(value ?? '')}
      </span>
    ),
  },
]

export default function AdminUsersPage() {
  const router = useRouter()
  const { isAdmin } = useCurrentUser()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get<ApiListResponse<IUser>>('/admin/users')
      .then((res) => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this user?')) return
    await apiClient.delete(`/admin/users/${id}`)
    setUsers((prev) => prev.filter((u) => u._id !== id))
  }

  if (loading) return <p className="text-gray-500">Loading…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        {isAdmin && <Button onClick={() => router.push('/admin/users/new')}>New User</Button>}
      </div>
      <Table
        data={users}
        columns={columns}
        exportFileName="users"
        actions={(user) =>
          isAdmin ? (
            <>
              <button
                onClick={() => router.push(`/admin/users/${user._id}`)}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user._id)}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </>
          ) : null
        }
      />
    </div>
  )
}
