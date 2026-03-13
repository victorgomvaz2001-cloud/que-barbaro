import LanguageSelector from './LanguageSelector'

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <a href="/" className="text-lg font-bold tracking-tight text-gray-900">
          Falcanna
        </a>
        <div className="ml-auto">
          <LanguageSelector />
        </div>
      </nav>
    </header>
  )
}
