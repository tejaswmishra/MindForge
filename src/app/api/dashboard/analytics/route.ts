import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, syllabi, quiz, quiz_responses, questions } from '@/lib/database';
import { eq, sql, desc, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get basic stats
    const [syllabiCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(syllabi)
      .where(eq(syllabi.uploaded_by, user.id));

    const [quizzesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quiz)
      .where(eq(quiz.created_by, user.id));

    const [questionsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(quiz_responses)
      .where(eq(quiz_responses.user_id, user.id));

    // Calculate average score
    const avgScoreResult = await db
      .select({
        avgScore: sql<number>`AVG(CASE WHEN ${quiz_responses.is_correct} THEN 100.0 ELSE 0.0 END)`
      })
      .from(quiz_responses)
      .where(eq(quiz_responses.user_id, user.id));

    const averageScore = Math.round(avgScoreResult[0]?.avgScore || 0);

    // Get recent quizzes with scores
    const recentQuizzes = await db
      .select({
        id: quiz.id,
        title: quiz.title,
        created_at: quiz.created_at,
        score: sql<number>`
          AVG(CASE WHEN ${quiz_responses.is_correct} THEN 100.0 ELSE 0.0 END)
        `,
        hasResponses: sql<number>`COUNT(${quiz_responses.id})`
      })
      .from(quiz)
      .leftJoin(quiz_responses, and(
        eq(quiz_responses.quiz_id, quiz.id),
        eq(quiz_responses.user_id, user.id)
      ))
      .where(eq(quiz.created_by, user.id))
      .groupBy(quiz.id, quiz.title, quiz.created_at)
      .orderBy(desc(quiz.created_at))
      .limit(10);

    // Get performance by topic
    const topicPerformance = await db
      .select({
        topic: questions.topic,
        correct: sql<number>`SUM(CASE WHEN ${quiz_responses.is_correct} THEN 1 ELSE 0 END)`,
        total: sql<number>`COUNT(*)`
      })
      .from(quiz_responses)
      .innerJoin(questions, eq(quiz_responses.question_id, questions.id))
      .where(eq(quiz_responses.user_id, user.id))
      .groupBy(questions.topic)
      .orderBy(sql`COUNT(*) DESC`);

    // Get performance over time (last 30 days)
    const performanceOverTime = await db
      .select({
        date: sql<string>`DATE(${quiz_responses.created_at})`,
        correct: sql<number>`SUM(CASE WHEN ${quiz_responses.is_correct} THEN 1 ELSE 0 END)`,
        total: sql<number>`COUNT(*)`
      })
      .from(quiz_responses)
      .where(
        and(
          eq(quiz_responses.user_id, user.id),
          sql`${quiz_responses.created_at} >= NOW() - INTERVAL '30 days'`
        )
      )
      .groupBy(sql`DATE(${quiz_responses.created_at})`)
      .orderBy(sql`DATE(${quiz_responses.created_at})`);

    const dashboardData = {
      stats: {
        totalSyllabi: syllabiCount.count,
        totalQuizzes: quizzesCount.count,
        averageScore,
        totalQuestions: questionsCount.count,
      },
      recentQuizzes: recentQuizzes.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        created_at: quiz.created_at,
        score: quiz.hasResponses > 0 ? Math.round(quiz.score) : undefined,
      })),
      performanceByTopic: topicPerformance.map(topic => ({
        topic: topic.topic,
        accuracy: Math.round((topic.correct / topic.total) * 100),
        questionsAttempted: topic.total,
      })),
      performanceOverTime: performanceOverTime.map(day => ({
        date: day.date,
        accuracy: Math.round((day.correct / day.total) * 100),
        quizzesAttempted: day.total,
      })),
    };

    return NextResponse.json({
      success: true,
      data: dashboardData,
    });

  } catch (error: any) {
    console.error('Dashboard analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}