import { NextRequest, NextResponse } from 'next/server'

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

const PROMPTS: Record<string, (params: Record<string, string>) => string> = {
  lessonPlan: (p) => `
You are an expert educator creating a detailed lesson plan. Create a comprehensive lesson plan with the following specifications:

Topic: ${p.prompt}

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

  worksheet: (p) => `
You are an expert educator creating a worksheet. Create a comprehensive worksheet with the following specifications:

${p.prompt}

Include:
1. Clear instructions at the top
2. 10 questions/problems appropriate for the grade level
3. Mix of difficulty levels (easy, medium, hard)
4. Space for student work
5. Answer key at the end

Make questions thought-provoking and aligned with learning objectives.
`,

  quiz: (p) => `
You are an expert educator creating a quiz. Create a comprehensive quiz with the following specifications:

${p.prompt}

Include:
1. Clear title and instructions
2. 10 questions in various formats (multiple choice, short answer)
3. Appropriate difficulty
4. Correct answer key
5. Point values

Make questions assess understanding, not just memorization.
`,

  rubric: (p) => `
You are an expert educator creating a grading rubric. Create a comprehensive rubric with the following specifications:

${p.prompt}

Include:
1. Clear criteria categories (4-5 criteria)
2. Performance level descriptions (4 levels: Exemplary, Proficient, Developing, Beginning)
3. Point values for each level
4. Specific indicators for each criterion
5. Total points

Make it detailed, objective, and useful for consistent grading.
`,

  flashCards: (p) => `
You are an expert educator creating flashcards. Create 20 flashcards with the following specifications:

${p.prompt}

Include:
1. Clear, concise definitions/concepts on front
2. Detailed explanations/examples on back
3. Visual cues or mnemonics where helpful
4. Organized by category or difficulty
5. Key vocabulary highlighted

Make them effective for study and retention.
`,

  discussionQuestions: (p) => `
You are an expert educator creating discussion questions. Create thought-provoking discussion questions with the following specifications:

${p.prompt}

Include:
1. Open-ended questions that promote critical thinking
2. Questions that encourage analysis, evaluation, and creation
3. Questions that connect to real-world applications
4. Follow-up prompts to deepen discussion
5. Consider diverse perspectives

Format for easy classroom use.
`,

  exitTicket: (p) => `
You are an expert educator creating an exit ticket. Create a quick exit ticket with the following specifications:

${p.prompt}

Include:
1. 3-5 quick questions (1-2 minutes to complete)
2. Mix of question types (multiple choice, short answer, thumbs up/down)
3. Focus on key concepts from the lesson
4. Self-assessment component
5. Space for student name

Make it quick, focused, and informative for checking understanding.
`,

  iepGoal: (p) => `
You are an expert special education coordinator creating an IEP goal. Create a SMART IEP goal with the following specifications:

${p.prompt}

Include:
1. Clear, measurable annual goal
2. Present level of performance
3. Short-term objectives/benchmarks (3-5)
4. Criteria for mastery
5. Progress monitoring methods
6. Services and accommodations

Follow IDEA requirements and make goals specific, measurable, achievable, relevant, and time-bound.
`,

  bip: (p) => `
You are an expert behavior analyst creating a Behavior Intervention Plan (BIP). Create a comprehensive BIP with the following specifications:

${p.prompt}

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

  reportCard: (p) => `
You are an expert educator creating report card comments. Create an encouraging, specific report card comment with the following specifications:

${p.prompt}

Include:
1. Positive opening acknowledging student's efforts
2. Specific achievements
3. Areas for growth with encouraging language
4. Suggestions for home support
5. Closing statement of confidence

Make it personalized, professional, and constructive.
`,

  subPlans: (p) => `
You are an expert educator creating substitute teacher plans. Create a complete, self-contained sub plan with the following specifications:

${p.prompt}

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

  differentiationPlan: (p) => `
You are an expert educator creating a differentiation plan. Create a comprehensive differentiation strategy with the following specifications:

${p.prompt}

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

  socialStory: (p) => `
You are an expert special education teacher creating a social story. Create a gentle, positive social story with the following specifications:

${p.prompt}

Include:
1. Simple, reassuring narrative
2. Clear descriptions of the situation
3. Positive coping strategies
4. Expected outcomes
5. Visuals cues (described in brackets)

Write in first person ("I") style and keep language positive and concrete.
`,

  unitPlan: (p) => `
You are an expert educator creating a unit plan. Create a comprehensive unit plan with the following specifications:

${p.prompt}

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

  jeopardy: (p) => `
You are an expert educator creating a Jeopardy-style review game. Create a complete Jeopardy game with the following specifications:

${p.prompt}

Include:
1. 5 categories related to the topic
2. 5 questions per category ($100-$500)
3. Clear questions and answers
4. Difficulty progression within each category
5. Double Jeopardy round
6. Final Jeopardy question

Format for easy display and gameplay.
`,
}

export async function POST(request: NextRequest) {
  try {
    const { type, params } = await request.json()

    if (!type || !params?.prompt) {
      return NextResponse.json(
        { success: false, error: 'Missing type or prompt' },
        { status: 400 }
      )
    }

    let promptText = ''
    if (PROMPTS[type]) {
      promptText = PROMPTS[type](params)
    } else {
      promptText = `You are an expert educator. ${params.prompt}

Please provide comprehensive, classroom-ready educational content with:
- Clear structure and organization
- Practical applications
- Multiple examples where appropriate
- Differentiation suggestions
- Standards alignment when applicable

Format your response with clear headings and bullet points for easy reading and implementation.`
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
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      return NextResponse.json(
        { success: false, error: `API Error: ${response.statusText}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    if (data.error) {
      return NextResponse.json(
        { success: false, error: data.error.message || 'Failed to generate content' },
        { status: 500 }
      )
    }

    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No content generated'

    return NextResponse.json({
      success: true,
      content,
    })
  } catch (error: any) {
    console.error('Gemini API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate content. Please check your API key.' 
      },
      { status: 500 }
    )
  }
}
