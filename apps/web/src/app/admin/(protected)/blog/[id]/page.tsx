'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/admin/Button'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import type { ApiResponse, IBlogPost, ISEOPage } from '@falcanna/types'

const inputCls =
  'mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const labelCls = 'block text-sm font-medium text-gray-700'
const sectionCls = 'rounded-lg border border-gray-200 bg-white p-6 shadow-sm'
const sectionTitle = 'mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400'

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export default function EditBlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { success, error: toastError } = useToast()
  const [post, setPost] = useState<IBlogPost | null>(null)
  const [seoEntry, setSeoEntry] = useState<ISEOPage | null>(null)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showUnsavedModal, setShowUnsavedModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const formRef = useRef<HTMLFormElement>(null)
  const isDirtyRef = useRef(false)

  useEffect(() => {
    apiClient
      .get<ApiResponse<IBlogPost>>(`/blog/admin/${id}`)
      .then((res) => {
        setPost(res.data)
        apiClient
          .get<ApiResponse<ISEOPage>>(
            `/seo?route=${encodeURIComponent(`/blog/${res.data.slug}`)}`,
          )
          .then((seoRes) => setSeoEntry(seoRes.data))
          .catch(() => {})
      })
      .catch(console.error)
  }, [id])

  // Track dirty state on the form
  useEffect(() => {
    const form = formRef.current
    if (!form) return
    const mark = () => { isDirtyRef.current = true }
    form.addEventListener('input', mark)
    form.addEventListener('change', mark)
    return () => {
      form.removeEventListener('input', mark)
      form.removeEventListener('change', mark)
    }
  }, [post]) // re-attach after post loads

  function getFormValues() {
    const form = formRef.current
    if (!form) return null
    const get = (name: string) =>
      (form.elements.namedItem(name) as HTMLInputElement)?.value ?? ''
    return {
      blog: {
        title: get('title'),
        content: post?.content ?? '',
        author: get('author'),
        publishedAt: get('publishedAt'),
        draft: (form.elements.namedItem('draft') as HTMLInputElement)?.checked ?? false,
      },
      seo: {
        title: get('seo.title'),
        description: get('seo.description'),
        canonical: get('seo.canonical'),
        ogTitle: get('seo.og.title'),
        ogDescription: get('seo.og.description'),
        ogImage: get('seo.og.image'),
      },
    }
  }

  async function saveBlog() {
    const values = getFormValues()
    if (!values) return

    await apiClient.put(`/blog/admin/${id}`, values.blog)

    if (values.seo.title && values.seo.description) {
      const route = `/blog/${post!.slug}`
      const seoPayload = {
        route,
        title: values.seo.title,
        description: values.seo.description,
        canonical: values.seo.canonical || undefined,
        og: {
          title: values.seo.ogTitle || undefined,
          description: values.seo.ogDescription || undefined,
          image: values.seo.ogImage || undefined,
        },
      }
      if (seoEntry) {
        await apiClient.put(`/seo/admin/${seoEntry._id}`, seoPayload)
      } else {
        const res = await apiClient.post<ApiResponse<ISEOPage>>('/seo/admin', seoPayload)
        setSeoEntry(res.data)
      }
    }
    isDirtyRef.current = false
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await saveBlog()
      success('Post guardado correctamente')
      router.push('/admin/blog')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Failed to update post', 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${post!.title}"?`)) return
    setDeleting(true)
    try {
      await apiClient.delete(`/blog/admin/${id}`)
      success(`"${post!.title}" eliminado correctamente`)
      router.push('/admin/blog')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al eliminar', 'Error')
    } finally {
      setDeleting(false)
    }
  }

  function handleCancel() {
    if (isDirtyRef.current) {
      setShowCancelModal(true)
    } else {
      router.push('/admin/blog')
    }
  }

  async function handleSaveAndCancel() {
    setShowCancelModal(false)
    setLoading(true)
    try {
      await saveBlog()
      router.push('/admin/blog')
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Failed to save', 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  function handleEditContent() {
    if (isDirtyRef.current) {
      setShowUnsavedModal(true)
    } else {
      router.push(`/admin/blog/${id}/content`)
    }
  }

  async function handleSaveAndEditContent() {
    setShowUnsavedModal(false)
    setLoading(true)
    try {
      await saveBlog()
      router.push(`/admin/blog/${id}/content`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Failed to save', 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  if (!post) return <p className="text-gray-500">Loading…</p>

  const contentPreview = stripHtml(post.content)

  return (
    <>
      <div className="flex flex-col">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h1 className="shrink-0 text-2xl font-bold text-gray-900">
            Edit Blog Post{' '}
            <span className="font-mono text-lg font-normal text-gray-400">{post.slug}</span>
          </h1>
          <div className="flex shrink-0 gap-3">
            <Button type="submit" form="blog-edit-form" loading={loading}>
              Save Changes
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="button" variant="danger" loading={deleting} onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        <form id="blog-edit-form" ref={formRef} onSubmit={handleSubmit} className="flex flex-col">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">

            {/* ── Left: blog ─────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              <section className={sectionCls}>
                <h2 className={sectionTitle}>Post details</h2>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Title</label>
                    <input name="title" defaultValue={post.title} required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Slug</label>
                    <input
                      value={post.slug}
                      readOnly
                      className="mt-1 w-full cursor-default rounded border border-gray-200 bg-gray-50 px-3 py-2 font-mono text-sm text-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Author</label>
                      <input name="author" defaultValue={post.author} required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Published At</label>
                      <input
                        name="publishedAt"
                        type="date"
                        defaultValue={post.publishedAt}
                        required
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      name="draft"
                      type="checkbox"
                      defaultChecked={post.draft}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Draft</span>
                  </label>
                </div>
              </section>

              {/* Content preview + editor button */}
              <section className={sectionCls + ' flex flex-1 flex-col'}>
                <div className="flex shrink-0 items-center justify-between">
                  <h2 className={sectionTitle + ' mb-0'}>Content</h2>
                  <Button type="button" variant="secondary" size="sm" onClick={handleEditContent}>
                    Editar contenido
                  </Button>
                </div>
                <div className="mt-4 flex-1">
                  {contentPreview ? (
                    <p className="line-clamp-4 text-sm text-gray-500">{contentPreview}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Sin contenido. Pulsa "Editar contenido" para empezar.</p>
                  )}
                </div>
              </section>
            </div>

            {/* ── Right: SEO ─────────────────────────────────── */}
            <div className="space-y-6 xl:sticky xl:top-8 xl:self-start">
              <section className={sectionCls}>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className={sectionTitle + ' mb-0'}>SEO</h2>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      seoEntry ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {seoEntry ? 'Linked' : 'Not linked'}
                  </span>
                </div>
                <div className="mb-4 rounded bg-gray-50 px-3 py-2 text-xs text-gray-500">
                  Route:{' '}
                  <span className="font-mono font-medium text-gray-700">/blog/{post.slug}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      Title{' '}
                      <span className="font-normal text-gray-400">(requerido para guardar SEO)</span>
                    </label>
                    <input name="seo.title" defaultValue={seoEntry?.title ?? ''} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>
                      Description{' '}
                      <span className="font-normal text-gray-400">(requerido para guardar SEO)</span>
                    </label>
                    <textarea
                      name="seo.description"
                      rows={3}
                      defaultValue={seoEntry?.description ?? ''}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Canonical URL</label>
                    <input
                      name="seo.canonical"
                      defaultValue={seoEntry?.canonical ?? `/blog/${post.slug}`}
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
                    <input name="seo.og.title" defaultValue={seoEntry?.og?.title ?? ''} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>OG Description</label>
                    <textarea
                      name="seo.og.description"
                      rows={2}
                      defaultValue={seoEntry?.og?.description ?? ''}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>OG Image URL</label>
                    <input name="seo.og.image" defaultValue={seoEntry?.og?.image ?? ''} className={inputCls} />
                  </div>
                </div>
              </section>
            </div>
          </div>

        </form>
      </div>

      {/* ── Modal: cambios sin guardar al editar contenido ──────────────── */}
      <Modal
        open={showUnsavedModal}
        title="Cambios sin guardar"
        description="Tienes cambios sin guardar en el formulario. Guárdalos antes de editar el contenido para no perderlos."
        onClose={() => setShowUnsavedModal(false)}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowUnsavedModal(false)}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={loading}
              onClick={handleSaveAndEditContent}
            >
              Guardar y continuar
            </Button>
          </>
        }
      />

      {/* ── Modal: cambios sin guardar al salir ──────────────────────────── */}
      <Modal
        open={showCancelModal}
        title="Cambios sin guardar"
        description="Tienes cambios sin guardar en el formulario. ¿Qué quieres hacer?"
        onClose={() => setShowCancelModal(false)}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowCancelModal(false)}>
              Seguir editando
            </Button>
            <Button variant="secondary" size="sm" onClick={() => router.push('/admin/blog')}>
              Descartar cambios
            </Button>
            <Button variant="primary" size="sm" loading={loading} onClick={handleSaveAndCancel}>
              Guardar y salir
            </Button>
          </>
        }
      />
    </>
  )
}
