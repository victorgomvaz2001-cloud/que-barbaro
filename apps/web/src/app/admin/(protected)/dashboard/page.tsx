export default function DashboardPage() {
  const cards = [
    { href: '/admin/seo', label: 'Manage SEO' },
    { href: '/admin/blog', label: 'Manage Blog Posts' },
    { href: '/admin/galeria', label: 'Manage Galería' },
    { href: '/admin/users', label: 'Manage Users' },
    { href: '/admin/promociones', label: 'Manage Promotions' },
  ]

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mb-8 text-gray-500">Welcome to the Falcanna admin panel.</p>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="rounded-lg border border-gray-200 bg-white p-5 text-sm font-medium text-gray-700 shadow-sm hover:border-blue-400 hover:text-blue-600"
          >
            {card.label}
          </a>
        ))}
      </div>
    </div>
  )
}
