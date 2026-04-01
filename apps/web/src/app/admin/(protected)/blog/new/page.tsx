'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/admin/Button'
import { useToast } from '@/components/admin/Toast'
import { MediaPickerModal } from '@/components/admin/MediaPickerModal'
import type { ApiResponse, IBlogPostCreate, IBlogPost, ISEOPage } from '@falcanna/types'

const inputCls =
  'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelCls = 'block text-sm font-medium text-gray-700'
const sectionCls = 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
const sectionTitle = 'mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400'

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function NewBlogPostPage() {
  const router = useRouter()
  const { success, error: toastError, warning } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const [loading, setLoading] = useState(false)
  const [loadingContent, setLoadingContent] = useState(false)
  const [headerImage, setHeaderImage] = useState('')
  const [authorImage, setAuthorImage] = useState('')
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)
  const [mediaPickerTarget, setMediaPickerTarget] = useState<'header' | 'author'>('header')

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [slugManual, setSlugManual] = useState(false)
  const [canonical, setCanonical] = useState('')
  const [canonicalManual, setCanonicalManual] = useState(false)

  useEffect(() => {
    if (!slugManual) setSlug(slugify(title))
  }, [title, slugManual])

  useEffect(() => {
    if (!canonicalManual) setCanonical(slug ? `/blog/${slug}` : '')
  }, [slug, canonicalManual])

  function getFormData(): IBlogPostCreate | null {
    const form = formRef.current
    if (!form) return null
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value ?? ''
    return {
      title,
      slug,
      content: '',
      image: headerImage || undefined,
      excerpt: get('excerpt') || undefined,
      category: get('category'),
      author: get('author'),
      authorImage: authorImage || undefined,
      featured: (form.elements.namedItem('featured') as HTMLInputElement)?.checked ?? false,
      locale: get('locale') || 'es',
      publishedAt: get('publishedAt'),
      draft: (form.elements.namedItem('draft') as HTMLInputElement)?.checked ?? true,
    }
  }

  async function saveBlogWithSEO(blogData: IBlogPostCreate): Promise<string> {
    const form = formRef.current!
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value ?? ''

    const res = await apiClient.post<ApiResponse<IBlogPost>>('/blog/admin', blogData)
    const newId = res.data._id

    const seoTitle = get('seo.title')
    const seoDescription = get('seo.description')

    if (seoTitle && seoDescription) {
      const route = `/blog/${slug}`
      const seoPayload = {
        route,
        title: seoTitle,
        description: seoDescription,
        canonical: canonical || undefined,
        og: {
          title: get('seo.og.title') || undefined,
          description: get('seo.og.description') || undefined,
          image: get('seo.og.image') || undefined,
        },
      }
      let existingId: string | null = null
      try {
        const existing = await apiClient.get<ApiResponse<ISEOPage>>(
          `/seo?route=${encodeURIComponent(route)}`,
        )
        existingId = existing.data._id
      } catch {
        /* no SEO entry yet */
      }
      if (existingId) {
        await apiClient.put(`/seo/admin/${existingId}`, seoPayload)
      } else {
        await apiClient.post('/seo/admin', seoPayload)
      }
    }

    return newId
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const blogData = getFormData()
    if (!blogData) return
    setLoading(true)
    try {
      await saveBlogWithSEO(blogData)
      success('Post creado correctamente')
      router.push('/admin/blog')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Failed to create post', 'Error al crear')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveAndEditContent() {
    const blogData = getFormData()
    if (!blogData) return
    if (!blogData.title || !blogData.slug || !blogData.author || !blogData.publishedAt) {
      warning('Completa título, slug, autor y fecha antes de abrir el editor.')
      return
    }
    setLoadingContent(true)
    try {
      const newId = await saveBlogWithSEO({ ...blogData, draft: true })
      router.push(`/admin/blog/${newId}/content`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Failed to create post', 'Error al crear')
    } finally {
      setLoadingContent(false)
    }
  }

  return (
    <div className="flex flex-col">
      <MediaPickerModal
        open={mediaPickerOpen}
        folder="blog"
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          if (mediaPickerTarget === 'header') setHeaderImage(url)
          else setAuthorImage(url)
          setMediaPickerOpen(false)
        }}
      />

      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
        <div className="flex shrink-0 gap-3">
          <Button type="submit" form="blog-new-form" loading={loading}>
            Create Post
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push('/admin/blog')}>
            Cancel
          </Button>
        </div>
      </div>

      <form id="blog-new-form" ref={formRef} onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">

          {/* ── Left: blog ─────────────────────────────────── */}
          <div className="space-y-6">
            <section className={sectionCls}>
              <h2 className={sectionTitle}>Post details</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Slug</label>
                  <input
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value)
                      setSlugManual(true)
                    }}
                    required
                    className={inputCls}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Author</label>
                    <input name="author" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Published At</label>
                    <input name="publishedAt" type="date" required className={inputCls} />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      name="draft"
                      type="checkbox"
                      defaultChecked
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Draft</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      name="featured"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm font-medium text-gray-700">Destacado</span>
                  </label>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Extracto</label>
                    <textarea name="excerpt" rows={2} placeholder="Breve descripción (opcional)" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Categoría <span className="text-red-500">*</span></label>
                    <select name="category" required defaultValue="" className={inputCls}>
                      <option value="" disabled>Selecciona una categoría</option>
                      <option value="Cuidado capilar">Cuidado capilar</option>
                      <option value="Coloración">Coloración</option>
                      <option value="Rizos y método curly">Rizos y método curly</option>
                      <option value="Tendencias">Tendencias</option>
                      <option value="Eventos y ocasiones especiales">Eventos y ocasiones especiales</option>
                      <option value="Noticias de ¡Qué Bárbaro!">Noticias de ¡Qué Bárbaro!</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Idioma</label>
                    <select name="locale" defaultValue="es" className={inputCls}>
                      <option value="es">Español</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Header image */}
            <section className={sectionCls}>
              <h2 className={sectionTitle}>Imagen de cabecera</h2>
              <div className="flex items-start gap-4">
                {headerImage ? (
                  <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={headerImage} alt="Cabecera" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-28 w-44 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <svg className="h-8 w-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => { setMediaPickerTarget('header'); setMediaPickerOpen(true) }}>
                    {headerImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
                  </Button>
                  {headerImage && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setHeaderImage('')}>
                      Quitar imagen
                    </Button>
                  )}
                </div>
              </div>
            </section>

            {/* Author image */}
            <section className={sectionCls}>
              <h2 className={sectionTitle}>Foto del autor</h2>
              <div className="flex items-start gap-4">
                {authorImage ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={authorImage} alt="Autor" className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 bg-gray-50">
                    <svg className="h-5 w-5 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => { setMediaPickerTarget('author'); setMediaPickerOpen(true) }}>
                    {authorImage ? 'Cambiar foto' : 'Seleccionar foto'}
                  </Button>
                  {authorImage && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setAuthorImage('')}>
                      Quitar foto
                    </Button>
                  )}
                </div>
              </div>
            </section>

            {/* Content block */}
            <section className={sectionCls}>
              <h2 className={sectionTitle}>Content</h2>
              <p className="mb-4 text-sm text-gray-400 italic">
                El contenido se edita en el editor enriquecido. Guarda el post como borrador para acceder a él.
              </p>
              <Button
                type="button"
                variant="secondary"
                loading={loadingContent}
                onClick={handleSaveAndEditContent}
              >
                Guardar como borrador y editar contenido
              </Button>
            </section>
          </div>

          {/* ── Right: SEO ─────────────────────────────────── */}
          <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
            <section className={sectionCls}>
              <h2 className={sectionTitle}>SEO</h2>
              <div className="mb-4 rounded bg-gray-50 px-3 py-2 text-xs text-gray-500">
                Route:{' '}
                <span className="font-mono font-medium text-gray-700">
                  {slug ? `/blog/${slug}` : '-'}
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>
                    Title{' '}
                    <span className="font-normal text-gray-400">(requerido para guardar SEO)</span>
                  </label>
                  <input name="seo.title" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>
                    Description{' '}
                    <span className="font-normal text-gray-400">(requerido para guardar SEO)</span>
                  </label>
                  <textarea name="seo.description" rows={3} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Canonical URL</label>
                  <input
                    value={canonical}
                    onChange={(e) => {
                      setCanonical(e.target.value)
                      setCanonicalManual(true)
                    }}
                    className={inputCls}
                  />
                </div>
              </div>
            </section>

            <section className={sectionCls}>
              <h2 className={sectionTitle}>Open Graph</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>OG Title</label>
                  <input name="seo.og.title" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>OG Description</label>
                  <textarea name="seo.og.description" rows={2} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>OG Image URL</label>
                  <input name="seo.og.image" className={inputCls} />
                </div>
              </div>
            </section>
          </div>
        </div>

      </form>
    </div>
  )
}
