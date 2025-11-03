import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, quiz_responses, questions } from '@/lib/database';
import { eq } from 'drizzle-orm';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const quizId = await params.id;
    const { responses, totalTime } = await req.json();

    console.log('Submitting quiz:', quizId, 'Responses:', responses.length);

    let correctCount = 0;
    const results = [];

    // Process each response
    for (const response of responses) {
      const { question_id, user_answer, time_taken } = response;

      // Get correct answer
      const [questionData] = await db
        .select()
        .from(questions)
        .where(eq(questions.id, question_id))
        .limit(1);

      if (!questionData) continue;

      const isCorrect = user_answer.toLowerCase().trim() === 
                       questionData.correct_answer.toLowerCase().trim();
      
      if (isCorrect) correctCount++;

      // Save response to database
      const [savedResponse] = await db.insert(quiz_responses).values({
        quiz_id: quizId,
        user_id: user.id,
        question_id,
        user_answer,
        is_correct: isCorrect,
        time_taken,
      }).returning();

      results.push({
        ...savedResponse,
        question: questionData.question,
        correct_answer: questionData.correct_answer,
        explanation: questionData.explanation,
      });
    }

    const score = Math.round((correctCount / responses.length) * 100);

    console.log('Quiz completed. Score:', score, '%');

    return NextResponse.json({
      success: true,
      results: {
        score,
        correct: correctCount,
        total: responses.length,
        totalTime,
        responses: results,
      },
    });

  } catch (error: any) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    );
  }
}