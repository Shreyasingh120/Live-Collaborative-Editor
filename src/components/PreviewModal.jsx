import React from 'react'
import { X, Check, ArrowLeft } from 'lucide-react'

const PreviewModal = ({ data, onClose }) => {
  const { original, suggestion, action, onConfirm, onCancel } = data

  const actionLabels = {
    shorten: 'Shortened Text',
    lengthen: 'Lengthened Text', 
    grammar: 'Grammar Corrected',
    table: 'Table Format',
    improve: 'Improved Text'
  }

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const handleCancel = () => {
    onCancel()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-4xl w-full max-h-[90vh] overflow-hidden animate-fadeInUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20 glass">
          <h2 className="text-xl font-bold gradient-text">
            Preview: {actionLabels[action] || 'AI Suggestion'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 glass hover:glass-dark rounded-lg transition-all duration-300 hover-lift text-gray-600 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original Text */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600">
                  <ArrowLeft size={16} className="text-white" />
                </div>
                Original Text
              </h3>
              <div className="glass p-6 rounded-xl border border-white/20">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {original}
                </p>
              </div>
              <div className="mt-3 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                📊 {original.split(' ').length} words, {original.length} characters
              </div>
            </div>

            {/* AI Suggestion */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                  <Check size={16} className="text-white" />
                </div>
                AI Suggestion
              </h3>
              <div className="glass p-6 rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {suggestion}
                </p>
              </div>
              <div className="mt-3 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                📊 {suggestion.split(' ').length} words, {suggestion.length} characters
              </div>
            </div>
          </div>

          {/* Comparison Stats */}
          <div className="mt-6 glass p-6 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-4 gradient-text-secondary">📈 Changes Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="text-gray-500">Word Count:</span>
                <div className="font-medium">
                  {original.split(' ').length} → {suggestion.split(' ').length}
                  <span className={`ml-1 ${
                    suggestion.split(' ').length > original.split(' ').length 
                      ? 'text-green-600' 
                      : suggestion.split(' ').length < original.split(' ').length
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    ({suggestion.split(' ').length > original.split(' ').length ? '+' : ''}
                    {suggestion.split(' ').length - original.split(' ').length})
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Characters:</span>
                <div className="font-medium">
                  {original.length} → {suggestion.length}
                  <span className={`ml-1 ${
                    suggestion.length > original.length 
                      ? 'text-green-600' 
                      : suggestion.length < original.length
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}>
                    ({suggestion.length > original.length ? '+' : ''}
                    {suggestion.length - original.length})
                  </span>
                </div>
              </div>
              <div>
                <span className="text-gray-500">Action:</span>
                <div className="font-medium capitalize">{action}</div>
              </div>
              <div>
                <span className="text-gray-500">Change:</span>
                <div className="font-medium">
                  {original === suggestion ? 'No change' : 'Modified'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 p-6 border-t border-white/20 glass">
          <button
            onClick={handleCancel}
            className="px-6 py-3 glass hover:glass-dark text-gray-600 hover:text-white rounded-lg transition-all duration-300 hover-lift font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="btn-primary hover-lift flex items-center gap-2 px-6 py-3"
          >
            <Check size={16} />
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default PreviewModal
