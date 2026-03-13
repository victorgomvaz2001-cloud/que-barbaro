'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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

export default function NewUserPage() {
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const { isAdmin, loading: authLoading } = useCurrentUser()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace('/admin/users')
  }, [authLoading, isAdmin, router])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const get = (name: string) => (form.elements.namedItem(name) as HTMLInputElement)?.value ?? ''

    setLoading(true)
    try {
      await apiClient.post<ApiResponse<IUser>>('/admin/users', {
        name: get('name'),
        email: get('email'),
        password: get('password'),
        role: get('role'),
      })
      success('Usuario creado correctamente')
      router.push('/admin/users')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al crear usuario', 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">New User</h1>
        <div className="flex gap-3">
          <Button type="submit" form="user-new-form" loading={loading}>
            Create User
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/users')}>
            Cancel
          </Button>
        </div>
      </div>

      <form id="user-new-form" onSubmit={handleSubmit}>
        <div className="max-w-lg">
          <section className={sectionCls}>
            <h2 className={sectionTitle}>User details</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Name</label>
                <input name="name" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input name="email" type="email" required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Password</label>
                <input name="password" type="password" required minLength={8} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <select name="role" defaultValue="editor" className={inputCls}>
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
