'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Copy, Download, Edit3, Check, AlertCircle } from 'lucide-react'

interface GeneratorFormProps {
  defaultTool?: string
}

const tools = [
  { id: 'lessonPlan', name: 'AI Lesson Plan Generator', category: 'Plan' },
  { id: 'worksheet', name: 'AI Worksheet Generator', category: 'Create' },
  { id: 'quiz', name: 'Practice Quiz Generator', category: 'Create' },
  { id: 'rubric', name: 'AI Rubric Generator', category: 'Assess' },
  { id: 'flashCards', name: 'Flashcards Generator', category: 'Create' },
  { id: 'discussionQuestions', name: 'Discussion Questions', category: 'Teach' },
  { id: 'exitTicket', name: 'Exit Ticket Generator', category: 'Teach' },
  { id: 'iepGoal', name: 'IEP Goal Generator', category: 'Support' },
  { id: 'bip', name: 'BIP Generator', category: 'Support' },
  { id: 'reportCard', name: 'Report Card Comments', category: 'Assess' },
  { id: 'subPlans', name: 'Sub Planner', category: 'Plan' },
  { id: 'differentiationPlan', name: 'Differentiation Plan', category: 'Support' },
  { id: 'socialStory', name: 'Social Story Generator', category: 'Support' },
  { id: 'unitPlan', name: 'Unit Planner', category: 'Plan' },
  { id: 'jeopardy', name: 'Jeopardy Game Generator', category: 'Teach' },
]

export default function GeneratorForm({ defaultTool }: GeneratorFormProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedTool, setSelectedTool] = useState(defaultTool || 'lessonPlan')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [showToolSelect, setShowToolSelect] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description')
      return
    }

    setIsGenerating(true)
    setError('')
    setResult('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedTool, params: { prompt } }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.content)
      } else {
        setError(data.error || 'Failed to generate content')
      }
    } catch (err) {
      setError('Failed to generate content. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `teachquill-${selectedTool}-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>TeachQuill - Generated Content</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.6; }
              pre { white-space: pre-wrap; font-family: inherit; }
            </style>
          </head>
          <body>
            <pre>${result}</pre>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Input Section */}
      <div className="p-6 border-b border-gray-100">
        {/* Tool Selector */}
        <div className="mb-4">
          <button
            onClick={() => setShowToolSelect(!showToolSelect)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-primary-500" />
            {tools.find(t => t.id === selectedTool)?.name || 'Select a tool'}
            <svg className={`w-4 h-4 ml-2 transition-transform ${showToolSelect ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showToolSelect && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {['Plan', 'Create', 'Teach', 'Assess', 'Support'].map((category) => (
                <div key={category}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">{category}</div>
                  {tools.filter(t => t.category === category).map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setSelectedTool(tool.id)
                        setShowToolSelect(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 ${
                        selectedTool === tool.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
                      }`}
                    >
                      {tool.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Text Input */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe what you need (e.g., 'A 45-minute lesson on photosynthesis for 8th grade, NGSS aligned')"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleGenerate()
              }
            }}
          />
          <button
            onClick={() => setPrompt('')}
            className="absolute right-3 top-3 p-1 text-gray-400 hover:text-gray-600"
            title="Clear"
          >
            ×
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-gray-500">Press Ctrl+Enter to generate</p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Generated Content</h3>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleExportPDF}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {result}
            </pre>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-4" />
              <p className="text-gray-600">Generating your content...</p>
              <p className="text-sm text-gray-500 mt-1">This usually takes 10-30 seconds</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
