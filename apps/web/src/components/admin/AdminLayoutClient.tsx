'use client'

import { useRouter } from 'next/navigation'
import { ToastProvider } from '@/components/admin/Toast'

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
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    router.push('/admin/login')
  }

  return (
    <ToastProvider>
      <div className="flex h-screen overflow-hidden bg-gray-100">
        <aside className="flex w-56 shrink-0 flex-col bg-navy">
          <div className="px-4 py-5">
            <span className="block font-primary text-4xl text-white leading-none mb-1">
              ¡Qué Bárbaro!
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
              Admin
            </span>
          </div>
          <nav className="mt-2 flex-1 overflow-y-auto">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center px-4 py-2 text-sm text-white/70 hover:bg-white/10 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="border-t border-white/10 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm text-white/40 hover:bg-white/10 hover:text-white"
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
