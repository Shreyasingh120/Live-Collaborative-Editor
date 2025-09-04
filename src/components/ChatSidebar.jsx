import React, { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle, X, Settings, Search, Bot } from 'lucide-react'
import { useAI } from '../context/AIContext'
import Agent from './Agent'

const ChatSidebar = ({ isOpen, onClose, onInsertContent }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI assistant. I can help you edit text, search the web, and improve your writing. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showAgent, setShowAgent] = useState(false)
  const messagesEndRef = useRef(null)
  const { callAI, searchWeb, isLoading, apiKey, setApiKey } = useAI()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Check if it's a web search request
    const isSearchQuery = inputValue.toLowerCase().includes('search') || 
                         inputValue.toLowerCase().includes('find') ||
                         inputValue.toLowerCase().includes('look up')

    try {
      let response
      if (isSearchQuery) {
        const searchResult = await searchWeb(inputValue)
        if (searchResult.success) {
          response = {
            success: true,
            response: `I found some information for you:\n\n${searchResult.results[0].title}\n${searchResult.results[0].snippet}\n\nWould you like me to insert this information into your document?`
          }
        } else {
          response = { success: false, error: searchResult.error }
        }
      } else {
        response = await callAI(inputValue)
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.success ? response.response : `Sorry, I encountered an error: ${response.error}`,
        timestamp: new Date(),
        isError: !response.success
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Sorry, I encountered an error: ${error.message}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-80 glass border-l border-white/20 flex flex-col shadow-2xl z-50 backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
            <MessageCircle className="text-white" size={20} />
          </div>
          <h2 className="font-bold text-lg gradient-text">AI Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAgent(!showAgent)}
            className={`p-2 rounded-lg transition-all duration-300 hover-lift ${
              showAgent 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                : 'glass hover:glass-dark text-gray-600 hover:text-white'
            }`}
            title="Toggle AI Agent"
          >
            <Bot size={16} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg glass hover:glass-dark text-gray-600 hover:text-white transition-all duration-300 hover-lift"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg glass hover:glass-dark text-gray-600 hover:text-white transition-all duration-300 hover-lift"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 glass border-b border-white/20">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            OpenAI API Key (Optional)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={import.meta.env.VITE_OPENAI_API_KEY ? "Using environment key" : "sk-..."}
            className="input-enhanced w-full text-sm"
          />
          <p className="text-xs text-gray-600 mt-2">
            {import.meta.env.VITE_DEMO_MODE === 'true' 
              ? '🎭 Demo mode enabled - using mock responses' 
              : 'Leave empty to use demo mode with mock responses'}
          </p>
          {import.meta.env.VITE_DEBUG_MODE === 'true' && (
            <p className="text-xs gradient-text-secondary mt-1">
              🔧 Debug mode: Environment variables loaded
            </p>
          )}
        </div>
      )}

      {/* Agent Panel */}
      {showAgent && (
        <div className="border-b border-gray-200">
          <Agent onInsertContent={onInsertContent} />
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl shadow-lg ${
                message.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : message.isError
                  ? 'bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200'
                  : 'glass text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="glass px-4 py-3 rounded-xl shadow-lg">
              <p className="text-sm text-gray-700">AI is thinking<span className="loading-dots"></span></p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/20">
        <div className="flex gap-3">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask AI to help with editing, search the web, or chat..."
            className="input-enhanced flex-1 resize-none text-sm"
            rows="2"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="btn-primary hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Send size={16} />
          </button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setInputValue('Help me improve the grammar in my document')}
            className="text-xs px-3 py-2 glass hover:glass-dark text-gray-600 hover:text-white rounded-lg transition-all duration-300 hover-lift"
          >
            Grammar Help
          </button>
          <button
            onClick={() => setInputValue('Search for latest news about React.js')}
            className="text-xs px-3 py-2 glass hover:glass-dark text-gray-600 hover:text-white rounded-lg transition-all duration-300 hover-lift flex items-center gap-1"
          >
            <Search size={12} />
            Web Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatSidebar
