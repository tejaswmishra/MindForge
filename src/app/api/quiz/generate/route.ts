import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { generateAdvancedQuiz } from '@/lib/gemini';
import { db, syllabi, quiz, questions, quiz_questions } from '@/lib/database';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  console.log('=== QUIZ GENERATION API ===');
  
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { syllabusId, numQuestions = 10, difficulty = 'mixed' } = await req.json();
    console.log('Generating quiz for syllabus:', syllabusId, 'Questions:', numQuestions);

    // Get syllabus content
    const [syllabusData] = await db
      .select()
      .from(syllabi)
      .where(eq(syllabi.id, syllabusId))
      .limit(1);

    if (!syllabusData) {
      return NextResponse.json({ error: 'Syllabus not found' }, { status: 404 });
    }

    console.log('Found syllabus:', syllabusData.title);

    // Generate questions with AI
    const generatedQuestions = await generateAdvancedQuiz({
      syllabus: syllabusData.content,
      numQuestions,
      subject: syllabusData.subject,
      difficulty,
    });

    console.log('Generated', generatedQuestions.length, 'questions');

    // Create quiz record
    const [newQuiz] = await db.insert(quiz).values({
      title: `Quiz: ${syllabusData.title}`,
      syllabus_id: syllabusId,
      created_by: user.id,
      num_questions: generatedQuestions.length,
    }).returning();

    console.log('Created quiz:', newQuiz.id);

    // Insert questions and link to quiz
    const insertedQuestions = [];
    for (let i = 0; i < generatedQuestions.length; i++) {
      const q = generatedQuestions[i];
      
      const [question] = await db.insert(questions).values({
        syllabus_id: syllabusId,
        type: q.type,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        topic: q.topic,
      }).returning();

      // Link question to quiz
      await db.insert(quiz_questions).values({
        quiz_id: newQuiz.id,
        question_id: question.id,
        sequence_order: i + 1,
      });

      insertedQuestions.push(question);
    }

    console.log('Quiz generation completed successfully');

    return NextResponse.json({
      success: true,
      quiz: {
        ...newQuiz,
        questions: insertedQuestions,
      },
    });

  } catch (error: any) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate quiz: ' + error.message },
      { status: 500 }
    );
  }
}