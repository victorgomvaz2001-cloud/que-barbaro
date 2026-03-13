'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number // ms, default 5000; 0 = sticky
}

type ToastInput = Omit<Toast, 'id'>

interface ToastContextValue {
  toast: (input: ToastInput) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
  dismiss: (id: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>')
  return ctx
}

// ─── Config per type ──────────────────────────────────────────────────────────

const CONFIG: Record<
  ToastType,
  { icon: React.ReactNode; bg: string; border: string; titleCls: string; msgCls: string; closeCls: string }
> = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border border-emerald-200',
    titleCls: 'text-emerald-800',
    msgCls: 'text-emerald-700',
    closeCls: 'text-emerald-400 hover:text-emerald-600',
    icon: (
      <svg className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-red-50',
    border: 'border border-red-200',
    titleCls: 'text-red-800',
    msgCls: 'text-red-700',
    closeCls: 'text-red-400 hover:text-red-600',
    icon: (
      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border border-amber-200',
    titleCls: 'text-amber-800',
    msgCls: 'text-amber-700',
    closeCls: 'text-amber-400 hover:text-amber-600',
    icon: (
      <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border border-blue-200',
    titleCls: 'text-blue-800',
    msgCls: 'text-blue-700',
    closeCls: 'text-blue-400 hover:text-blue-600',
    icon: (
      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  },
}

// ─── Single toast item ────────────────────────────────────────────────────────

function ToastItem({ t, onDismiss }: { t: Toast; onDismiss: (id: string) => void }) {
  const cfg = CONFIG[t.type]
  const duration = t.duration ?? 5000
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Fade in
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Auto-dismiss
  useEffect(() => {
    if (duration === 0) return
    timerRef.current = setTimeout(() => setVisible(false), duration)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [duration])

  // Remove after fade-out transition
  function handleTransitionEnd(e: React.TransitionEvent) {
    if (e.propertyName === 'opacity' && !visible) onDismiss(t.id)
  }

  function handleDismiss() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={[
        'w-80 rounded-lg shadow-sm transition-all duration-300',
        cfg.bg,
        cfg.border,
        visible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
      ].join(' ')}
    >
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="mt-0.5 shrink-0">{cfg.icon}</div>
        <div className="flex-1 overflow-hidden">
          {t.title && (
            <p className={`text-sm font-semibold ${cfg.titleCls}`}>{t.title}</p>
          )}
          <p className={`break-words text-sm ${cfg.msgCls}`}>{t.message}</p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className={`ml-1 shrink-0 transition-colors ${cfg.closeCls}`}
          aria-label="Cerrar"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((input: ToastInput) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [{ ...input, id }, ...prev])
  }, [])

  const success = useCallback((message: string, title?: string) => toast({ type: 'success', message, title }), [toast])
  const error   = useCallback((message: string, title?: string) => toast({ type: 'error',   message, title }), [toast])
  const warning = useCallback((message: string, title?: string) => toast({ type: 'warning', message, title }), [toast])
  const info    = useCallback((message: string, title?: string) => toast({ type: 'info',    message, title }), [toast])

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      {/* ── Portal ── */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-6 top-6 z-[9999] flex flex-col gap-3"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem t={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
