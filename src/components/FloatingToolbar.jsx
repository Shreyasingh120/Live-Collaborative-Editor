import React from 'react'
import { Wand2, Scissors, Plus, Table, CheckCircle, X } from 'lucide-react'

const FloatingToolbar = ({ position, onAction, selectedText }) => {
  const actions = [
    { id: 'shorten', label: 'Shorten', icon: Scissors, gradient: 'from-blue-500 to-blue-600' },
    { id: 'lengthen', label: 'Lengthen', icon: Plus, gradient: 'from-green-500 to-green-600' },
    { id: 'grammar', label: 'Grammar', icon: CheckCircle, gradient: 'from-purple-500 to-purple-600' },
    { id: 'table', label: 'To Table', icon: Table, gradient: 'from-orange-500 to-orange-600' },
    { id: 'improve', label: 'Improve', icon: Wand2, gradient: 'from-pink-500 to-pink-600' }
  ]

  return (
    <div 
      className="floating-toolbar"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateX(-50%)'
      }}
    >
      <div className="flex items-center gap-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={`bg-gradient-to-r ${action.gradient} text-white px-4 py-2 rounded-lg hover-lift transition-all duration-300 flex items-center gap-2 text-sm font-medium shadow-lg hover:shadow-xl`}
              title={`${action.label} selected text`}
            >
              <Icon size={16} />
              {action.label}
            </button>
          )
        })}
      </div>
      
      {/* Selected text preview */}
      <div className="mt-3 text-xs text-gray-600 max-w-xs truncate bg-gray-50 px-3 py-2 rounded-lg">
        <span className="font-medium">Selected:</span> "{selectedText}"
      </div>
    </div>
  )
}

export default FloatingToolbar
