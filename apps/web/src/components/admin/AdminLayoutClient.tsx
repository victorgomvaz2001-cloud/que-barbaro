'use client'

import { useRouter } from 'next/navigation'
import { ToastProvider } from '@/components/admin/Toast'
import { apiClient } from '@/lib/api-client'

interface NavLink {
  href: string
  label: string
}

export function AdminLayoutClient({
  children,
  navLinks,
}: {
  children: React.ReactNode
  navLinks: NavLink[]
}) {
  const router = useRouter()

  async function handleLogout() {
    await apiClient.post('/auth/logout', {}).catch(() => {})
    router.push('/admin/login')
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <aside className="flex w-56 shrink-0 flex-col bg-zinc-900">
          <div className="px-4 py-5">
            <span className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
              Admin
            </span>
          </div>
          <nav className="mt-2 flex-1 overflow-y-auto">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-zinc-800 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </ToastProvider>
  )
}
