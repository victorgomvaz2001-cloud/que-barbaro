'use client'

import { useEffect, type ReactNode } from 'react'

export interface ModalProps {
  open: boolean
  title: string
  description?: string
  /** Called when clicking the backdrop or pressing Escape */
  onClose?: () => void
  actions: ReactNode
  children?: ReactNode
}

export function Modal({ open, title, description, onClose, actions, children }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="p-6">
          <h2 id="modal-title" className="text-base font-semibold text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-sm leading-relaxed text-gray-500">{description}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
        <div className="flex justify-end gap-2 border-t border-gray-100 px-6 py-4">
          {actions}
        </div>
      </div>
    </div>
  )
}
