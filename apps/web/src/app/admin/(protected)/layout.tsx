import type { ReactNode } from 'react'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

const NAV_LINKS = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/seo', label: 'SEO' },
  { href: '/admin/blog', label: 'Blog Posts' },
  { href: '/admin/blog/categorias', label: 'Blog Categorías' },
  { href: '/admin/galeria', label: 'Galería' },
  { href: '/admin/resenas', label: 'Reseñas' },
  { href: '/admin/menciones', label: 'Menciones' },
  { href: '/admin/promociones', label: 'Promociones' },
  { href: '/admin/fondos', label: 'Fondos' },
  { href: '/admin/users', label: 'Users' },
]

export default function AdminProtectedLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient navLinks={NAV_LINKS}>{children}</AdminLayoutClient>
}
