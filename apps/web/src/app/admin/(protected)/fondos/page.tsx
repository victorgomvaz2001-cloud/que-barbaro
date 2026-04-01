'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import type { SectionBackgroundMap } from '@falcanna/types'

/* ── Section registry ────────────────────────────────────────────────────── */

const PAGES = [
  {
    slug: 'home',
    label: 'Inicio',
    sections: [
      { key: 'hero',      label: 'Hero' },
      { key: 'valueProp', label: 'Propuesta de valor' },
      { key: 'brands',    label: 'Marcas' },
      { key: 'cta',       label: 'CTA Reserva' },
    ],
  },
  {
    slug: 'el-salon',
    label: 'El Salón',
    sections: [
      { key: 'hero',        label: 'Hero' },
      { key: 'experiencia', label: 'Experiencia' },
      { key: 'ctaReserva',  label: 'CTA Reserva' },
    ],
  },
  {
    slug: 'servicios',
    label: 'Servicios',
    sections: [
      { key: 'hero', label: 'Hero' },
    ],
  },
  {
    slug: 'blog',
    label: 'Blog',
    sections: [
      { key: 'hero', label: 'Hero' },
    ],
  },
  {
    slug: 'galeria',
    label: 'Galería',
    sections: [
      { key: 'hero',      label: 'Hero' },
      { key: 'ctaReserva', label: 'CTA Reserva' },
    ],
  },
  {
    slug: 'reservar-cita',
    label: 'Reservar Cita',
    sections: [
      { key: 'hero', label: 'Fondo de página' },
    ],
  },
]

/* ── Types ───────────────────────────────────────────────────────────────── */

type AllBackgrounds = Record<string, SectionBackgroundMap>

interface PickerTarget {
  pageSlug: string
  sectionKey: string
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function AdminFondosPage() {
  const [data, setData]         = useState<AllBackgrounds>({})
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState<string | null>(null)
  const [picker, setPicker]     = useState<PickerTarget | null>(null)

  /* Load all page backgrounds in parallel on mount */
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

    Promise.all(
      PAGES.map((p) =>
        fetch(`${API_URL}/section-backgrounds/${p.slug}`, { cache: 'no-store' })
          .then((r) => r.json())
          .then((j: { data: SectionBackgroundMap }) => ({ slug: p.slug, map: j.data ?? {} }))
          .catch(() => ({ slug: p.slug, map: {} })),
      ),
    ).then((results) => {
      const merged: AllBackgrounds = {}
      results.forEach(({ slug, map }) => { merged[slug] = map })
      setData(merged)
      setLoading(false)
    })
  }, [])

  function getImage(pageSlug: string, sectionKey: string): string | null {
    return data[pageSlug]?.[sectionKey] ?? null
  }

  async function handleSelect(pageSlug: string, sectionKey: string, imageUrl: string) {
    const id = `${pageSlug}/${sectionKey}`
    setSaving(id)
    try {
      await apiClient.put(`/section-backgrounds/admin/${pageSlug}/${sectionKey}`, { imageUrl })
      setData((prev) => ({
        ...prev,
        [pageSlug]: { ...(prev[pageSlug] ?? {}), [sectionKey]: imageUrl },
      }))
    } finally {
      setSaving(null)
      setPicker(null)
    }
  }

  async function handleRemove(pageSlug: string, sectionKey: string) {
    if (!confirm('¿Eliminar el fondo de esta sección?')) return
    const id = `${pageSlug}/${sectionKey}`
    setSaving(id)
    try {
      await apiClient.delete(`/section-backgrounds/admin/${pageSlug}/${sectionKey}`)
      setData((prev) => ({
        ...prev,
        [pageSlug]: { ...(prev[pageSlug] ?? {}), [sectionKey]: null },
      }))
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <p className="text-gray-500">Cargando…</p>

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Fondos de sección</h1>

      <div className="space-y-10">
        {PAGES.map((page) => (
          <div key={page.slug}>
            {/* Page header */}
            <div className="mb-4 flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-800">{page.label}</h2>
              <span className="font-mono text-xs text-gray-400">/{page.slug}</span>
            </div>

            {/* Sections grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {page.sections.map((section) => {
                const imageUrl = getImage(page.slug, section.key)
                const id       = `${page.slug}/${section.key}`
                const isSaving = saving === id

                return (
                  <div
                    key={section.key}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-36 w-full bg-gray-100">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={section.label}
                          fill
                          sizes="400px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-xs text-gray-400">Sin imagen — fondo blanco</span>
                        </div>
                      )}
                    </div>

                    {/* Info + actions */}
                    <div className="px-4 py-3">
                      <p className="mb-3 text-sm font-medium text-gray-700">{section.label}</p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPicker({ pageSlug: page.slug, sectionKey: section.key })}
                          disabled={isSaving}
                          className="flex-1 rounded-lg bg-navy px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-navy/80 disabled:opacity-50"
                        >
                          {imageUrl ? 'Cambiar' : 'Elegir imagen'}
                        </button>
                        {imageUrl && (
                          <button
                            onClick={() => handleRemove(page.slug, section.key)}
                            disabled={isSaving}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
                          >
                            {isSaving ? '…' : 'Quitar'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Media picker modal */}
      {picker && (
        <MediaPickerModal
          open
          folder="section-backgrounds"
          onClose={() => setPicker(null)}
          onSelect={(url) => handleSelect(picker.pageSlug, picker.sectionKey, url)}
        />
      )}
    </div>
  )
}
