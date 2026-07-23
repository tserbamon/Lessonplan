'use client'

import { useState } from 'react'
import { PenTool, FileText, Presentation, Layout, BookOpen, Check, Sparkles, Loader2, Copy, Download, Layers } from 'lucide-react'

const createTools = [
  { id: 'worksheet', name: 'AI Worksheet Generator', description: 'Create differentiated worksheets for any subject', icon: FileText, color: 'bg-purple-50 text-purple-600' },
  { id: 'quiz', name: 'Practice Quiz Generator', description: 'Generate quizzes with various question types', icon: PenTool, color: 'bg-pink-50 text-pink-600' },
  { id: 'flashCards', name: 'Flashcards Generator', description: 'Create study flashcards for any topic', icon: Layers, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'slides', name: 'Class Slides Maker', description: 'Generate presentation slides quickly', icon: Presentation, color: 'bg-blue-50 text-blue-600' },
  { id: 'graphic', name: 'Graphic Organizer Generator', description: 'Create visual organizers and diagrams', icon: Layout, color: 'bg-green-50 text-green-600' },
  { id: 'guided', name: 'Guided Notes Generator', description: 'Create structured guided notes for students', icon: BookOpen, color: 'bg-orange-50 text-orange-600' },
  { id: 'vocabulary', name: 'Vocabulary Worksheet Generator', description: 'Build vocabulary practice worksheets', icon: FileText, color: 'bg-teal-50 text-teal-600' },
  { id: 'math', name: 'Math Worksheet Generator', description: 'Create math practice problems by grade level', icon: FileText, color: 'bg-cyan-50 text-cyan-600' },
]

const examplePrompts = [
  { text: 'Structure and Function', details: '7th Grade | Science | Practice | With Answer Key' },
  { text: 'Algebra Basics', details: '7th Grade | 15 problems | Medium | both' },
  { text: 'Vocabulary Building', details: '7th Grade | Mixed | 10 words | Student + Answer Key' },
]

export default function CreatePage() {
  const [prompt, setPrompt] = useState('')
  const [selectedTool, setSelectedTool] = useState('worksheet')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) { setError('Please enter a description'); return; }
    setIsGenerating(true); setError(''); setResult('')
    try {
      const response = await fetch('/api/generate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedTool, params: { prompt } }),
      })
      const data = await response.json()
      if (data.success) setResult(data.content)
      else setError(data.error || 'Failed to generate content')
    } catch { setError('Failed to generate content. Please try again.') } finally { setIsGenerating(false) }
  }

  const handleCopy = async () => { await navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000) }
  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `teachquill-create-${Date.now()}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-b from-purple-50 to-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg"><PenTool className="w-6 h-6 text-purple-600" /></div>
            <span className="text-sm font-medium text-purple-600">Stage 2</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Create classroom materials with AI</h1>
          <p className="text-xl text-gray-600 max-w-2xl">Worksheets, quizzes, slides, flashcards, and graphic organizers — differentiated and export-ready.</p>
        </div>
      </section>

      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select a creation tool</label>
                <div className="flex flex-wrap gap-2">
                  {createTools.map((tool) => {
                    const Icon = tool.icon
                    return (
                      <button key={tool.id} onClick={() => setSelectedTool(tool.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTool === tool.id ? 'bg-purple-100 text-purple-700 border border-purple-300' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'}`}>
                        <Icon className="w-4 h-4" />{tool.name}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Describe what you need</label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder='e.g. "Make a 10-question quiz on photosynthesis for 7th grade science"'
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none" rows={3} />
              </div>
              {error && <div className="mt-3 text-red-600 text-sm">{error}</div>}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs text-gray-500">Press Ctrl+Enter to generate</p>
                <button onClick={handleGenerate} disabled={isGenerating}
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate</>}
                </button>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-sm text-gray-500 mb-3">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button key={index} onClick={() => setPrompt(example.text)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-colors text-left">
                    <div className="font-medium">{example.text}</div>
                    <div className="text-xs text-gray-500">{example.details}</div>
                  </button>
                ))}
              </div>
            </div>
            {result && (
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2"><Check className="w-5 h-5 text-green-500" />Generated Content</h3>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button onClick={handleDownload} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />Download
                    </button>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">{result}</pre>
                </div>
              </div>
            )}
            {isGenerating && !result && <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 text-purple-600 animate-spin" /></div>}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">All Creation Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {createTools.map((tool) => {
              const Icon = tool.icon
              return (
                <div key={tool.id} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all cursor-pointer" onClick={() => setSelectedTool(tool.id)}>
                  <div className={`inline-flex p-3 rounded-xl ${tool.color} mb-4`}><Icon className="w-6 h-6" /></div>
                  <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-sm">{tool.description}</p>
                  <div className="mt-4 flex items-center text-purple-600 font-medium text-sm">Open tool →</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
