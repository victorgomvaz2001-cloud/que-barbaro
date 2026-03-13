'use client'

import { useEditor, EditorContent, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle } from '@tiptap/extension-text-style'
import { useCallback, useState } from 'react'
import type { Editor } from '@tiptap/react'
import { MediaPickerModal } from './MediaPickerModal'

// ─── FontSize extension ───────────────────────────────────────────────────────

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => (el as HTMLElement).style.fontSize || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }: { chain: Editor['chain'] }) =>
          chain().focus().setMark('textStyle', { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }: { chain: Editor['chain'] }) =>
          chain().focus().setMark('textStyle', { fontSize: null }).run(),
    } as never
  },
})


const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px']

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

// ─── Toolbar atoms ────────────────────────────────────────────────────────────

function Divider() {
  return <div className="mx-0.5 h-5 w-px bg-gray-300" aria-hidden="true" />
}

function ToolBtn({
  active,
  title,
  onClick,
  children,
}: {
  active?: boolean
  title: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      className={[
        'rounded px-2 py-1 text-sm font-medium leading-none transition-colors focus:outline-none',
        active
          ? 'bg-gray-800 text-white'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900',
      ].join(' ')}
    >
      {children}
    </button>
  )
}


// ─── Component ────────────────────────────────────────────────────────────────

export function RichTextEditor({
  content,
  onChange,
  placeholder = 'Start writing…',
  className,
}: RichTextEditorProps) {
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false)

  const handleUpdate = useCallback(
    ({ editor }: { editor: Editor | null }) => {
      if (!editor) return
      onChange(editor.getHTML())
    },
    [onChange],
  )

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        // Excluded because we register them separately with custom config
        underline: false,
        link: false,
      }),
      Underline,
      TextStyle,
      FontSize,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false, HTMLAttributes: { class: 'max-w-full rounded-lg' } }),
    ],
    content,
    onUpdate: handleUpdate,
    editorProps: {
      attributes: { class: 'outline-none px-10 py-8 max-w-3xl mx-auto' },
    },
  })

  function handleLinkToggle() {
    if (!editor) return
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    } else {
      const url = window.prompt('URL del enlace')
      if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }
  }

  function handleFontSizeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!editor) return
    const size = e.target.value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chain = editor.chain().focus() as any
    if (!size) chain.unsetFontSize().run()
    else chain.setFontSize(size).run()
  }

  if (!editor) return null

  const currentFontSize = editor.getAttributes('textStyle').fontSize ?? ''

  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')}>
      <MediaPickerModal
        open={mediaPickerOpen}
        folder="blog"
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          editor.chain().focus().setImage({ src: url }).run()
          setMediaPickerOpen(false)
        }}
      />

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 px-3 py-2">

        {/* Font size */}
        <select
          title="Tamaño de fuente"
          value={currentFontSize}
          onMouseDown={(e) => e.stopPropagation()}
          onChange={handleFontSizeChange}
          className="h-7 w-28 rounded border border-gray-300 bg-white px-2 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Tamaño</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>


        <Divider />

        {/* Text marks */}
        <ToolBtn
          title="Negrita (Ctrl+B)"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </ToolBtn>
        <ToolBtn
          title="Cursiva (Ctrl+I)"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </ToolBtn>
        <ToolBtn
          title="Subrayado (Ctrl+U)"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </ToolBtn>
        <ToolBtn
          title="Tachado"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <span className="line-through">S</span>
        </ToolBtn>

        <Divider />

        {/* Headings */}
        {([1, 2, 3] as const).map((level) => (
          <ToolBtn
            key={level}
            title={`Encabezado ${level}`}
            active={editor.isActive('heading', { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          >
            H{level}
          </ToolBtn>
        ))}

        <Divider />

        {/* Lists */}
        <ToolBtn
          title="Lista con viñetas"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <circle cx="3" cy="5"  r="1.5" />
            <circle cx="3" cy="10" r="1.5" />
            <circle cx="3" cy="15" r="1.5" />
            <rect x="7" y="4"  width="11" height="2" rx="1" />
            <rect x="7" y="9"  width="11" height="2" rx="1" />
            <rect x="7" y="14" width="11" height="2" rx="1" />
          </svg>
        </ToolBtn>
        <ToolBtn
          title="Lista numerada"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <text x="1" y="7"  fontSize="6" fontFamily="monospace">1.</text>
            <text x="1" y="12" fontSize="6" fontFamily="monospace">2.</text>
            <text x="1" y="17" fontSize="6" fontFamily="monospace">3.</text>
            <rect x="8" y="4"  width="10" height="2" rx="1" />
            <rect x="8" y="9"  width="10" height="2" rx="1" />
            <rect x="8" y="14" width="10" height="2" rx="1" />
          </svg>
        </ToolBtn>

        <Divider />

        {/* Block elements */}
        <ToolBtn
          title="Cita"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3 5a1 1 0 011-1h4a1 1 0 011 1v4a3 3 0 01-3 3H4a1 1 0 010-2h2a1 1 0 001-1H4a1 1 0 01-1-1V5zm9 0a1 1 0 011-1h4a1 1 0 011 1v4a3 3 0 01-3 3h-2a1 1 0 010-2h2a1 1 0 001-1h-2a1 1 0 01-1-1V5z" />
          </svg>
        </ToolBtn>
        <ToolBtn
          title="Bloque de código"
          active={editor.isActive('codeBlock')}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </ToolBtn>
        <ToolBtn
          title="Código en línea"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {'</>'}
        </ToolBtn>
        <ToolBtn
          title="Enlace"
          active={editor.isActive('link')}
          onClick={handleLinkToggle}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
          </svg>
        </ToolBtn>
        <ToolBtn
          title="Línea horizontal"
          active={false}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <rect x="2" y="9" width="16" height="2" rx="1" />
          </svg>
        </ToolBtn>

        <Divider />

        {/* Image */}
        <ToolBtn
          title="Insertar imagen"
          active={false}
          onClick={() => setMediaPickerOpen(true)}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 5 2-2 3 5z" clipRule="evenodd" />
          </svg>
        </ToolBtn>

        <Divider />

        {/* History */}
        <ToolBtn
          title="Deshacer (Ctrl+Z)"
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
        </ToolBtn>
        <ToolBtn
          title="Rehacer (Ctrl+Y)"
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </ToolBtn>
      </div>

      {/* ── Editor area ──────────────────────────────────────────────────── */}
      <div
        className="min-h-0 flex-1 cursor-text overflow-y-auto bg-white"
        onClick={() => editor.commands.focus()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
