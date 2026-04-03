import type { ReactNode } from 'react'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

const NAV_GROUPS = [
  {
    label: 'Dashboard',
    links: [{ href: '/admin/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'SEO',
    links: [{ href: '/admin/seo', label: 'SEO' }],
  },
  {
    label: 'Blog',
    links: [
      { href: '/admin/blog', label: 'Blog' },
    ],
  },
  {
    label: 'Galería',
    links: [
      { href: '/admin/galeria', label: 'Galería' },
    ],
  },
  {
    label: 'Reseñas',
    links: [{ href: '/admin/resenas', label: 'Reseñas' }],
  },
  {
    label: 'Menciones',
    links: [{ href: '/admin/menciones', label: 'Menciones' }],
  },
  {
    label: 'Promociones',
    links: [{ href: '/admin/promociones', label: 'Promociones' }],
  },
  {
    label: 'Fondos',
    links: [{ href: '/admin/fondos', label: 'Fondos' }],
  },
  {
    label: 'Users',
    links: [{ href: '/admin/users', label: 'Users' }],
  },
]

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient navGroups={NAV_GROUPS}>{children}</AdminLayoutClient>
}
