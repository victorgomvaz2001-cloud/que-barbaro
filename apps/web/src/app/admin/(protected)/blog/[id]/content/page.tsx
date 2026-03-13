'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { apiClient } from '@/lib/api-client'
import { RichTextEditor } from '@/components/admin/RichTextEditor'
import { Button } from '@/components/admin/Button'
import { Modal } from '@/components/admin/Modal'
import { useToast } from '@/components/admin/Toast'
import type { ApiResponse, IBlogPost } from '@falcanna/types'

export default function BlogContentEditorPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const { success, error: toastError } = useToast()
  const [post, setPost] = useState<IBlogPost | null>(null)
  const [saving, setSaving] = useState(false)
  const [showDiscardModal, setShowDiscardModal] = useState(false)

  const editorContentRef = useRef<string>('')
  const isDirtyRef = useRef(false)

  useEffect(() => {
    apiClient
      .get<ApiResponse<IBlogPost>>(`/blog/admin/${id}`)
      .then((res) => {
        setPost(res.data)
        editorContentRef.current = res.data.content
      })
      .catch(console.error)
  }, [id])

  function handleEditorChange(html: string) {
    editorContentRef.current = html
    isDirtyRef.current = html !== post?.content
  }

  async function handleSave() {
    setSaving(true)
    try {
      await apiClient.put(`/blog/admin/${id}`, { content: editorContentRef.current })
      isDirtyRef.current = false
      success('Contenido guardado correctamente')
      router.push(`/admin/blog/${id}`)
    } catch (err) {
      toastError(err instanceof Error ? err.message : 'Error al guardar', 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    if (isDirtyRef.current) {
      setShowDiscardModal(true)
    } else {
      router.push(`/admin/blog/${id}`)
    }
  }

  async function handleSaveAndExit() {
    setShowDiscardModal(false)
    await handleSave()
  }

  function handleDiscard() {
    setShowDiscardModal(false)
    router.push(`/admin/blog/${id}`)
  }

  if (!post) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="h-5 w-48 animate-pulse rounded bg-gray-200" />
          <div className="flex gap-2">
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
        <div className="flex-1 bg-white" />
      </div>
    )
  }

  return (
    <>
      <div className="flex h-full flex-col">
        {/* ── Topbar ─────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={handleCancel}
              className="shrink-0 text-sm text-gray-400 transition-colors hover:text-gray-700"
              title="Volver"
            >
              ← Volver
            </button>
            <span className="text-gray-300">/</span>
            <span className="truncate text-sm font-medium text-gray-700">{post.title}</span>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>

        {/* ── Editor ─────────────────────────────────────────────────────── */}
        <RichTextEditor
          content={post.content}
          onChange={handleEditorChange}
          placeholder="Empieza a escribir el contenido del artículo…"
          className="min-h-0 flex-1"
        />
      </div>

      {/* ── Modal: cambios sin guardar ─────────────────────────────────── */}
      <Modal
        open={showDiscardModal}
        title="Cambios sin guardar"
        description="Tienes cambios en el contenido que no se han guardado. ¿Qué quieres hacer?"
        onClose={() => setShowDiscardModal(false)}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => setShowDiscardModal(false)}>
              Seguir editando
            </Button>
            <Button variant="secondary" size="sm" onClick={handleDiscard}>
              Descartar cambios
            </Button>
            <Button variant="primary" size="sm" loading={saving} onClick={handleSaveAndExit}>
              Guardar y salir
            </Button>
          </>
        }
      />
    </>
  )
}
