import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import FloatingToolbar from './FloatingToolbar'
import { useAI } from '../context/AIContext'

const Editor = forwardRef(({ onPreview }, ref) => {
  const [selectedText, setSelectedText] = useState('')
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const [showToolbar, setShowToolbar] = useState(false)
  const { callAI } = useAI()

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing your document...',
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: `
      <h1>Welcome to Live Collaborative Editor</h1>
      <p>This is a powerful editor with AI integration. Try selecting some text to see the floating toolbar!</p>
      <p>You can:</p>
      <ul>
        <li>Select text and use AI to edit it</li>
        <li>Chat with AI in the sidebar</li>
        <li>Preview changes before applying them</li>
        <li>Use web search with AI agents</li>
      </ul>
      <p>Start editing and explore the features!</p>
    `,
    onSelectionUpdate: ({ editor }) => {
      const { from, to, empty } = editor.state.selection
      
      if (empty) {
        setShowToolbar(false)
        setSelectedText('')
        return
      }

      const text = editor.state.doc.textBetween(from, to, ' ')
      setSelectedText(text)

      // Calculate toolbar position
      const { view } = editor
      const start = view.coordsAtPos(from)
      const end = view.coordsAtPos(to)
      
      const editorRect = view.dom.getBoundingClientRect()
      const x = (start.left + end.left) / 2 - editorRect.left
      const y = start.top - editorRect.top - 60

      setToolbarPosition({ x, y })
      setShowToolbar(true)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  })

  const handleAIEdit = useCallback(async (action) => {
    if (!selectedText || !editor) return

    const prompts = {
      shorten: 'Please shorten this text while keeping the main meaning:',
      lengthen: 'Please expand this text with more details and context:',
      grammar: 'Please fix any grammar and spelling errors in this text:',
      table: 'Convert this text into a well-formatted table:',
      improve: 'Please improve the clarity and readability of this text:'
    }

    const prompt = prompts[action] || prompts.improve
    
    try {
      const result = await callAI(prompt, selectedText)
      
      if (result.success) {
        onPreview({
          original: selectedText,
          suggestion: result.response,
          action,
          onConfirm: () => {
            const { from, to } = editor.state.selection
            editor.chain().focus().deleteRange({ from, to }).insertContent(result.response).run()
            setShowToolbar(false)
          },
          onCancel: () => {
            setShowToolbar(false)
          }
        })
      }
    } catch (error) {
      console.error('AI edit failed:', error)
    }
  }, [selectedText, editor, callAI, onPreview])

  const insertAIContent = useCallback((content) => {
    if (editor) {
      editor.chain().focus().insertContent(content).run()
    }
  }, [editor])

  // Expose insertAIContent to parent components
  useImperativeHandle(ref, () => ({
    insertContent: insertAIContent
  }), [insertAIContent])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col card m-4">
      {/* Editor Toolbar */}
      <div className="glass border-b border-white/20 p-4 flex flex-wrap gap-3">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift ${
            editor.isActive('bold') 
              ? 'btn-primary' 
              : 'glass hover:glass-dark text-gray-700 hover:text-white'
          }`}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift ${
            editor.isActive('italic') 
              ? 'btn-primary' 
              : 'glass hover:glass-dark text-gray-700 hover:text-white'
          }`}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift ${
            editor.isActive('heading', { level: 1 }) 
              ? 'btn-primary' 
              : 'glass hover:glass-dark text-gray-700 hover:text-white'
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift ${
            editor.isActive('heading', { level: 2 }) 
              ? 'btn-primary' 
              : 'glass hover:glass-dark text-gray-700 hover:text-white'
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift ${
            editor.isActive('bulletList') 
              ? 'btn-primary' 
              : 'glass hover:glass-dark text-gray-700 hover:text-white'
          }`}
        >
          List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift ${
            editor.isActive('blockquote') 
              ? 'btn-primary' 
              : 'glass hover:glass-dark text-gray-700 hover:text-white'
          }`}
        >
          Quote
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative overflow-auto p-4">
        <EditorContent editor={editor} className="h-full" />
        
        {/* Floating Toolbar */}
        {showToolbar && selectedText && (
          <FloatingToolbar
            position={toolbarPosition}
            onAction={handleAIEdit}
            selectedText={selectedText}
          />
        )}
      </div>
    </div>
  )
})

export default Editor
