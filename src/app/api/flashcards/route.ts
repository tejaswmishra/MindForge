// src/app/api/flashcards/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { flashcards, users, syllabi } from '@/../drizzle/schema';
import { eq, and, lte } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const syllabusId = searchParams.get('syllabusId');
    const dueOnly = searchParams.get('dueOnly') === 'true';

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerk_id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // ✅ Build conditions array
    const conditions = [eq(flashcards.user_id, user.id)];

    if (syllabusId) {
      conditions.push(eq(flashcards.syllabus_id, syllabusId));
    }

    if (dueOnly) {
      conditions.push(lte(flashcards.next_due, new Date()));
    }

    // ✅ Apply WHERE ONCE
    const userFlashcards = await db
      .select({
        id: flashcards.id,
        front: flashcards.front,
        back: flashcards.back,
        topic: flashcards.topic,
        last_studied: flashcards.last_studied,
        next_due: flashcards.next_due,
        interval_days: flashcards.interval_days,
        ease_factor: flashcards.ease_factor,
        repetition: flashcards.repetition,
        created_at: flashcards.created_at,
        syllabus: {
          id: syllabi.id,
          title: syllabi.title,
          subject: syllabi.subject,
        },
      })
      .from(flashcards)
      .leftJoin(syllabi, eq(flashcards.syllabus_id, syllabi.id))
      .where(and(...conditions));

    return NextResponse.json({
      success: true,
      flashcards: userFlashcards,
      total: userFlashcards.length,
    });
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch flashcards' },
      { status: 500 }
    );
  }
}
