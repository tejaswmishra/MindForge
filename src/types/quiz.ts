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

export interface QuizResult {
  quiz: Quiz;
  responses: QuizResponse[];
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

// ---