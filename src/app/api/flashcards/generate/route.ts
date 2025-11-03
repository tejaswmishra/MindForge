import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { flashcards, syllabi, users } from '@/../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { generateFlashcards } from '@/lib/gemini-flashcards';

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { syllabusId, numCards = 10 } = await req.json();

    if (!syllabusId) {
      return NextResponse.json({ success: false, error: 'Syllabus ID required' }, { status: 400 });
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get syllabus content
    const [syllabus] = await db.select().from(syllabi)
      .where(and(
        eq(syllabi.id, syllabusId),
        eq(syllabi.uploaded_by, user.id)
      ))
      .limit(1);

    if (!syllabus) {
      return NextResponse.json({ success: false, error: 'Syllabus not found' }, { status: 404 });
    }

    // Generate flashcards using Gemini AI
    const generatedCards = await generateFlashcards(syllabus.content, numCards);

    // Insert flashcards into database
    const insertedCards = await db.insert(flashcards).values(
      generatedCards.map((card: any) => ({
        user_id: user.id,
        syllabus_id: syllabusId,
        front: card.front,
        back: card.back,
        topic: card.topic || null,
        next_due: new Date(),
      }))
    ).returning();

    return NextResponse.json({
      success: true,
      flashcards: insertedCards,
      message: `Generated ${insertedCards.length} flashcards`
    });

  } catch (error) {
    console.error('Flashcard generation error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate flashcards'
    }, { status: 500 });
  }
}