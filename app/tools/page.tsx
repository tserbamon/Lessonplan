'use client'

import { BookOpen, PenTool, Gamepad2, BarChart3, Heart, FileText, Presentation, Target, MessageCircle, Award, Users } from 'lucide-react'
import Link from 'next/link'

const toolCategories = [
  {
    name: 'Plan',
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    href: '/plan',
    tools: [
      { name: 'AI Lesson Plan Generator', description: 'Create detailed, standards-aligned lesson plans' },
      { name: 'Unit Planner', description: 'Plan comprehensive units spanning multiple weeks' },
      { name: 'Weekly Lesson Planner', description: 'Organize your entire week of lessons' },
      { name: 'Daily School Planner', description: 'Plan your daily schedule and activities' },
      { name: 'Sub Planner', description: 'Create complete substitute teacher plans' },
      { name: 'Curriculum Mapper', description: 'Align your curriculum with standards' },
      { name: 'Learning Objectives Generator', description: 'Write clear, measurable learning objectives' },
      { name: 'AI Syllabus Generator', description: 'Create comprehensive course syllabi' },
    ],
  },
  {
    name: 'Create',
    icon: PenTool,
    color: 'bg-purple-50 text-purple-600 border-purple-100',
    href: '/create',
    tools: [
      { name: 'AI Worksheet Generator', description: 'Create differentiated worksheets' },
      { name: 'Practice Quiz Generator', description: 'Generate quizzes with various question types' },
      { name: 'Flashcards Generator', description: 'Create study flashcards' },
      { name: 'Class Slides Maker', description: 'Generate presentation slides quickly' },
      { name: 'Graphic Organizer Generator', description: 'Create visual organizers and diagrams' },
      { name: 'Guided Notes Generator', description: 'Create structured guided notes' },
      { name: 'Math Worksheet Generator', description: 'Create math practice problems' },
      { name: 'Vocabulary Worksheet Generator', description: 'Build vocabulary practice worksheets' },
    ],
  },
  {
    name: 'Teach',
    icon: Gamepad2,
    color: 'bg-green-50 text-green-600 border-green-100',
    href: '/teach',
    tools: [
      { name: 'Jeopardy Game Generator', description: 'Create engaging review games' },
      { name: 'Discussion Questions Generator', description: 'Generate thought-provoking prompts' },
      { name: 'Exit Ticket Generator', description: 'Quick exit tickets to check understanding' },
      { name: 'Icebreaker Generator', description: 'Fun icebreakers for any setting' },
      { name: 'Debate Topic Generator', description: 'Create engaging debate topics' },
      { name: 'Choice Board Generator', description: 'Build student choice boards' },
    ],
  },
  {
    name: 'Assess',
    icon: BarChart3,
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    href: '/assess',
    tools: [
      { name: 'AI Rubric Generator', description: 'Create detailed grading rubrics' },
      { name: 'AI Feedback Generator', description: 'Generate constructive feedback' },
      { name: 'Report Card Comments', description: 'Create meaningful comments quickly' },
      { name: 'Worksheet Grader', description: 'Quickly grade worksheets' },
      { name: 'Assessment Checklist Generator', description: 'Create assessment checklists' },
      { name: 'Study Gap Analyzer', description: 'Identify knowledge gaps' },
    ],
  },
  {
    name: 'Support',
    icon: Heart,
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    href: '/support',
    tools: [
      { name: 'IEP Goal Generator', description: 'Create SMART IEP goals' },
      { name: 'BIP Generator', description: 'Create Behavior Intervention Plans' },
      { name: 'Differentiation Plan Generator', description: 'Create tiered lessons' },
      { name: 'Social Story Generator', description: 'Create social stories' },
      { name: '504 Plan Generator', description: 'Create 504 accommodation plans' },
      { name: 'Visual Schedule Generator', description: 'Create visual schedules' },
    ],
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-16 px-4 border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">All AI Teaching Tools</h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Browse our complete collection of 50+ AI-powered tools for teachers. 
            From lesson planning to IEP goals, we have everything you need.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-16">
            {toolCategories.map((category) => {
              const Icon = category.icon
              return (
                <div key={category.name}>
                  <Link href={category.href} className="inline-flex items-center gap-3 mb-6 group">
                    <div className={`p-3 rounded-xl ${category.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {category.name} Tools
                    </h2>
                    <span className="text-primary-600 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {category.tools.map((tool) => (
                      <div key={tool.name} className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all">
                        <h3 className="font-semibold text-gray-900 mb-2">{tool.name}</h3>
                        <p className="text-gray-600 text-sm">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join 50,000+ educators using TeachQuill to save time and improve student outcomes.
          </p>
          <Link href="/signup" className="inline-flex items-center bg-white text-primary-700 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
