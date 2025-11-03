// drizzle/schema.ts
import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  primaryKey,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerk_id: text('clerk_id').notNull().unique(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').notNull().default('student'), // 'student' | 'teacher'
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Syllabi table
export const syllabi = pgTable('syllabi', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  file_url: text('file_url'),
  file_type: text('file_type').notNull(), // 'pdf' | 'docx' | 'image' | 'text'
  subject: text('subject'),
  uploaded_by: uuid('uploaded_by').references(() => users.id).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Questions table
export const questions = pgTable('questions', {
  id: uuid('id').primaryKey().defaultRandom(),
  syllabus_id: uuid('syllabus_id').references(() => syllabi.id).notNull(),
  type: text('type').notNull(), // 'MCQ' | 'TF' | 'SHORT' | 'LONG' | 'CODE'
  question: text('question').notNull(),
  options: jsonb('options'), // for MCQ options
  correct_answer: text('correct_answer').notNull(),
  explanation: text('explanation'),
  difficulty: text('difficulty').notNull().default('medium'),
  topic: text('topic').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Quiz table
export const quiz = pgTable('quiz', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  syllabus_id: uuid('syllabus_id').references(() => syllabi.id).notNull(),
  created_by: uuid('created_by').references(() => users.id).notNull(),
  num_questions: integer('num_questions').notNull().default(10),
  difficulty_mix: jsonb('difficulty_mix'), // {"easy": 3, "medium": 5, "hard": 2}
  time_limit: integer('time_limit'), // in minutes
  is_adaptive: boolean('is_adaptive').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Junction table for quiz questions
export const quiz_questions = pgTable(
  'quiz_questions',
  {
    quiz_id: uuid('quiz_id').references(() => quiz.id).notNull(),
    question_id: uuid('question_id').references(() => questions.id).notNull(),
    sequence_order: integer('sequence_order').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.quiz_id, table.question_id] }),
  })
);

// Quiz responses table
export const quiz_responses = pgTable('quiz_responses', {
  id: uuid('id').primaryKey().defaultRandom(),
  quiz_id: uuid('quiz_id').references(() => quiz.id).notNull(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  question_id: uuid('question_id').references(() => questions.id).notNull(),
  user_answer: text('user_answer').notNull(),
  is_correct: boolean('is_correct').notNull(),
  time_taken: integer('time_taken').notNull(), // seconds
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// User progress table
export const user_progress = pgTable('user_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  syllabus_id: uuid('syllabus_id').references(() => syllabi.id).notNull(),
  topic: text('topic').notNull(),
  correct_answers: integer('correct_answers').notNull().default(0),
  total_attempts: integer('total_attempts').notNull().default(0),
  difficulty_performance: jsonb('difficulty_performance'), // {"easy": 0.9, "medium": 0.7, "hard": 0.4}
  last_practiced: timestamp('last_practiced'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  syllabi: many(syllabi),
  quizzes: many(quiz),
  quiz_responses: many(quiz_responses),
  progress: many(user_progress),
}));

export const syllabiRelations = relations(syllabi, ({ one, many }) => ({
  uploader: one(users, {
    fields: [syllabi.uploaded_by],
    references: [users.id],
  }),
  questions: many(questions),
  quizzes: many(quiz),
  user_progress: many(user_progress),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  syllabus: one(syllabi, {
    fields: [questions.syllabus_id],
    references: [syllabi.id],
  }),
  quiz_questions: many(quiz_questions),
  quiz_responses: many(quiz_responses),
}));

export const quizRelations = relations(quiz, ({ one, many }) => ({
  syllabus: one(syllabi, {
    fields: [quiz.syllabus_id],
    references: [syllabi.id],
  }),
  creator: one(users, {
    fields: [quiz.created_by],
    references: [users.id],
  }),
  quiz_questions: many(quiz_questions),
  quiz_responses: many(quiz_responses),
}));

export const quiz_questionsRelations = relations(quiz_questions, ({ one }) => ({
  quiz: one(quiz, {
    fields: [quiz_questions.quiz_id],
    references: [quiz.id],
  }),
  question: one(questions, {
    fields: [quiz_questions.question_id],
    references: [questions.id],
  }),
}));

export const quiz_responsesRelations = relations(quiz_responses, ({ one }) => ({
  quiz: one(quiz, {
    fields: [quiz_responses.quiz_id],
    references: [quiz.id],
  }),
  user: one(users, {
    fields: [quiz_responses.user_id],
    references: [users.id],
  }),
  question: one(questions, {
    fields: [quiz_responses.question_id],
    references: [questions.id],
  }),
}));

export const user_progressRelations = relations(user_progress, ({ one }) => ({
  user: one(users, {
    fields: [user_progress.user_id],
    references: [users.id],
  }),
  syllabus: one(syllabi, {
    fields: [user_progress.syllabus_id],
    references: [syllabi.id],
  }),
}));

// Flashcards table
export const flashcards = pgTable('flashcards', {
  id: uuid('id').primaryKey().defaultRandom(),
  user_id: uuid('user_id').references(() => users.id).notNull(),
  syllabus_id: uuid('syllabus_id').references(() => syllabi.id),
  front: text('front').notNull(),        // Q/Term/Prompt
  back: text('back').notNull(),         // A/Definition/Response
  topic: text('topic'),                 // Optional: group by topic
  last_studied: timestamp('last_studied'),
  next_due: timestamp('next_due'),
  interval_days: integer('interval_days').default(1), // For spaced repetition
  ease_factor: integer('ease_factor').default(250),   // Store *100 (e.g., 2.5 -> 250)
  repetition: integer('repetition').default(0),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const flashcardsRelations = relations(flashcards, ({ one }) => ({
  user: one(users, {
    fields: [flashcards.user_id],
    references: [users.id],
  }),
  syllabus: one(syllabi, {
    fields: [flashcards.syllabus_id],
    references: [syllabi.id],
  }),
}));


// ---