'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { apiClient } from '@/lib/api-client'
import { useToast } from '@/components/admin/Toast'
import type { ApiResponse, IMediaItem, PresignedUrlResponse } from '@falcanna/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface MediaPickerModalProps {
  open: boolean
  onClose: () => void
  onSelect: (url: string) => void
  onSelectMultiple?: (urls: string[]) => void
  multiple?: boolean
  folder?: string
}

type Tab = 'library' | 'upload'
type UploadStatus = 'idle' | 'crop' | 'uploading' | 'done' | 'error'
type QueueStatus = 'pending' | 'uploading' | 'done' | 'error'

interface QueueItem {
  id: string
  file: File
  name: string     // editable filename (without extension)
  status: QueueStatus
  progress: number
  url: string
  error: string
  editingName: boolean
}

const ACCEPTED = 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/avif'
const MAX_BYTES = 10 * 1024 * 1024

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function filename(key: string) { return key.split('/').pop() ?? key }
function uid() { return Math.random().toString(36).slice(2) }
function stripExt(name: string) { return name.replace(/\.[^.]+$/, '') }
function getExt(name: string) { return name.split('.').pop() ?? 'jpg' }

// ─── Crop aspects ─────────────────────────────────────────────────────────────

const CROP_ASPECTS = [
  { label: 'Libre',  ratio: null as number | null },
  { label: '1:1',    ratio: 1 },
  { label: '4:3',    ratio: 4 / 3 },
  { label: '16:9',   ratio: 16 / 9 },
  { label: '3:4',    ratio: 3 / 4 },
  { label: '9:16',   ratio: 9 / 16 },
]

// ─── CropEditor ───────────────────────────────────────────────────────────────

function CropEditor({
  file,
  onConfirm,
  onCancel,
}: {
  file: File
  onConfirm: (f: File) => void
  onCancel: () => void
}) {
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file])
  useEffect(() => () => URL.revokeObjectURL(objectUrl), [objectUrl])

  const viewportRef = useRef<HTMLDivElement>(null)
  const imgElRef    = useRef<HTMLImageElement | null>(null)

  const [naturalW, setNaturalW] = useState(0)
  const [naturalH, setNaturalH] = useState(0)
  const [aspect,   setAspect]   = useState<number | null>(null) // null = libre
  const [scale,    setScale]    = useState(1)
  const [offset,   setOffset]   = useState({ x: 0, y: 0 })
  const [fileName, setFileName] = useState(stripExt(file.name))
  const [processing, setProcessing] = useState(false)

  // Drag refs - avoid re-renders mid-drag
  const dragging      = useRef(false)
  const lastMouse     = useRef({ x: 0, y: 0 })
  const lastPinchDist = useRef(0)

  // Keep scale accessible in closures without stale values
  const scaleRef  = useRef(scale)
  const offsetRef = useRef(offset)
  useEffect(() => { scaleRef.current = scale },  [scale])
  useEffect(() => { offsetRef.current = offset }, [offset])

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getViewport() {
    const el = viewportRef.current
    if (!el) return { vW: 0, vH: 0 }
    const r = el.getBoundingClientRect()
    return { vW: r.width, vH: r.height }
  }

  function minScale(vW: number, vH: number, nW: number, nH: number) {
    if (!nW || !nH || !vW || !vH) return 1
    return Math.max(vW / nW, vH / nH)
  }

  function clamp(ox: number, oy: number, sc: number, vW: number, vH: number, nW: number, nH: number) {
    const maxX = Math.max(0, (nW * sc - vW) / 2)
    const maxY = Math.max(0, (nH * sc - vH) / 2)
    return {
      x: Math.max(-maxX, Math.min(maxX, ox)),
      y: Math.max(-maxY, Math.min(maxY, oy)),
    }
  }

  function reset(nW = naturalW, nH = naturalH) {
    const { vW, vH } = getViewport()
    const ms = minScale(vW, vH, nW, nH)
    setScale(ms)
    setOffset({ x: 0, y: 0 })
  }

  // ── Image load ────────────────────────────────────────────────────────────

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget
    imgElRef.current = img
    const nW = img.naturalWidth
    const nH = img.naturalHeight
    setNaturalW(nW)
    setNaturalH(nH)
    // wait for viewport to have rendered with correct dimensions
    setTimeout(() => reset(nW, nH), 0)
  }

  // Re-init when aspect changes
  useEffect(() => {
    if (!naturalW) return
    setTimeout(() => reset(), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aspect])

  // ── Non-passive wheel listener ─────────────────────────────────────────────

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const factor = e.deltaY < 0 ? 1.08 : 0.93
      const { vW, vH } = getViewport()
      const ms = minScale(vW, vH, naturalW, naturalH)
      setScale((prev) => {
        const next = Math.max(ms, Math.min(prev * factor, ms * 6))
        setOffset((po) => clamp(po.x, po.y, next, vW, vH, naturalW, naturalH))
        return next
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [naturalW, naturalH])

  // ── Non-passive touch listener (to allow preventDefault) ──────────────────

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    function onTouchMove(e: TouchEvent) {
      e.preventDefault()
      const ts = Array.from(e.touches)
      const { vW, vH } = getViewport()
      const ms = minScale(vW, vH, naturalW, naturalH)

      if (ts.length === 1) {
        const dx = ts[0]!.clientX - lastMouse.current.x
        const dy = ts[0]!.clientY - lastMouse.current.y
        lastMouse.current = { x: ts[0]!.clientX, y: ts[0]!.clientY }
        setOffset((po) => clamp(po.x + dx, po.y + dy, scaleRef.current, vW, vH, naturalW, naturalH))
      } else if (ts.length === 2) {
        const dx = ts[1]!.clientX - ts[0]!.clientX
        const dy = ts[1]!.clientY - ts[0]!.clientY
        const dist = Math.sqrt(dx * dx + dy * dy)
        const factor = dist / (lastPinchDist.current || dist)
        lastPinchDist.current = dist
        setScale((prev) => {
          const next = Math.max(ms, Math.min(prev * factor, ms * 6))
          setOffset((po) => clamp(po.x, po.y, next, vW, vH, naturalW, naturalH))
          return next
        })
      }
    }

    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', onTouchMove)
  }, [naturalW, naturalH])

  // ── Mouse handlers ────────────────────────────────────────────────────────

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    dragging.current = true
    lastMouse.current = { x: e.clientX, y: e.clientY }
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!dragging.current) return
    const dx = e.clientX - lastMouse.current.x
    const dy = e.clientY - lastMouse.current.y
    lastMouse.current = { x: e.clientX, y: e.clientY }
    const { vW, vH } = getViewport()
    setOffset((po) => clamp(po.x + dx, po.y + dy, scaleRef.current, vW, vH, naturalW, naturalH))
  }

  function onMouseUp() { dragging.current = false }

  // ── Touch start ───────────────────────────────────────────────────────────

  function onTouchStart(e: React.TouchEvent) {
    const ts = Array.from(e.touches)
    if (ts.length === 1) {
      lastMouse.current = { x: ts[0]!.clientX, y: ts[0]!.clientY }
    } else if (ts.length === 2) {
      const dx = ts[1]!.clientX - ts[0]!.clientX
      const dy = ts[1]!.clientY - ts[0]!.clientY
      lastPinchDist.current = Math.sqrt(dx * dx + dy * dy)
    }
  }

  // ── Confirm (draw to canvas → File) ────────────────────────────────────────

  async function handleConfirm() {
    const img = imgElRef.current
    if (!img || !naturalW || !naturalH) return
    setProcessing(true)

    const { vW, vH } = getViewport()
    const sc = scaleRef.current
    const { x: ox, y: oy } = offsetRef.current

    // Source region in natural image coords
    const srcX = naturalW / 2 - (vW / 2 + ox) / sc
    const srcY = naturalH / 2 - (vH / 2 + oy) / sc
    const srcW = vW / sc
    const srcH = vH / sc

    // Clamp to image bounds
    const clampedX = Math.max(0, srcX)
    const clampedY = Math.max(0, srcY)
    const clampedW = Math.min(srcW + Math.min(0, srcX), naturalW - clampedX)
    const clampedH = Math.min(srcH + Math.min(0, srcY), naturalH - clampedY)

    // Output at 2× for sharpness
    const outW = Math.round(Math.max(1, clampedW) * 2)
    const outH = Math.round(Math.max(1, clampedH) * 2)

    const canvas = document.createElement('canvas')
    canvas.width  = outW
    canvas.height = outH
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, clampedX, clampedY, clampedW, clampedH, 0, 0, outW, outH)

    const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    canvas.toBlob((blob) => {
      if (!blob) { setProcessing(false); return }
      const outFile = new File([blob], `${fileName || 'imagen'}.${getExt(file.name)}`, { type: mimeType })
      onConfirm(outFile)
    }, mimeType, 0.92)
  }

  // ── Viewport height based on aspect ratio ─────────────────────────────────

  const viewportAspect = aspect !== null
    ? aspect
    : (naturalW && naturalH ? naturalW / naturalH : 4 / 3)

  return (
    <div className="flex flex-col gap-4 p-6">

      {/* Rename */}
      <div className="flex items-center gap-2">
        <label className="w-14 shrink-0 text-xs font-medium text-gray-600">Nombre</label>
        <input
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="nombre-del-archivo"
          className="flex-1 rounded border border-gray-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <span className="shrink-0 text-xs text-gray-400">.{getExt(file.name)}</span>
      </div>

      {/* Aspect ratio */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-gray-600">Recorte</span>
        {CROP_ASPECTS.map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => setAspect(a.ratio)}
            className={[
              'rounded border px-2.5 py-1 text-[11px] transition-colors',
              aspect === a.ratio
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-300 text-gray-600 hover:border-gray-500',
            ].join(' ')}
          >
            {a.label}
          </button>
        ))}
        <span className="ml-auto text-[10px] text-gray-400 hidden sm:block">
          Scroll = zoom &nbsp;·&nbsp; Arrastra = mover
        </span>
      </div>

      {/* Viewport */}
      <div
        ref={viewportRef}
        className="relative mx-auto w-full overflow-hidden rounded-lg border-2 border-gray-800 bg-black select-none"
        style={{
          aspectRatio: String(viewportAspect),
          maxHeight: '360px',
          cursor: dragging.current ? 'grabbing' : 'grab',
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={objectUrl}
          alt=""
          onLoad={onImgLoad}
          draggable={false}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            maxWidth: 'none',
            maxHeight: 'none',
            pointerEvents: 'none',
            userSelect: 'none',
            transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: 'center',
          }}
        />
        {/* Rule-of-thirds guides */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),' +
              'linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)',
            backgroundSize: '33.33% 33.33%',
          }}
          aria-hidden
        />
        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map((corner) => (
          <div
            key={corner}
            className="pointer-events-none absolute w-5 h-5"
            style={{
              top:    corner.startsWith('t') ? 4 : undefined,
              bottom: corner.startsWith('b') ? 4 : undefined,
              left:   corner.endsWith('l')   ? 4 : undefined,
              right:  corner.endsWith('r')   ? 4 : undefined,
              borderTop:    corner.startsWith('t') ? '2px solid rgba(255,255,255,0.8)' : undefined,
              borderBottom: corner.startsWith('b') ? '2px solid rgba(255,255,255,0.8)' : undefined,
              borderLeft:   corner.endsWith('l')   ? '2px solid rgba(255,255,255,0.8)' : undefined,
              borderRight:  corner.endsWith('r')   ? '2px solid rgba(255,255,255,0.8)' : undefined,
            }}
            aria-hidden
          />
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => reset()}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          ↺ Restablecer
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={processing || !naturalW}
            className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {processing ? 'Procesando…' : 'Confirmar recorte'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MediaPickerModal ─────────────────────────────────────────────────────────

export function MediaPickerModal({
  open,
  onClose,
  onSelect,
  onSelectMultiple,
  multiple = false,
  folder = 'uploads',
}: MediaPickerModalProps) {
  const { error: toastError } = useToast()
  const [tab, setTab] = useState<Tab>('library')

  // Library state
  const [items, setItems]                   = useState<IMediaItem[]>([])
  const [loadingLibrary, setLoadingLibrary] = useState(false)
  const [libraryError, setLibraryError]     = useState('')
  const [selected, setSelected]             = useState<IMediaItem | null>(null)
  const [search, setSearch]                 = useState('')

  // Single upload state
  const [cropFile, setCropFile]             = useState<File | null>(null)  // waiting to be cropped
  const [file, setFile]                     = useState<File | null>(null)  // cropped & ready
  const [uploadStatus, setUploadStatus]     = useState<UploadStatus>('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl]       = useState('')
  const [uploadError, setUploadError]       = useState('')

  // Multi upload state
  const [queue, setQueue]         = useState<QueueItem[]>([])
  const [uploading, setUploading] = useState(false)
  const [cropQueueId, setCropQueueId] = useState<string | null>(null)

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
    setLoadingLibrary(true); setLibraryError('')
    apiClient
      .get<ApiResponse<IMediaItem[]>>('/admin/upload/media')
      .then((res) => setItems(res.data))
      .catch((err) => setLibraryError(err.message ?? 'Error al cargar'))
      .finally(() => setLoadingLibrary(false))
  }, [open, tab])

  // Reset upload state on tab switch
  useEffect(() => {
    if (tab === 'upload') {
      setCropFile(null); setFile(null)
      setUploadStatus('idle'); setUploadProgress(0)
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

  // ── Single upload ───────────────────────────────────────────────────────────

  function pickRawFile(f: File) {
    const err = validateFile(f)
    if (err) {
      toastError(err, 'Archivo no válido')
      return
    }
    // Open crop editor
    setCropFile(f)
    setUploadStatus('crop')
    setUploadError('')
  }

  function handleCropConfirm(croppedFile: File) {
    setCropFile(null)
    setFile(croppedFile)
    setUploadStatus('idle')
  }

  function handleCropCancel() {
    setCropFile(null)
    setUploadStatus('idle')
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (multiple) {
      addToQueue(Array.from(e.target.files ?? []))
    } else {
      const f = e.target.files?.[0]
      if (f) pickRawFile(f)
    }
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (multiple) addToQueue(files)
    else if (files[0]) pickRawFile(files[0])
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

  // ── Multi upload ────────────────────────────────────────────────────────────

  function addToQueue(files: File[]) {
    const rejected = files.filter((f) => validateFile(f) !== null)
    if (rejected.length > 0) {
      const names = rejected.map((f) => f.name).join(', ')
      toastError(
        `${rejected.length === 1 ? 'El archivo supera' : `${rejected.length} archivos superan`} los ${formatBytes(MAX_BYTES)}: ${names}`,
        'Archivo demasiado grande',
      )
    }
    const valid = files.filter((f) => !validateFile(f))
    setQueue((prev) => [
      ...prev,
      ...valid.map((f) => ({
        id: uid(),
        file: f,
        name: stripExt(f.name),
        status: 'pending' as QueueStatus,
        progress: 0,
        url: '',
        error: '',
        editingName: false,
      })),
    ])
  }

  function updateQueueItem(id: string, patch: Partial<QueueItem>) {
    setQueue((prev) => prev.map((q) => q.id === id ? { ...q, ...patch } : q))
  }

  function handleQueueCropConfirm(croppedFile: File) {
    if (cropQueueId) {
      updateQueueItem(cropQueueId, { file: croppedFile })
      setCropQueueId(null)
    }
  }

  async function uploadQueueItem(item: QueueItem) {
    updateQueueItem(item.id, { status: 'uploading', progress: 0 })
    try {
      const finalName = `${item.name || 'imagen'}.${getExt(item.file.name)}`
      const { data } = await apiClient.post<ApiResponse<PresignedUrlResponse>>(
        '/admin/upload/presigned-url',
        { fileName: finalName, fileType: item.file.type, folder },
      )
      await xhrUpload(data.uploadUrl, item.file, (p) => {
        updateQueueItem(item.id, { progress: p })
      })
      updateQueueItem(item.id, { status: 'done', progress: 100, url: data.fileUrl })
    } catch (err) {
      updateQueueItem(item.id, { status: 'error', error: err instanceof Error ? err.message : 'Error' })
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
    if (onSelectMultiple) onSelectMultiple(urls)
    else urls.forEach((url) => onSelect(url))
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

  // ── Derived ─────────────────────────────────────────────────────────────────

  const filtered     = search.trim()
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

      <div className="relative z-10 flex h-[85vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {(uploadStatus === 'crop' || cropQueueId)
              ? 'Ajustar imagen'
              : multiple ? 'Subir imágenes' : 'Seleccionar imagen'}
          </h2>
          <button onClick={onClose} className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" aria-label="Cerrar">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Tabs - hidden while crop editor is open */}
        {uploadStatus !== 'crop' && !cropQueueId && (
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
        )}

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto">

          {/* ── Crop editor (single mode) ─────────────────────────────────── */}
          {uploadStatus === 'crop' && cropFile && (
            <CropEditor
              file={cropFile}
              onConfirm={handleCropConfirm}
              onCancel={handleCropCancel}
            />
          )}

          {/* ── Crop editor (queue item) ──────────────────────────────────── */}
          {cropQueueId && (() => {
            const item = queue.find((q) => q.id === cropQueueId)
            return item ? (
              <CropEditor
                file={item.file}
                onConfirm={handleQueueCropConfirm}
                onCancel={() => setCropQueueId(null)}
              />
            ) : null
          })()}

          {/* ── Library tab ──────────────────────────────────────────────── */}
          {uploadStatus !== 'crop' && tab === 'library' && (
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

          {/* ── Upload tab - single ──────────────────────────────────────── */}
          {uploadStatus !== 'crop' && tab === 'upload' && !multiple && (
            <div className="flex h-full flex-col items-center justify-center gap-6 px-8 py-8">

              {/* Drop zone - only when idle/error and no file selected */}
              {(uploadStatus === 'idle' || uploadStatus === 'error') && !file && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={['flex w-full max-w-lg cursor-pointer flex-col items-center gap-4 rounded-xl border-2 border-dashed px-8 py-12 transition-colors', isDragging ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-400'].join(' ')}
                >
                  <svg className="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Arrastra una imagen aquí o haz clic para seleccionar</p>
                    <p className="mt-1 text-xs text-gray-400">JPG, PNG, GIF, WebP, SVG, AVIF · Máx. 10 MB</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFileChange} />
                </div>
              )}

              {/* Ready to upload - show preview + file info */}
              {uploadStatus === 'idle' && file && (
                <div className="flex flex-col items-center gap-4">
                  <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setCropFile(file); setFile(null); setUploadStatus('crop') }}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                    >
                      ✂ Volver a recortar
                    </button>
                    <button onClick={handleUploadSingle} className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700">
                      Subir imagen
                    </button>
                  </div>
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
                  <button onClick={handleConfirmUpload} className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700">Usar esta imagen</button>
                </div>
              )}

              {uploadStatus === 'error' && (
                <div className="flex flex-col items-center gap-3">
                  {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}
                  <button onClick={handleUploadSingle} className="rounded-lg bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700">Reintentar</button>
                </div>
              )}

              {/* Hidden file input */}
              {(uploadStatus === 'idle' || uploadStatus === 'error') && (
                <input ref={fileInputRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleFileChange} />
              )}
            </div>
          )}

          {/* ── Upload tab - multiple ────────────────────────────────────── */}
          {uploadStatus !== 'crop' && !cropQueueId && tab === 'upload' && multiple && (
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

                        {/* Name (editable inline) + progress */}
                        <div className="min-w-0 flex-1">
                          {item.editingName ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                value={item.name}
                                onChange={(e) => updateQueueItem(item.id, { name: e.target.value })}
                                onBlur={() => updateQueueItem(item.id, { editingName: false })}
                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === 'Escape') updateQueueItem(item.id, { editingName: false }) }}
                                className="flex-1 rounded border border-gray-300 px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-gray-900"
                              />
                              <span className="text-[10px] text-gray-400">.{getExt(item.file.name)}</span>
                            </div>
                          ) : (
                            <button
                              className="group flex items-center gap-1 text-left"
                              onClick={() => { if (item.status === 'pending') updateQueueItem(item.id, { editingName: true }) }}
                              title={item.status === 'pending' ? 'Clic para renombrar' : undefined}
                            >
                              <p className="truncate text-xs font-medium text-gray-700">
                                {item.name || stripExt(item.file.name)}.{getExt(item.file.name)}
                              </p>
                              {item.status === 'pending' && (
                                <svg className="h-3 w-3 shrink-0 text-gray-300 group-hover:text-gray-500 transition-colors" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M11 2l3 3L5 14l-4 1 1-4L11 2z" />
                                </svg>
                              )}
                            </button>
                          )}
                          <p className="text-[10px] text-gray-400">{formatBytes(item.file.size)}</p>
                          {item.status === 'uploading' && (
                            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-gray-200">
                              <div className="h-full rounded-full bg-gray-900 transition-all duration-200" style={{ width: `${item.progress}%` }} />
                            </div>
                          )}
                          {item.status === 'error' && <p className="mt-0.5 text-[10px] text-red-500">{item.error}</p>}
                        </div>

                        {/* Status */}
                        <div className="shrink-0">
                          {item.status === 'pending'   && <span className="text-[10px] text-gray-400">Pendiente</span>}
                          {item.status === 'uploading' && <span className="text-[10px] text-gray-500">{item.progress}%</span>}
                          {item.status === 'done'      && <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                          {item.status === 'error'     && <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>}
                        </div>

                        {/* Crop + Remove (pending only) */}
                        {item.status === 'pending' && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => setCropQueueId(item.id)}
                              title="Recortar imagen"
                              className="text-gray-300 hover:text-gray-600 transition-colors"
                            >
                              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 2v14a2 2 0 002 2h14" />
                                <path d="M18 22V8a2 2 0 00-2-2H2" />
                              </svg>
                            </button>
                            <button onClick={() => setQueue((prev) => prev.filter((q) => q.id !== item.id))} className="text-gray-300 hover:text-gray-500">
                              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                            </button>
                          </div>
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
                      <button onClick={handleUploadAll} disabled={uploading} className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50">
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
        {tab === 'library' && uploadStatus !== 'crop' && (
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
