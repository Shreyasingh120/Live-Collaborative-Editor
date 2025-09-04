import React, { useState } from 'react'
import { Search, Globe, FileText, Loader } from 'lucide-react'
import { useAI } from '../context/AIContext'

const Agent = ({ onInsertContent }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const { searchWeb, callAI, isLoading } = useAI()

  const handleWebSearch = async () => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setResults([])

    try {
      // Perform web search
      const searchResult = await searchWeb(query)
      
      if (searchResult.success) {
        setResults(searchResult.results)
        
        // Generate summary using AI
        const summaryPrompt = `Based on these search results about "${query}", create a concise summary that can be inserted into a document:`
        const summaryResult = await callAI(summaryPrompt, JSON.stringify(searchResult.results))
        
        if (summaryResult.success) {
          setResults(prev => [{
            ...prev[0],
            aiSummary: summaryResult.response
          }])
        }
      }
    } catch (error) {
      console.error('Search failed:', error)
      setResults([{
        title: 'Search Error',
        snippet: `Failed to search: ${error.message}`,
        url: '#',
        isError: true
      }])
    } finally {
      setIsSearching(false)
    }
  }

  const handleInsertSummary = (summary) => {
    if (onInsertContent) {
      onInsertContent(`\n\n## ${query}\n\n${summary}\n\n`)
    }
  }

  const handleCrawlUrl = async (url) => {
    // Mock URL crawling - in production, implement actual crawling
    const crawlResult = await callAI(
      `Summarize the content from this URL for insertion into a document: ${url}`,
      'This would contain the crawled content from the URL'
    )
    
    if (crawlResult.success && onInsertContent) {
      onInsertContent(`\n\n### Content from ${url}\n\n${crawlResult.response}\n\n`)
    }
  }

  return (
    <div className="p-4 glass rounded-xl border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
          <Globe className="text-white" size={20} />
        </div>
        <h3 className="font-bold text-gray-800 gradient-text">AI Agent - Web Search & Tools</h3>
      </div>

      {/* Search Input */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web and insert summary..."
          className="input-enhanced flex-1"
          onKeyPress={(e) => e.key === 'Enter' && handleWebSearch()}
        />
        <button
          onClick={handleWebSearch}
          disabled={!query.trim() || isSearching}
          className="btn-primary hover-lift disabled:opacity-50 disabled:transform-none flex items-center gap-2"
        >
          {isSearching ? <Loader className="animate-spin" size={16} /> : <Search size={16} />}
          Search
        </button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div key={index} className={`card p-4 hover-lift ${result.isError ? 'border-red-200 bg-gradient-to-r from-red-50 to-red-25' : ''}`}>
              <h4 className="font-bold text-gray-800 mb-2">{result.title}</h4>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{result.snippet}</p>
              
              {result.url !== '#' && (
                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() => handleCrawlUrl(result.url)}
                    className="btn-secondary text-xs flex items-center gap-1"
                  >
                    <FileText size={12} />
                    Crawl & Insert
                  </button>
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-2 glass hover:glass-dark text-gray-600 hover:text-white rounded-lg transition-all duration-300 hover-lift"
                  >
                    Visit
                  </a>
                </div>
              )}

              {/* AI Summary */}
              {result.aiSummary && (
                <div className="mt-4 glass p-4 rounded-lg border border-blue-200/50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold gradient-text-secondary">🤖 AI Summary</span>
                    <button
                      onClick={() => handleInsertSummary(result.aiSummary)}
                      className="btn-primary text-xs px-3 py-2"
                    >
                      Insert Summary
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{result.aiSummary}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Tools */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <h4 className="text-sm font-bold text-gray-700 mb-4 gradient-text-secondary">⚡ Quick Tools</h4>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleWebSearch('latest tech news')}
            className="text-xs px-4 py-2 glass hover:glass-dark text-gray-600 hover:text-white rounded-lg transition-all duration-300 hover-lift"
          >
            📰 Tech News
          </button>
          <button
            onClick={() => handleWebSearch('React best practices')}
            className="text-xs px-4 py-2 glass hover:glass-dark text-gray-600 hover:text-white rounded-lg transition-all duration-300 hover-lift"
          >
            ⚛️ React Tips
          </button>
          <button
            onClick={() => handleWebSearch('JavaScript tutorials')}
            className="text-xs px-4 py-2 glass hover:glass-dark text-gray-600 hover:text-white rounded-lg transition-all duration-300 hover-lift"
          >
            📚 JS Tutorials
          </button>
        </div>
      </div>
    </div>
  )
}

export default Agent
