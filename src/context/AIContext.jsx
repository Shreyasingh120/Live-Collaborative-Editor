import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AIContext = createContext()

export const useAI = () => {
  const context = useContext(AIContext)
  if (!context) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

export const AIProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState(
    localStorage.getItem('gemini_api_key') || 
    import.meta.env.VITE_GEMINI_API_KEY || 
    import.meta.env.VITE_OPENAI_API_KEY || 
    ''
  )

  // Mock AI response for demo purposes - replace with actual API call
  const callAI = async (prompt, context = '') => {
    setIsLoading(true)
    
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY
      const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'
      
      // Use demo mode if no API key or demo mode is enabled
      if (demoMode || !apiKey) {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
        
        const mockResponses = {
          'shorten': 'Here is a shortened version of your text.',
          'lengthen': 'Here is an expanded version of your text with more details and context.',
          'grammar': 'Here is your text with grammar corrections applied.',
          'table': '| Column 1 | Column 2 |\n|----------|----------|\n| Data 1   | Data 2   |',
          'default': 'I can help you edit this text. What would you like me to do?'
        }
        
        const responseType = prompt.toLowerCase().includes('shorten') ? 'shorten' :
                            prompt.toLowerCase().includes('lengthen') ? 'lengthen' :
                            prompt.toLowerCase().includes('grammar') ? 'grammar' :
                            prompt.toLowerCase().includes('table') ? 'table' : 'default'
        
        return {
          success: true,
          response: mockResponses[responseType]
        }
      }

      // Real Gemini API call
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: context ? `${prompt}\n\nText to work with: "${context}"` : prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 500,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = response.status === 429 
          ? 'Rate limit exceeded. Please wait a moment and try again.'
          : response.status === 401
          ? 'Invalid API key. Please check your Gemini API key.'
          : response.status === 403
          ? 'Access denied. Please check your Gemini API key permissions.'
          : `Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      return {
        success: true,
        response: data.candidates[0].content.parts[0].text,
        originalText: context
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Real OpenAI API call (commented out for demo)
  const callOpenAI = async (prompt, context = '') => {
    if (!apiKey) {
      throw new Error('OpenAI API key not provided')
    }

    try {
      const apiUrl = import.meta.env.VITE_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions'
      
      const response = await axios.post(
        apiUrl,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful writing assistant. Help users edit and improve their text.'
            },
            {
              role: 'user',
              content: `${prompt}\n\nText to edit: ${context}`
            }
          ],
          max_tokens: 500,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        success: true,
        response: response.data.choices[0].message.content,
        originalText: context
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message
      }
    }
  }

  const searchWeb = async (query) => {
    setIsLoading(true)
    
    try {
      const searchApiKey = import.meta.env.VITE_SEARCH_API_KEY
      const searchApiUrl = import.meta.env.VITE_SEARCH_API_URL
      
      // If no API key is provided, use mock data
      if (!searchApiKey || import.meta.env.VITE_DEMO_MODE === 'true') {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        return {
          success: true,
          results: [
            {
              title: `Search results for: ${query}`,
              snippet: 'This is a mock search result. In production, this would be replaced with actual web search results from APIs like Tavily, Serper, or DuckDuckGo.',
              url: 'https://example.com'
            }
          ]
        }
      }

      // Real API call would go here
      // Example for Tavily API:
      /*
      const response = await axios.post(searchApiUrl, {
        api_key: searchApiKey,
        query: query,
        search_depth: "basic",
        include_answer: true,
        include_images: false,
        include_raw_content: false,
        max_results: 5
      })
      
      return {
        success: true,
        results: response.data.results
      }
      */
      
      return {
        success: true,
        results: [
          {
            title: `Search results for: ${query}`,
            snippet: 'Mock search result - configure VITE_SEARCH_API_KEY for real search.',
            url: 'https://example.com'
          }
        ]
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    } finally {
      setIsLoading(false)
    }
  }

  const value = {
    callAI,
    searchWeb,
    isLoading,
    apiKey,
    setApiKey: (key) => {
      setApiKey(key)
      localStorage.setItem('gemini_api_key', key)
    }
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}
