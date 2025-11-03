// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY as string;
if (!API_KEY) throw new Error("Missing GEMINI_API_KEY in .env.local");

const genAI = new GoogleGenerativeAI(API_KEY);

// Updated to use Gemini 2.5 models (2.0 works too)
const MODEL_ORDER = ["gemini-2.5-flash", "gemini-2.5-pro"] as const;

type GenerateOpts = {
  model?: (typeof MODEL_ORDER)[number];
  maxRetries?: number;
  temperature?: number;
};

async function callOnce(prompt: string, modelName: string, temperature: number) {
  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }]}],
    generationConfig: { temperature },
  });
  return result.response.text();
}

export async function generateWithFallback(
  prompt: string,
  opts: GenerateOpts = {}
) {
  const {
    model,
    maxRetries = 2,
    temperature = 0.7,
  } = opts;

  const order = model
    ? [model, ...MODEL_ORDER.filter(m => m !== model)]
    : [...MODEL_ORDER];

  let lastErr: any = null;

  for (const m of order) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await callOnce(prompt, m, temperature);
      } catch (err: any) {
        lastErr = err;
        const retryable = err?.status === 429 || err?.status === 503 || err?.status === 404;
        if (!retryable || attempt === maxRetries) break;
        const delay = Math.min(4000, 600 * 2 ** attempt);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw lastErr;
}

// ----- Quiz-specific helpers -----

export function buildQuizPrompt(params: {
  syllabus: string;
  numQuestions?: number;
}) {
  const { syllabus, numQuestions = 10 } = params;

  return `You are MindForge, a strict exam setter.

Syllabus:
${syllabus}

Create ${numQuestions} balanced questions covering all major topics.
Mix types (MCQ, True/False, Short Answer).
Return STRICT JSON matching this schema (no extra prose):

{
  "questions":[
    {
      "id":"uuid",
      "type":"MCQ|TF|SHORT",
      "question":"string",
      "options": ["A","B","C","D"] | null,
      "answer":"string",
      "difficulty":"easy|medium|hard",
      "topic":"string"
    }
  ]
}`;
}

export async function generateQuizJSON(syllabus: string, numQuestions = 10) {
  const prompt = buildQuizPrompt({ syllabus, numQuestions });
  const text = await generateWithFallback(prompt, { temperature: 0.3 });

  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    const jsonText = text.slice(start, end + 1);
    return JSON.parse(jsonText);
  } catch {
    return { raw: text };
  }
}

interface QuestionData {
  type: 'MCQ' | 'TF' | 'SHORT';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export async function generateAdvancedQuiz(params: {
  syllabus: string;
  numQuestions: number;
  subject?: string | null;
  difficulty?: string;
}): Promise<QuestionData[]> {
  const { syllabus, numQuestions, subject, difficulty = 'mixed' } = params;
  
  const prompt = buildAdvancedQuizPrompt({
    syllabus,
    numQuestions,
    subject,
    difficulty,
  });

  const text = await generateWithFallback(prompt, { temperature: 0.3 });
  return parseQuizResponse(text);
}

function buildAdvancedQuizPrompt(params: {
  syllabus: string;
  numQuestions: number;
  subject?: string | null;
  difficulty: string;
}) {
  const { syllabus, numQuestions, subject, difficulty } = params;
  
  const difficultyInstruction = difficulty === 'mixed' 
    ? `Mix difficulty: ${Math.floor(numQuestions * 0.3)} easy, ${Math.floor(numQuestions * 0.5)} medium, ${Math.ceil(numQuestions * 0.2)} hard questions`
    : `All questions should be ${difficulty} difficulty`;
  
  return `You are MindForge, an expert educational assessment creator${subject ? ` specializing in ${subject}` : ''}.

SYLLABUS CONTENT:
${syllabus}

REQUIREMENTS:
- Create exactly ${numQuestions} high-quality questions
- ${difficultyInstruction}
- Question types: 60% MCQ, 20% True/False, 20% Short Answer
- Cover ALL major topics from the syllabus
- Ensure questions test understanding, not just memorization

QUALITY STANDARDS:
- Easy: Basic definitions, direct facts from content
- Medium: Application of concepts, analysis of scenarios  
- Hard: Synthesis, evaluation, complex problem-solving
- All MCQ options should be plausible (avoid obviously wrong answers)
- Include brief explanations for correct answers

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "questions": [
    {
      "type": "MCQ|TF|SHORT",
      "question": "Clear, concise question text",
      "options": ["Option A", "Option B", "Option C", "Option D"] | null,
      "correct_answer": "Exact answer text",
      "explanation": "Brief explanation of why this is correct",
      "difficulty": "easy|medium|hard",
      "topic": "Specific topic from syllabus"
    }
  ]
}

CRITICAL: Return ONLY valid JSON. No additional text, comments, or formatting.`;
}

function parseQuizResponse(response: string): QuestionData[] {
  try {
    const cleanResponse = response.trim();
    const jsonStart = cleanResponse.indexOf('{');
    const jsonEnd = cleanResponse.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON found in response');
    }

    const jsonText = cleanResponse.slice(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonText);
    
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid questions format');
    }

    return parsed.questions.map((q: any) => ({
      type: q.type as QuestionData['type'],
      question: q.question,
      options: q.type === 'SHORT' ? null : (q.options || ['True', 'False']),
      correct_answer: q.correct_answer || q.answer,
      explanation: q.explanation || null,
      difficulty: q.difficulty as QuestionData['difficulty'],
      topic: q.topic,
    }));
  } catch (error) {
    console.error('Failed to parse quiz response:', error);
    console.error('Raw response:', response.substring(0, 500) + '...');
    throw new Error('Failed to parse AI response');
  }
}