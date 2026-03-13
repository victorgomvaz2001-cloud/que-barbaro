'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, ISEOPage, ISEOPageUpdate } from '@falcanna/types'

const inputCls =
  'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

const labelCls = 'block text-sm font-medium text-gray-700'

const sectionCls = 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm'

const sectionTitle = 'mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  )
}

export default function EditSEOPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [seo, setSEO] = useState<ISEOPage | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [langPairs, setLangPairs] = useState<{ key: string; value: string }[]>([])

  useEffect(() => {
    apiClient
      .get<ApiResponse<ISEOPage>>(`/seo/admin/${id}`)
      .then((res) => {
        setSEO(res.data)
        const langs = res.data.alternates?.languages ?? {}
        setLangPairs(Object.entries(langs).map(([key, value]) => ({ key, value })))
      })
      .catch(console.error)
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const form = e.currentTarget
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value ?? ''
    const checked = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.checked

    const cardValue = get('twitterCard.card')
    const languages: Record<string, string> = {}
    langPairs.forEach(({ key, value }) => {
      if (key.trim()) languages[key.trim()] = value
    })

    const data: ISEOPageUpdate = {
      title: get('title'),
      description: get('description'),
      canonical: get('canonical') || undefined,
      og: {
        title: get('og.title') || undefined,
        description: get('og.description') || undefined,
        image: get('og.image') || undefined,
        url: get('og.url') || undefined,
        type: get('og.type') || undefined,
      },
      twitterCard: {
        card: cardValue
          ? (cardValue as 'summary' | 'summary_large_image' | 'app' | 'player')
          : undefined,
        title: get('twitterCard.title') || undefined,
        description: get('twitterCard.description') || undefined,
        image: get('twitterCard.image') || undefined,
      },
      robots: {
        index: checked('robots.index'),
        follow: checked('robots.follow'),
        googleBot: {
          index: checked('robots.googleBot.index'),
          follow: checked('robots.googleBot.follow'),
        },
      },
      alternates: Object.keys(languages).length ? { languages } : undefined,
    }

    try {
      await apiClient.put(`/seo/admin/${id}`, data)
      router.push('/admin/seo')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update SEO')
    } finally {
      setLoading(false)
    }
  }

  if (!seo) return <p className="text-gray-500">Loading…</p>

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Edit SEO —{' '}
        <span className="font-mono text-lg text-gray-500">{seo.route}</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ── Basic ───────────────────────────────────────────── */}
        <section className={sectionCls}>
          <h2 className={sectionTitle}>Basic</h2>
          <div className="space-y-4">
            <Field label="Title">
              <input name="title" defaultValue={seo.title} required className={inputCls} />
            </Field>
            <Field label="Description">
              <textarea
                name="description"
                rows={3}
                defaultValue={seo.description}
                required
                className={inputCls}
              />
            </Field>
            <Field label="Canonical URL">
              <input name="canonical" defaultValue={seo.canonical ?? ''} className={inputCls} />
            </Field>
          </div>
        </section>

        {/* ── Open Graph ──────────────────────────────────────── */}
        <section className={sectionCls}>
          <h2 className={sectionTitle}>Open Graph</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="OG Title">
              <input name="og.title" defaultValue={seo.og?.title ?? ''} className={inputCls} />
            </Field>
            <Field label="OG Type">
              <input
                name="og.type"
                defaultValue={seo.og?.type ?? ''}
                placeholder="website"
                className={inputCls}
              />
            </Field>
            <div className="col-span-2">
              <Field label="OG Description">
                <textarea
                  name="og.description"
                  rows={2}
                  defaultValue={seo.og?.description ?? ''}
                  className={inputCls}
                />
              </Field>
            </div>
            <Field label="OG URL">
              <input name="og.url" defaultValue={seo.og?.url ?? ''} className={inputCls} />
            </Field>
            <Field label="OG Image URL">
              <input name="og.image" defaultValue={seo.og?.image ?? ''} className={inputCls} />
            </Field>
          </div>
        </section>

        {/* ── Twitter / X Card ────────────────────────────────── */}
        <section className={sectionCls}>
          <h2 className={sectionTitle}>Twitter / X Card</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Card Type">
              <select
                name="twitterCard.card"
                defaultValue={seo.twitterCard?.card ?? ''}
                className={inputCls}
              >
                <option value="">— None —</option>
                <option value="summary">summary</option>
                <option value="summary_large_image">summary_large_image</option>
                <option value="app">app</option>
                <option value="player">player</option>
              </select>
            </Field>
            <Field label="Twitter Title">
              <input
                name="twitterCard.title"
                defaultValue={seo.twitterCard?.title ?? ''}
                className={inputCls}
              />
            </Field>
            <div className="col-span-2">
              <Field label="Twitter Description">
                <textarea
                  name="twitterCard.description"
                  rows={2}
                  defaultValue={seo.twitterCard?.description ?? ''}
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Twitter Image URL">
                <input
                  name="twitterCard.image"
                  defaultValue={seo.twitterCard?.image ?? ''}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>
        </section>

        {/* ── Robots ──────────────────────────────────────────── */}
        <section className={sectionCls}>
          <h2 className={sectionTitle}>Robots</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {(
                [
                  { name: 'robots.index', label: 'Index' },
                  { name: 'robots.follow', label: 'Follow' },
                ] as const
              ).map(({ name, label }) => (
                <label key={name} className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    id={name}
                    name={name}
                    defaultChecked={
                      name === 'robots.index'
                        ? (seo.robots?.index ?? true)
                        : (seo.robots?.follow ?? true)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                GoogleBot overrides
              </p>
              <div className="grid grid-cols-2 gap-4">
                {(
                  [
                    { name: 'robots.googleBot.index', label: 'GoogleBot Index' },
                    { name: 'robots.googleBot.follow', label: 'GoogleBot Follow' },
                  ] as const
                ).map(({ name, label }) => (
                  <label key={name} className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      id={name}
                      name={name}
                      defaultChecked={
                        name === 'robots.googleBot.index'
                          ? (seo.robots?.googleBot?.index ?? true)
                          : (seo.robots?.googleBot?.follow ?? true)
                      }
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Alternates / hreflang ───────────────────────────── */}
        <section className={sectionCls}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className={sectionTitle + ' mb-0'}>Alternates (hreflang)</h2>
            <button
              type="button"
              onClick={() => setLangPairs((prev) => [...prev, { key: '', value: '' }])}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              + Add language
            </button>
          </div>
          {langPairs.length === 0 ? (
            <p className="text-sm text-gray-400">No alternates configured.</p>
          ) : (
            <div className="space-y-2">
              {langPairs.map((pair, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={pair.key}
                    onChange={(e) =>
                      setLangPairs((prev) =>
                        prev.map((p, j) => (j === i ? { ...p, key: e.target.value } : p)),
                      )
                    }
                    placeholder="en"
                    className="w-20 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">→</span>
                  <input
                    value={pair.value}
                    onChange={(e) =>
                      setLangPairs((prev) =>
                        prev.map((p, j) => (j === i ? { ...p, value: e.target.value } : p)),
                      )
                    }
                    placeholder="https://example.com/en"
                    className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setLangPairs((prev) => prev.filter((_, j) => j !== i))}
                    className="text-sm text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving…' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/seo')}
            className="rounded border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
