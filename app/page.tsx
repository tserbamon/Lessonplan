'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, BookOpen, PenTool, Gamepad2, BarChart3, Heart, ArrowRight, Check, Zap, Shield, Users } from 'lucide-react'
import GeneratorForm from '@/components/GeneratorForm'

const categories = [
  {
    name: 'Plan',
    icon: BookOpen,
    href: '/plan',
    description: 'Lesson plans, unit plans, curriculum maps, and sub plans',
    tools: ['AI Lesson Plan Generator', 'Weekly Lesson Planner', 'Unit Planner', 'Sub Planner'],
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    hoverColor: 'hover:border-blue-300',
  },
  {
    name: 'Create',
    icon: PenTool,
    href: '/create',
    description: 'Worksheets, quizzes, slides, flashcards, and graphic organizers',
    tools: ['AI Worksheet Generator', 'Practice Quiz Generator', 'Flashcards Generator', 'Class Slides Maker'],
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    hoverColor: 'hover:border-purple-300',
  },
  {
    name: 'Teach',
    icon: Gamepad2,
    href: '/teach',
    description: 'Games, exit tickets, discussions, and choice boards',
    tools: ['Jeopardy Game Generator', 'Exit Ticket Generator', 'Discussion Questions', 'Icebreaker Generator'],
    color: 'bg-green-50 text-green-600 border-green-100',
    hoverColor: 'hover:border-green-300',
  },
  {
    name: 'Assess',
    icon: BarChart3,
    href: '/assess',
    description: 'Rubrics, feedback, report cards, and gap analysis',
    tools: ['AI Rubric Generator', 'AI Feedback Generator', 'Report Card Comments', 'Study Gap Analyzer'],
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    hoverColor: 'hover:border-orange-300',
  },
  {
    name: 'Support',
    icon: Heart,
    href: '/support',
    description: 'IEP goals, BIPs, differentiation, and social stories',
    tools: ['IEP Goal Generator', 'BIP Generator', 'Social Story Generator', 'Differentiation Plan'],
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    hoverColor: 'hover:border-pink-300',
  },
]

const examplePrompts = [
  { text: 'Energy Flow in a Pond Ecosystem', details: '6–8 | Science | Balanced 5E cycle | NGSS MS-LS2-3' },
  { text: 'The Magic of Photosynthesis', details: 'Grade 7 | Science | 45 min | NGSS' },
  { text: 'Algebra Basics', details: '7th Grade | 15 problems | Medium | both' },
  { text: 'Individuality and Conformity', details: '7th Grade | ELA | 8 questions | Mixed' },
  { text: 'Should schools limit smartphone use?', details: '6–8 | 5 prompts | Discussion Board' },
]

const stats = [
  { value: '5M+', label: 'Resources generated' },
  { value: '50,000+', label: 'Educators trust us' },
  { value: '4.8/5', label: 'Teacher rating' },
  { value: 'K–College', label: 'All grade levels' },
]

const features = [
  {
    icon: Zap,
    title: 'From blank page to classroom-ready in under 60 seconds',
    description: 'Describe what you need in plain language and AI generates a standards-aligned draft.',
  },
  {
    icon: Shield,
    title: 'Standards verified and FERPA & COPPA compliant',
    description: 'CCSS, NGSS, TEKS aligned. Student data is never stored or used for model training.',
  },
  {
    icon: Users,
    title: 'Built with practicing educators',
    description: 'Every tool structure reviewed by K–12 teachers, instructional coaches, and SPED specialists.',
  },
]

export default function HomePage() {
  const [inputValue, setInputValue] = useState('')

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 to-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Tools for Teachers
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Build what your class needs today
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Enter your topic, grade level, and classroom goal to generate plans, materials, assessments, 
            and support docs that save prep time and keep students on track.
          </p>

          {/* Generator Form */}
          <div className="max-w-4xl mx-auto">
            <GeneratorForm />
          </div>

          {/* Example Prompts */}
          <div className="mt-8">
            <p className="text-sm text-gray-500 mb-4">Try these examples:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(example.text)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
                >
                  <div className="font-medium">{example.text}</div>
                  <div className="text-xs text-gray-500">{example.details}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-12 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                <div className="text-gray-600 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything teachers need — all in one place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built for real classroom work, TeachQuill helps teachers save time on prep, teaching tasks, 
              feedback, and day-to-day follow-up with AI tools that produce solid drafts fast.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className={`card ${category.hoverColor}`}
                >
                  <div className={`inline-flex p-3 rounded-xl ${category.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <ul className="space-y-1">
                    {category.tools.slice(0, 3).map((tool, index) => (
                      <li key={index} className="text-sm text-gray-500 flex items-center">
                        <Check className="w-4 h-4 text-primary-500 mr-2" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center text-primary-600 font-medium text-sm">
                    Explore {category.name}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why teachers love TeachQuill
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-primary-100 text-primary-600 rounded-xl mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your teaching practice?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join 50,000+ U.S. educators using TeachQuill to save 10+ hours every week.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center bg-primary-500 text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-400 transition-colors"
            >
              Explore all tools →
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-primary-100">
            <span className="flex items-center"><Check className="w-4 h-4 mr-1" /> 30 free daily credits</span>
            <span className="flex items-center"><Check className="w-4 h-4 mr-1" /> No credit card required</span>
            <span className="flex items-center"><Check className="w-4 h-4 mr-1" /> FERPA & COPPA compliant</span>
            <span className="flex items-center"><Check className="w-4 h-4 mr-1" /> CCSS · NGSS · TEKS aligned</span>
          </div>
        </div>
      </section>
    </div>
  )
}
