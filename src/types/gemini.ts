export interface GeminiQuestion {
  id: string;
  type: 'MCQ' | 'TF' | 'SHORT';
  question: string;
  options?: string[];
  answer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface GeminiResponse {
  questions: GeminiQuestion[];
}

export interface GenerateQuizRequest {
  syllabus: string;
  numQuestions: number;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  topics?: string[];
  questionTypes?: ('MCQ' | 'TF' | 'SHORT')[];
}

// ---
