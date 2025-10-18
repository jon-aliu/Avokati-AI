/**
 * OpenAI API Integration
 * Handles AI chat completions with law validation
 */

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GroqResponse {
  answer: string
  isLawRelated: boolean
  confidence: number
  model: string
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY
const VALIDATION_MODEL = process.env.NEXT_PUBLIC_OPENAI_VALIDATION_MODEL // || 'gpt-3.5-turbo'
const RESPONSE_MODEL = process.env.NEXT_PUBLIC_OPENAI_RESPONSE_MODEL //|| 'gpt-3.5-turbo'

// System prompt for law validation and responses
const SYSTEM_PROMPT =`You are Avokati AI, a professional legal assistant specialized EXCLUSIVELY in Kosovo law, regulations, and legal matters. Your expertise draws from official sources like the Official Gazette of the Republic of Kosovo (Gazeta Zyrtare - GZK). Always prioritize accuracy, neutrality, and ethical guidelines—remind users this is not formal legal advice.

Core Rules:
1. **Query Assessment**: FIRST, evaluate if the user's question pertains to Kosovo law, legal rights, regulations, court procedures, or related topics (e.g., contracts, family law, criminal penalties under Kosovo codes).
2. **Non-Legal Queries**: If unrelated (e.g., weather, recipes, general advice), politely decline: "Avokati AI specializes in Kosovo legal matters only. Please rephrase your question to focus on laws or regulations—how can I assist with a legal query?"
3. **Legal Queries**: If relevant, deliver a SIMPLE, concise response:
   - **Main Section**: Give a direct, 1-2 sentence answer to the core question. Include the key fact (e.g., amount, procedure) based on current laws. Use simple language; explain briefly if needed.
   - **References Section**: At the END, list 1-2 key laws/regulations cited, with brief descriptions and GZK references (e.g., "• Law No. 03/L-212 on Labour: Regulates employment rights and minimum wage (available at GZK: https://gzk.rks-gov.net/ActDocumentDetail.aspx?ActID=2735).").
   - **Disclaimer**: Conclude with: "This is general information based on public laws—not personalized legal advice. Consult a licensed Kosovo lawyer for your specific situation."

Response Guidelines:
- **Structure**: ALWAYS: Direct answer → References (1-2 bullets) → Disclaimer. No long explanations, steps, or sections unless directly asked.
- **Language**: Respond in the query's language (Albanian or English). Use formal, accessible tone—avoid jargon or explain it.
- **Conciseness**: Limit to 150 words; be direct and helpful—refer to official sources for details.
- **Ethical Guardrails**: Never give binding advice, predict outcomes, or handle sensitive personal data. For facts like minimum wage: State "350 euro bruto/month (as of Oct 2024; verify latest at GZK)."


**Referenca:**
• Ligji Nr

This is general information based on public laws—not personalized legal advice. Consult a licensed Kosovo lawyer for your specific situation.`;

/**
 * Validate if a question is law-related using OpenAI
 */
export async function validateLawQuestion(question: string): Promise<boolean> {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key not configured')
    return true // Allow question if validation fails
  }

  // Quick keyword check for common legal topics (Albanian & English)
  const legalKeywords = [
    'paga', 'wage', 'salary', 'rroga', 'minimale', 'minimum',
    'ligj', 'law', 'ligjit', 'legal', 'juridik',
    'punë', 'work', 'employment', 'labor', 'labour',
    'drejt', 'right', 'rights', 'obligation',
    'kontrat', 'contract', 'marrëvesh', 'agreement',
    'gjykatë', 'court', 'gjyqësor', 'judicial',
    'rregullore', 'regulation', 'statute', 'kod',
    'biznes', 'business', 'kompani', 'company',
    'pronë', 'property', 'qira', 'rent',
    'martesë', 'marriage', 'divorcim', 'divorce',
    'krim', 'crime', 'criminal', 'penal'
  ]
  
  const questionLower = question.toLowerCase()
  const hasLegalKeyword = legalKeywords.some(keyword => questionLower.includes(keyword))
  
  // If contains legal keyword, it's definitely law-related
  if (hasLegalKeyword) {
    return true
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: VALIDATION_MODEL,
        messages: [
          {
            role: 'system',
            content: `You are a legal question classifier. Determine if a question relates to law, legal matters, or regulations.

ALWAYS respond "YES" for questions about:
- Minimum wage, salary, pay, compensation (LABOR LAW)
- Employment, workers, labor rights, working hours
- Laws, regulations, legal codes, statutes
- Legal rights, obligations, procedures
- Courts, justice, legal processes
- Contracts, agreements, legal documents
- Family law (marriage, divorce, custody, inheritance)
- Criminal law (crimes, penalties, procedures)
- Property law (ownership, rental, real estate)
- Business law (company registration, taxes)
- Constitutional rights and freedoms
- Administrative procedures, government regulations
- ANY topic governed by Kosovo law

Examples of LAW-RELATED (respond YES):
- "What is minimum wage?" → YES (Labor Law)
- "Sa është paga minimale?" → YES (Labor Law)
- "How to register a business?" → YES (Business Law)
- "What are tenant rights?" → YES (Property Law)
- "How does divorce work?" → YES (Family Law)

ONLY respond "NO" for clearly non-legal topics:
- Weather, sports, entertainment
- Recipes, cooking, travel tips
- General knowledge not involving law

IMPORTANT: When ANY doubt exists, respond "YES". Questions about wages, salaries, employment, and working conditions are ALWAYS legal questions.`
          },
          {
            role: 'user',
            content: `Question: "${question}"\n\nIs this law-related? Answer only YES or NO.`
          }
        ],
        temperature: 0.0,
        max_tokens: 5,
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.statusText)
      return true // Allow question if validation fails
    }

    const data = await response.json()
    const answer = data.choices[0]?.message?.content?.trim().toUpperCase()
    
    // Be very permissive - accept YES, Y, or any response containing YES
    return answer.includes('YES') || answer.includes('Y')
  } catch (error) {
    console.error('Error validating question:', error)
    return true // Allow question if validation fails
  }
}

/**
 * Get AI response from OpenAI
 */
export async function getGroqResponse(
  question: string,
  language: 'en' | 'al' = 'al'
): Promise<GroqResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key not configured. Please add NEXT_PUBLIC_OPENAI_API_KEY to your .env.local file.')
  }

  // First, validate if question is law-related
  const isLawRelated = await validateLawQuestion(question)

  if (!isLawRelated) {
    return {
      answer: language === 'en'
        ? "I'm sorry, but I can only answer questions related to law and legal matters. Please ask a question about Kosovo law, legal rights, regulations, or legal procedures."
        : "Më vjen keq, por unë mund të përgjigjem vetëm në pyetje që lidhen me ligjin dhe çështjet juridike. Ju lutemi bëni një pyetje rreth ligjit të Kosovës, të drejtave juridike, rregulloreve ose procedurave ligjore.",
      isLawRelated: false,
      confidence: 1.0,
      model: VALIDATION_MODEL,
    }
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: RESPONSE_MODEL,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.5,
        max_tokens: 800,
        top_p: 1,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('OpenAI API error response:', errorData)
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log('OpenAI API response:', data)
    
    const answer = data.choices?.[0]?.message?.content
    
    if (!answer || answer.trim().length === 0) {
      console.error('Empty response from OpenAI:', data)
      throw new Error('OpenAI returned an empty response. Please try again.')
    }
    
    // Calculate simple confidence based on response length and structure
    const confidence = Math.min(0.95, 0.7 + (answer.length / 1000) * 0.25)

    return {
      answer,
      isLawRelated: true,
      confidence,
      model: data.model || RESPONSE_MODEL,
    }
  } catch (error: any) {
    console.error('OpenAI API error:', error)
    throw new Error(error.message || 'Failed to get response from AI')
  }
}

/**
 * Check if OpenAI API is configured
 */
export function isGroqConfigured(): boolean {
  return !!OPENAI_API_KEY && OPENAI_API_KEY.length > 0
}
