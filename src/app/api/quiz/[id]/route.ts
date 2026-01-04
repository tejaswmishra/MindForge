import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, quiz, questions, quiz_questions } from '@/lib/database';
import { eq, asc } from 'drizzle-orm';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ await params correctly
    const { id: quizId } = await context.params;

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Fetching quiz:', quizId);

    // Get quiz details
    const [quizData] = await db
      .select()
      .from(quiz)
      .where(eq(quiz.id, quizId))
      .limit(1);

    if (!quizData) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Get quiz questions in order
    const quizQuestions = await db
      .select({
        question: questions,
        sequence_order: quiz_questions.sequence_order,
      })
      .from(quiz_questions)
      .innerJoin(questions, eq(quiz_questions.question_id, questions.id))
      .where(eq(quiz_questions.quiz_id, quizId))
      .orderBy(asc(quiz_questions.sequence_order));

    const questionsData = quizQuestions.map(qr => qr.question);

    return NextResponse.json({
      success: true,
      quiz: {
        ...quizData,
        questions: questionsData,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    );
  }
}
