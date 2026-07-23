import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY'
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

const generationConfig = {
  temperature: 0.9,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
}

const safetySettings = [
  { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
]

export interface GenerationRequest {
  prompt: string
  context?: string
}

export interface GenerationResult {
  success: boolean
  content?: string
  error?: string
}

const PROMPTS = {
  lessonPlan: (topic: string, grade: string, subject: string, duration: string) => `
You are an expert educator creating a detailed lesson plan. Create a comprehensive lesson plan with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Duration: ${duration}

Include:
1. Learning Objectives (CCSS aligned)
2. Materials Needed
3. Warm-up Activity
4. Main Instruction
5. Guided Practice
6. Independent Practice
7. Closure/Exit Ticket
8. Assessment
9. Differentiation Strategies
10. Standards (CCSS, NGSS, or TEKS as appropriate)

Format the output with clear headings and bullet points. Make it practical and classroom-ready.
`,

  worksheet: (topic: string, grade: string, subject: string, numQuestions: number, questionType: string) => `
You are an expert educator creating a worksheet. Create a comprehensive worksheet with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Number of Questions: ${numQuestions}
Question Types: ${questionType}

Include:
1. Clear instructions at the top
2. ${numQuestions} questions/problems appropriate for ${grade} level
3. Mix of difficulty levels (easy, medium, hard)
4. Space for student work
5. Answer key at the end

Make questions thought-provoking and aligned with learning objectives.
`,

  rubric: (assignment: string, grade: string, subject: string, rubricType: string) => `
You are an expert educator creating a grading rubric. Create a comprehensive rubric with the following specifications:

Assignment Type: ${assignment}
Grade Level: ${grade}
Subject: ${subject}
Rubric Type: ${rubricType}

Include:
1. Clear criteria categories (4-5 criteria)
2. Performance level descriptions (4 levels: Exemplary, Proficient, Developing, Beginning)
3. Point values for each level
4. Specific indicators for each criterion
5. Total points

Make it detailed, objective, and useful for consistent grading.
`,

  iepGoal: (studentGrade: string, disability: string, area: string, currentLevel: string) => `
You are an expert special education coordinator creating an IEP goal. Create a SMART IEP goal with the following specifications:

Student Grade: ${studentGrade}
Disability Category: ${disability}
Goal Area: ${area}
Current Performance Level: ${currentLevel}

Include:
1. Clear, measurable annual goal
2. Present level of performance
3. Short-term objectives/benchmarks (3-5)
4. Criteria for mastery
5. Progress monitoring methods
6. Services and accommodations

Follow IDEA requirements and make goals specific, measurable, achievable, relevant, and time-bound.
`,

  quiz: (topic: string, grade: string, subject: string, numQuestions: number, format: string) => `
You are an expert educator creating a quiz. Create a comprehensive quiz with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Number of Questions: ${numQuestions}
Format: ${format}

Include:
1. Clear title and instructions
2. ${numQuestions} questions in ${format} format
3. Appropriate difficulty for ${grade}
4. Correct answer key
5. Point values

Make questions assess understanding, not just memorization.
`,

  discussionQuestions: (topic: string, grade: string, subject: string, numQuestions: number) => `
You are an expert educator creating discussion questions. Create thought-provoking discussion questions with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Number of Questions: ${numQuestions}

Include:
1. Open-ended questions that promote critical thinking
2. Questions that encourage analysis, evaluation, and creation
3. Questions that connect to real-world applications
4. Follow-up prompts to deepen discussion
5. Consider diverse perspectives

Format for easy classroom use.
`,

  exitTicket: (topic: string, grade: string, subject: string) => `
You are an expert educator creating an exit ticket. Create a quick exit ticket with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}

Include:
1. 3-5 quick questions (1-2 minutes to complete)
2. Mix of question types (multiple choice, short answer, thumbs up/down)
3. Focus on key concepts from the lesson
4. Self-assessment component
5. Space for student name

Make it quick, focused, and informative for checking understanding.
`,

  bip: (studentGrade: string, behavior: string, triggers: string, currentStrategies: string) => `
You are an expert behavior analyst creating a Behavior Intervention Plan (BIP). Create a comprehensive BIP with the following specifications:

Student Grade: ${studentGrade}
Target Behavior: ${behavior}
Identified Triggers: ${triggers}
Current Strategies: ${currentStrategies}

Include:
1. Operational definition of the behavior
2. ABC data analysis (Antecedent, Behavior, Consequence)
3. Function of the behavior
4. Replacement behaviors to teach
5. Intervention strategies
6. Crisis intervention plan
7. Data collection methods
8. Review date and success criteria

Follow evidence-based practices and make it practical for classroom implementation.
`,

  flashCards: (topic: string, grade: string, subject: string, numCards: number) => `
You are an expert educator creating flashcards. Create ${numCards} flashcards with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}

Include:
1. Clear, concise definitions/concepts on front
2. Detailed explanations/examples on back
3. Visual cues or mnemonics where helpful
4. Organized by category or difficulty
5. Key vocabulary highlighted

Make them effective for study and retention.
`,

  reportCard: (grade: string, subject: string, performanceLevel: string, behaviorNotes: string) => `
You are an expert educator creating report card comments. Create an encouraging, specific report card comment with the following specifications:

Student Grade: ${grade}
Subject: ${subject}
Performance Level: ${performanceLevel}
Behavior Notes: ${behaviorNotes}

Include:
1. Positive opening acknowledging student's efforts
2. Specific achievements in ${subject}
3. Areas for growth with encouraging language
4. Suggestions for home support
5. Closing statement of confidence

Make it personalized, professional, and constructive.
`,

  subPlans: (topic: string, grade: string, subject: string, duration: string) => `
You are an expert educator creating substitute teacher plans. Create a complete, self-contained sub plan with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Duration: ${duration}

Include:
1. Classroom setup instructions
2. Daily schedule with times
3. Detailed activity instructions
4. Materials needed (clearly labeled)
5. Behavioral expectations
6. Emergency procedures
7. Answer keys where applicable
8. Student accessibility notes

Make it detailed enough for any substitute to implement successfully.
`,

  differentiationPlan: (topic: string, grade: string, subject: string, studentNeeds: string) => `
You are an expert educator creating a differentiation plan. Create a comprehensive differentiation strategy with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Student Learning Needs: ${studentNeeds}

Include:
1. Below-level modifications
2. On-level activities
3. Above-level extensions
4. Specific accommodations
5. Learning preference strategies (visual, auditory, kinesthetic)
6. Assessment alternatives
7. Materials for each tier

Make it practical and classroom-ready.
`,

  socialStory: (topic: string, grade: string, situation: string, emotions: string) => `
You are an expert special education teacher creating a social story. Create a gentle, positive social story with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Situation: ${situation}
Emotions to Address: ${emotions}

Include:
1. Simple, reassuring narrative
2. Clear descriptions of the situation
3. Positive coping strategies
4. Expected outcomes
5. Visuals cues (described in brackets)

Write in first person ("I") style and keep language positive and concrete.
`,

  unitPlan: (topic: string, grade: string, subject: string, numWeeks: number) => `
You are an expert educator creating a unit plan. Create a comprehensive unit plan with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Duration: ${numWeeks} week(s)

Include:
1. Unit overview and essential questions
2. Learning objectives (CCSS aligned)
3. Week-by-week breakdown
4. Daily objectives and activities
5. Assessments (formative and summative)
6. Resources and materials
7. Differentiation notes
8. Standards addressed

Make it cohesive and practical for long-term planning.
`,

  jeopardy: (topic: string, grade: string, subject: string, numCategories: number) => `
You are an expert educator creating a Jeopardy-style review game. Create a complete Jeopardy game with the following specifications:

Topic: ${topic}
Grade Level: ${grade}
Subject: ${subject}
Number of Categories: ${numCategories}

Include:
1. ${numCategories} categories related to the topic
2. 5 questions per category ($100-$500)
3. Clear questions and answers
4. Difficulty progression within each category
5. Double Jeopardy round
6. Final Jeopardy question

Format for easy display and gameplay.
`,
}

export async function generateContent(type: string, params: Record<string, string>): Promise<GenerationResult> {
  try {
    let promptText = ''
    
    switch (type) {
      case 'lessonPlan':
        promptText = PROMPTS.lessonPlan(params.topic, params.grade, params.subject, params.duration)
        break
      case 'worksheet':
        promptText = PROMPTS.worksheet(params.topic, params.grade, params.subject, parseInt(params.numQuestions) || 10, params.questionType)
        break
      case 'rubric':
        promptText = PROMPTS.rubric(params.assignment, params.grade, params.subject, params.rubricType)
        break
      case 'iepGoal':
        promptText = PROMPTS.iepGoal(params.studentGrade, params.disability, params.area, params.currentLevel)
        break
      case 'quiz':
        promptText = PROMPTS.quiz(params.topic, params.grade, params.subject, parseInt(params.numQuestions) || 10, params.format)
        break
      case 'discussionQuestions':
        promptText = PROMPTS.discussionQuestions(params.topic, params.grade, params.subject, parseInt(params.numQuestions) || 5)
        break
      case 'exitTicket':
        promptText = PROMPTS.exitTicket(params.topic, params.grade, params.subject)
        break
      case 'bip':
        promptText = PROMPTS.bip(params.studentGrade, params.behavior, params.triggers, params.currentStrategies)
        break
      case 'flashCards':
        promptText = PROMPTS.flashCards(params.topic, params.grade, params.subject, parseInt(params.numCards) || 20)
        break
      case 'reportCard':
        promptText = PROMPTS.reportCard(params.grade, params.subject, params.performanceLevel, params.behaviorNotes)
        break
      case 'subPlans':
        promptText = PROMPTS.subPlans(params.topic, params.grade, params.subject, params.duration)
        break
      case 'differentiationPlan':
        promptText = PROMPTS.differentiationPlan(params.topic, params.grade, params.subject, params.studentNeeds)
        break
      case 'socialStory':
        promptText = PROMPTS.socialStory(params.topic, params.grade, params.situation, params.emotions)
        break
      case 'unitPlan':
        promptText = PROMPTS.unitPlan(params.topic, params.grade, params.subject, parseInt(params.numWeeks) || 3)
        break
      case 'jeopardy':
        promptText = PROMPTS.jeopardy(params.topic, params.grade, params.subject, parseInt(params.numCategories) || 5)
        break
      default:
        promptText = params.prompt || 'Generate educational content.'
    }

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig,
        safetySettings,
      }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error.message || 'Failed to generate content')
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated'

    return {
      success: true,
      content,
    }
  } catch (error: any) {
    console.error('Gemini API error:', error)
    return {
      success: false,
      error: error.message || 'Failed to generate content',
    }
  }
}

export { PROMPTS }
