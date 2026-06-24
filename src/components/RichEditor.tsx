'use client'
// Tiptap 기반 리치 텍스트 에디터 컴포넌트

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (html: string) => void
}

export default function RichEditor({ value, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Youtube.configure({ width: 480, height: 270 }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value])

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
    const { url, error } = await res.json()
    if (error) { alert('이미지 업로드 실패: ' + error); return }
    editor?.chain().focus().setImage({ src: url }).run()
  }

  const handleYoutube = () => {
    const url = prompt('YouTube URL을 입력하세요.')
    if (url) editor?.chain().focus().setYoutubeVideo({ src: url }).run()
  }

  if (!editor) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* 툴바 */}
      <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm rounded font-bold ${editor.isActive('bold') ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        >B</button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm rounded italic ${editor.isActive('italic') ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        >I</button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-3 py-1 text-sm rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        >H3</button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 text-sm rounded ${editor.isActive('bulletList') ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        >• 목록</button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 text-sm rounded ${editor.isActive('orderedList') ? 'bg-emerald-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'}`}
        >1. 목록</button>
        <div className="w-px bg-gray-200 mx-1" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="px-3 py-1 text-sm rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
        >🖼 이미지</button>
        <button
          type="button"
          onClick={handleYoutube}
          className="px-3 py-1 text-sm rounded bg-white border border-gray-200 text-gray-700 hover:bg-gray-100"
        >▶ YouTube</button>
      </div>

      {/* 에디터 본문 */}
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-4 min-h-48 focus:outline-none"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageUpload(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
