'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import type { ApiResponse, IMediaItem, PresignedUrlResponse } from '@falcanna/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  /** Called with a single URL (single mode or library selection) */
  onSelect: (url: string) => void
  /** Called with all uploaded URLs after a multi-upload completes */
  onSelectMultiple?: (urls: string[]) => void
  /** Allow selecting / uploading multiple files at once. Default: false */
  multiple?: boolean
  /** S3 folder where new uploads will be stored. Default: "uploads" */
  folder?: string
}

type Tab = 'library' | 'upload'
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error'
type QueueStatus = 'pending' | 'uploading' | 'done' | 'error'

interface QueueItem {
  id: string
  file: File
  status: QueueStatus
  progress: number
  url: string
  error: string
}

const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/avif'
const MAX_BYTES = 10 * 1024 * 1024 // 10 MB

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function filename(key: string) {
  return key.split('/').pop() ?? key
}

function uid() {
  return Math.random().toString(36).slice(2)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  onSelectMultiple,
  multiple = false,
  folder = 'uploads',
}: MediaPickerModalProps) {
  const [tab, setTab] = useState<Tab>('library')

  // Library state
  const [items, setItems]           = useState<IMediaItem[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const [libraryError, setLibraryError]     = useState('')
  const [selected, setSelected]     = useState<IMediaItem | null>(null)
  const [search, setSearch]         = useState('')

  // ── Single upload state (multiple=false) ────────────────────────────────────
  const [file, setFile]                   = useState<File | null>(null)
  const [uploadStatus, setUploadStatus]   = useState<UploadStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl]     = useState('')
  const [uploadError, setUploadError]     = useState('')

  // ── Multi upload state (multiple=true) ──────────────────────────────────────
  const [queue, setQueue]         = useState<QueueItem[]>([])
  const [uploading, setUploading] = useState(false)

  // Shared
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Fetch library on open / tab switch
  useEffect(() => {
    if (!open || tab !== 'library') return
    setLoadingLibrary(true)
    setLibraryError('')
    apiClient
      .get<ApiResponse<IMediaItem[]>>('/admin/upload/media')
      .then((res) => setItems(res.data))
      .catch((err) => setLibraryError(err.message ?? 'Error al cargar'))
      .finally(() => setLoadingLibrary(false))
  }, [open, tab])

  // Reset upload state on tab switch
  useEffect(() => {
    if (tab === 'upload') {
      setFile(null); setUploadStatus('idle'); setUploadProgress(0)
      setUploadedUrl(''); setUploadError('')
      setQueue([]); setUploading(false)
    }
  }, [tab])

  // Reset everything on close
  useEffect(() => {
    if (!open) { setSelected(null); setSearch(''); setTab('library') }
  }, [open])

  // ── Validation ──────────────────────────────────────────────────────────────

  function validateFile(f: File): string | null {
    if (!f.type.startsWith('image/')) return 'El archivo debe ser una imagen.'
    if (f.size > MAX_BYTES) return `El archivo supera ${formatBytes(MAX_BYTES)}.`
    return null
  }

  // ── Single upload logic ─────────────────────────────────────────────────────

  function pickFile(f: File) {
    const err = validateFile(f)
    if (err) { setUploadError(err); return }
    setFile(f); setUploadError(''); setUploadStatus('idle'); setUploadedUrl('')
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (multiple) {
      const files = Array.from(e.target.files ?? [])
      addToQueue(files)
    } else {
      const f = e.target.files?.[0]
      if (f) pickFile(f)
    }
    // reset input so same file can be re-selected
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (multiple) {
      addToQueue(files)
    } else {
      if (files[0]) pickFile(files[0])
    }
  }

  async function handleUploadSingle() {
    if (!file) return
    setUploadStatus('uploading'); setUploadProgress(0); setUploadError('')
    try {
      const { data } = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
        '/admin/upload/presigned-url',
        { fileName: file.name, fileType: file.type, folder },
      )
      await xhrUpload(data.uploadUrl, file, (p) => setUploadProgress(p))
      setUploadedUrl(data.fileUrl); setUploadStatus('done'); setUploadProgress(100)
    } catch (err) {
      setUploadStatus('error')
      setUploadError(err instanceof Error ? err.message : 'Error al subir')
    }
  }

  function handleConfirmUpload() {
    if (uploadedUrl) { onSelect(uploadedUrl); onClose() }
  }

  // ── Multi upload logic ──────────────────────────────────────────────────────

  function addToQueue(files: File[]) {
    const valid = files.filter((f) => !validateFile(f))
    setQueue((prev) => [
      ...prev,
      ...valid.map((f) => ({ id: uid(), file: f, status: 'pending' as QueueStatus, progress: 0, url: '', error: '' })),
    ])
  }

  async function uploadQueueItem(item: QueueItem) {
    setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: 'uploading', progress: 0 } : q))
    try {
      const { data } = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
        '/admin/upload/presigned-url',
        { fileName: item.file.name, fileType: item.file.type, folder },
      )
      await xhrUpload(data.uploadUrl, item.file, (p) => {
        setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, progress: p } : q))
      })
      setQueue((prev) => prev.map((q) => q.id === item.id ? { ...q, status: 'done', progress: 100, url: data.fileUrl } : q))
    } catch (err) {
      setQueue((prev) => prev.map((q) =>
        q.id === item.id ? { ...q, status: 'error', error: err instanceof Error ? err.message : 'Error' } : q,
      ))
    }
  }

  async function handleUploadAll() {
    const toUpload = queue.filter((q) => q.status === 'pending' || q.status === 'error')
    if (!toUpload.length) return
    setUploading(true)
    await Promise.all(toUpload.map((item) => uploadQueueItem(item)))
    setUploading(false)
  }

  function handleConfirmMultiple() {
    const urls = queue.filter((q) => q.status === 'done').map((q) => q.url)
    if (!urls.length) return
    if (onSelectMultiple) {
      onSelectMultiple(urls)
    } else {
      urls.forEach((url) => onSelect(url))
    }
    onClose()
  }

  // ── XHR helper ─────────────────────────────────────────────────────────────

  function xhrUpload(url: string, f: File, onProgress: (p: number) => void) {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.upload.addEventListener('progress', (ev) => {
        if (ev.lengthComputable) onProgress(Math.round((ev.loaded / ev.total) * 100))
      })
      xhr.addEventListener('load', () => {
        xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`S3 error ${xhr.status}`))
      })
      xhr.addEventListener('error', () => reject(new Error('Error de red')))
      xhr.open('PUT', url)
      xhr.setRequestHeader('Content-Type', f.type)
      xhr.send(f)
    })
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const filtered = search.trim()
    ? items.filter((item) => filename(item.key).toLowerCase().includes(search.toLowerCase()))
    : items

  const queuePending  = queue.filter((q) => q.status === 'pending').length
  const queueError    = queue.filter((q) => q.status === 'error').length
  const queueDone     = queue.filter((q) => q.status === 'done').length
  const queueTotal    = queue.length
  const allDone       = queueTotal > 0 && queueDone === queueTotal
  const canUploadMore = queuePending + queueError > 0 && !uploading

  const handleConfirmSelection = useCallback(() => {
    if (selected) { onSelect(selected.url); onClose() }
  }, [selected, onSelect, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" onClick={onClose} />

      <div className="relative z-10 flex h-[80vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {multiple ? 'Subir imágenes' : 'Seleccionar imagen'}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Cerrar">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex shrink-0 border-b border-gray-200 px-6">
          {(['library', 'upload'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                'mr-6 border-b-2 py-3 text-sm font-medium transition-colors',
                tab === t ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700',
              ].join(' ')}
            >
              {t === 'library' ? 'Biblioteca' : multiple ? 'Subir imágenes' : 'Subir imagen'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">

          {/* ── Library tab ──────────────────────────────────────────────── */}
          {tab === 'library' && (
            <div className="flex h-full flex-col">
              <div className="shrink-0 border-b border-gray-100 px-6 py-3">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input type="text" placeholder="Buscar por nombre…" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loadingLibrary && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {Array.from({ length: 15 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-lg bg-gray-100" />)}
                  </div>
                )}
                {libraryError && <div className="flex h-full items-center justify-center"><p className="text-sm text-red-500">{libraryError}</p></div>}
                {!loadingLibrary && !libraryError && filtered.length === 0 && (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                    <svg className="h-12 w-12 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <p className="text-sm">{search ? 'Sin resultados para esa búsqueda' : 'No hay imágenes en el bucket'}</p>
                  </div>
                )}
                {!loadingLibrary && filtered.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
                    {filtered.map((item) => {
                      const isSelected = selected?.key === item.key
                      return (
                        <button key={item.key} onClick={() => setSelected(isSelected ? null : item)} onDoubleClick={() => { onSelect(item.url); onClose() }}
                          className={['group relative aspect-square overflow-hidden rounded-lg border-2 transition-all focus:outline-none', isSelected ? 'border-gray-900 shadow-lg' : 'border-transparent hover:border-gray-300'].join(' ')}
                          title={filename(item.key)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.url} alt={filename(item.key)} className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <p className="truncate text-[10px] text-white">{filename(item.key)}</p>
                            <p className="text-[9px] text-white/70">{formatBytes(item.size)}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900">
                              <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Upload tab — single ──────────────────────────────────────── */}
          {tab === 'upload' && !multiple && (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-8 py-8">
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={['flex w-full max-w-lg cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed px-8 py-12 transition-colors', isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'].join(' ')}
              >
                <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700">{file ? file.name : 'Arrastra una imagen aquí o haz clic para seleccionar'}</p>
                  {file ? <p className="mt-1 text-xs text-gray-400">{formatBytes(file.size)}</p> : <p className="mt-1 text-xs text-gray-400">JPG, PNG, GIF, WebP, SVG, AVIF · Máx. 10 MB</p>}
                </div>
                <input ref={fileInputRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFileChange} />
              </div>

              {file && uploadStatus !== 'done' && (
                <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}

              {uploadStatus === 'uploading' && (
                <div className="w-full max-w-lg">
                  <div className="mb-1 flex justify-between text-xs text-gray-500"><span>Subiendo…</span><span>{uploadProgress}%</span></div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gray-900 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}

              {uploadStatus === 'done' && uploadedUrl && (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-gray-200 shadow">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={uploadedUrl} alt="Subida" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
                        <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-green-600">Imagen subida correctamente</p>
                </div>
              )}

              {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

              <div className="flex gap-3">
                {uploadStatus === 'idle' && file && <button onClick={handleUploadSingle} className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700">Subir imagen</button>}
                {uploadStatus === 'error' && <button onClick={handleUploadSingle} className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700">Reintentar</button>}
                {uploadStatus === 'done' && <button onClick={handleConfirmUpload} className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700">Usar esta imagen</button>}
              </div>
            </div>
          )}

          {/* ── Upload tab — multiple ────────────────────────────────────── */}
          {tab === 'upload' && multiple && (
            <div className="flex h-full flex-col gap-4 p-6">

              {/* Drop zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={['flex cursor-pointer flex-col items-center gap-3 rounded-xl border-2 border-dashed px-8 py-8 transition-colors', isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'].join(' ')}
              >
                <svg className="h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="text-sm font-medium text-gray-600">Arrastra imágenes aquí o haz clic para seleccionar</p>
                <p className="text-xs text-gray-400">JPG, PNG, GIF, WebP, SVG, AVIF · Máx. 10 MB por imagen</p>
                <input ref={fileInputRef} type="file" accept={ACCEPTED} multiple className="hidden" onChange={handleFileChange} />
              </div>

              {/* Queue */}
              {queue.length > 0 && (
                <div className="flex-1 overflow-y-auto rounded-lg border border-gray-200">
                  <div className="divide-y divide-gray-100">
                    {queue.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                        {/* Thumbnail */}
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(item.file)} alt="" className="h-full w-full object-cover" />
                        </div>

                        {/* Info + progress */}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium text-gray-700">{item.file.name}</p>
                          <p className="text-[10px] text-gray-400">{formatBytes(item.file.size)}</p>
                          {item.status === 'uploading' && (
                            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full rounded-full bg-gray-900 transition-all duration-200" style={{ width: `${item.progress}%` }} />
                            </div>
                          )}
                          {item.status === 'error' && <p className="mt-0.5 text-[10px] text-red-500">{item.error}</p>}
                        </div>

                        {/* Status icon */}
                        <div className="shrink-0">
                          {item.status === 'pending' && <span className="text-[10px] text-gray-400">Pendiente</span>}
                          {item.status === 'uploading' && <span className="text-[10px] text-gray-500">{item.progress}%</span>}
                          {item.status === 'done' && (
                            <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                          )}
                          {item.status === 'error' && (
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                          )}
                        </div>

                        {/* Remove (only pending) */}
                        {item.status === 'pending' && (
                          <button onClick={() => setQueue((prev) => prev.filter((q) => q.id !== item.id))} className="shrink-0 text-gray-300 hover:text-gray-500">
                            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Summary + actions */}
              {queue.length > 0 && (
                <div className="flex shrink-0 items-center justify-between">
                  <p className="text-xs text-gray-400">
                    {queueDone} de {queueTotal} subidas
                    {queueError > 0 && <span className="ml-2 text-red-500">{queueError} con error</span>}
                  </p>
                  <div className="flex gap-2">
                    {canUploadMore && (
                      <button onClick={handleUploadAll} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50" disabled={uploading}>
                        {uploading ? 'Subiendo…' : `Subir ${queuePending + queueError} imagen${queuePending + queueError !== 1 ? 'es' : ''}`}
                      </button>
                    )}
                    {queueDone > 0 && (
                      <button onClick={handleConfirmMultiple} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700">
                        {allDone ? `Añadir ${queueDone} foto${queueDone !== 1 ? 's' : ''}` : `Añadir ${queueDone} subida${queueDone !== 1 ? 's' : ''}`}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer (library tab) */}
        {tab === 'library' && (
          <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3">
            <p className="text-xs text-gray-400">
              {selected
                ? <span className="font-medium text-gray-700">{filename(selected.key)}</span>
                : items.length > 0 ? `${filtered.length} imagen${filtered.length !== 1 ? 'es' : ''}` : ''}
            </p>
            <div className="flex items-center gap-2">
              <button onClick={onClose} className="rounded-lg border border-gray-200 px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-100">Cancelar</button>
              <button onClick={handleConfirmSelection} disabled={!selected} className="rounded-lg bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-40">Seleccionar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
