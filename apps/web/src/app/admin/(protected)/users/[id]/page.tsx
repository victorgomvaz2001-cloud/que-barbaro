'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/admin/Button'
import { useToast } from '@/components/admin/Toast'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import type { ApiResponse, IUser } from '@falcanna/types'

const inputCls =
  'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelCls = 'block text-sm font-medium text-gray-700'
const sectionCls = 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
const sectionTitle = 'mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400'

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const { isAdmin, loading: authLoading } = useCurrentUser()
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace('/admin/users')
  }, [authLoading, isAdmin, router])

  useEffect(() => {
    apiClient
      .get<ApiResponse<IUser>>(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .catch(console.error)
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value ?? ''

    const password = get('password')
    const payload: Record<string, string> = {
      name: get('name'),
      role: get('role'),
    }
    if (password) payload.password = password

    setLoading(true)
    try {
      await apiClient.put(`/admin/users/${id}`, payload)
      success('Usuario guardado correctamente')
      router.push('/admin/users')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al guardar', 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar el usuario "${user!.name}"?`)) return
    setDeleting(true)
    try {
      await apiClient.delete(`/admin/users/${id}`)
      success(`"${user!.name}" eliminado correctamente`)
      router.push('/admin/users')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    } finally {
      setDeleting(false)
    }
  }

  if (!user) return <p className="text-gray-500">Loading…</p>

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Edit User{' '}
          <span className="font-mono text-lg font-normal text-gray-400">{user.email}</span>
        </h1>
        <div className="flex gap-3">
          <Button type="submit" form="user-edit-form" loading={loading}>
            Save Changes
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/users')}>
            Cancel
          </Button>
          <Button type="button" variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <form id="user-edit-form" onSubmit={handleSubmit}>
        <div className="max-w-lg">
          <section className={sectionCls}>
            <h2 className={sectionTitle}>User details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input name="name" defaultValue={user.name} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  value={user.email}
                  readOnly
                  className="mt-1 w-full cursor-default rounded border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400"
                />
              </div>
              <div>
                <label className={labelCls}>
                  New Password{' '}
                  <span className="font-normal text-gray-400">(dejar vacío para no cambiar)</span>
                </label>
                <input name="password" type="password" minLength={8} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <select name="role" defaultValue={user.role} className={inputCls}>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  )
}
