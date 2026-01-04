// src/types/quiz.ts

export interface QuizFormData {
  title: string;
  syllabusId: string;
  numQuestions: number;
  difficultyMix: {
    easy: number;
    medium: number;
    hard: number;
  };
  timeLimit?: number;
  isAdaptive: boolean;
}

export interface QuestionFormData {
  type: 'MCQ' | 'TF' | 'SHORT' | 'LONG' | 'CODE';
  question: string;
  options?: string[];
  correct_answer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

export interface QuizAttempt {
  quiz_id: string;
  responses: {
    question_id: string;
    user_answer: string;
    time_taken: number;
  }[];
  total_time: number;
}

export interface QuizDTO {
  id: string;
  title: string;
  syllabus_id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  total_questions: number;
  time_limit?: number;
  created_at: Date;
}

export interface QuizResponseDTO {
  id: string;
  quiz_id: string;
  question_id: string;
  user_answer: string;
  is_correct: boolean;
  time_taken: number;
  question?: string;
  correct_answer?: string;
  explanation?: string;
  created_at?: Date;
}

export interface QuizResult {
  quiz: QuizDTO;
  responses: QuizResponseDTO[];
  score: number;
  total_questions: number;
  time_taken: number;
  performance_by_topic: {
    [topic: string]: {
      correct: number;
      total: number;
      percentage: number;
    };
  };
  performance_by_difficulty: {
    easy: { correct: number; total: number; percentage: number };
    medium: { correct: number; total: number; percentage: number };
    hard: { correct: number; total: number; percentage: number };
  };
}
