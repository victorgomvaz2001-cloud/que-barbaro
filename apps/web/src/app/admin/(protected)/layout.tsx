import type { ReactNode } from 'react'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/seo', label: 'SEO' },
  { href: '/admin/blog', label: 'Blog' },
  { href: '/admin/locations', label: 'Locations' },
  { href: '/admin/users', label: 'Users' },
]

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient navLinks={NAV_LINKS}>{children}</AdminLayoutClient>
}
