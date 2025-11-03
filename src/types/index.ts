
// src/types/index.ts
export * from './database';
export * from './api';
export * from './quiz';
export * from './gemini';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'MCQ' | 'TF' | 'SHORT' | 'LONG' | 'CODE';
export type FileType = 'pdf' | 'docx' | 'image' | 'text';
export type UserRole = 'student' | 'teacher';