// src/types/database.ts
export interface User {
  id: string;
  clerk_id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher';
  created_at: string;
  updated_at: string;
}

export interface Syllabus {
  id: string;
  title: string;
  content: string;
  file_url?: string;
  file_type: 'pdf' | 'docx' | 'image' | 'text';
  subject?: string;
  uploaded_by: string;
  created_at: string;
  uploader?: User;
}

export interface Question {
  id: string;
  syllabus_id: string;
  type: 'MCQ' | 'TF' | 'SHORT' | 'LONG' | 'CODE';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  created_at: string;
  syllabus?: Syllabus;
}

export interface Quiz {
  id: string;
  title: string;
  syllabus_id: string;
  created_by: string;
  num_questions: number;
  difficulty_mix: { easy: number; medium: number; hard: number };
  time_limit?: number;
  is_adaptive: boolean;
  created_at: string;
  syllabus?: Syllabus;
  creator?: User;
  questions?: Question[];
}

export interface QuizResponse {
  id: string;
  quiz_id: string;
  user_id: string;
  question_id: string;
  user_answer: string;
  is_correct: boolean;
  time_taken: number;
  created_at: string;
  question?: Question;
}

export interface UserProgress {
  id: string;
  user_id: string;
  syllabus_id: string;
  topic: string;
  correct_answers: number;
  total_attempts: number;
  difficulty_performance: { easy: number; medium: number; hard: number };
  last_practiced: string;
  created_at: string;
  syllabus?: Syllabus;
}

// ---