import React, { useState } from 'react'
import Editor from './components/Editor'
import ChatSidebar from './components/ChatSidebar'
import PreviewModal from './components/PreviewModal'
import { AIProvider } from './context/AIContext'

function App() {
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [previewData, setPreviewData] = useState(null)
  const [editorRef, setEditorRef] = useState(null)

  return (
    <AIProvider>
      <div className="h-screen flex">
        {/* Main Editor Area */}
        <div className={`flex-1 flex flex-col transition-all duration-500 ease-in-out ${isChatOpen ? 'mr-80' : 'mr-0'}`}>
          <header className="glass border-b border-white/20 px-6 py-4 flex items-center justify-between backdrop-blur-xl">
            <h1 className="text-2xl font-bold gradient-text">
              {import.meta.env.VITE_APP_NAME || 'Live Collaborative Editor'}
            </h1>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="btn-primary hover-lift"
            >
              {isChatOpen ? 'Hide Chat' : 'Show Chat'}
            </button>
          </header>
          
          <div className="flex-1 overflow-hidden">
            <Editor onPreview={setPreviewData} ref={setEditorRef} />
          </div>
        </div>

        {/* Chat Sidebar */}
        <ChatSidebar 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)}
          onInsertContent={(content) => {
            if (editorRef && editorRef.insertContent) {
              editorRef.insertContent(content)
            }
          }}
        />

        {/* Preview Modal */}
        {previewData && (
          <PreviewModal 
            data={previewData} 
            onClose={() => setPreviewData(null)} 
          />
        )}
      </div>
    </AIProvider>
  )
}

export default App
