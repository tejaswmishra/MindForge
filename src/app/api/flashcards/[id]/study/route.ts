// src/app/api/flashcards/[id]/study/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { flashcards, users } from '@/../drizzle/schema';
import { eq, and } from 'drizzle-orm';

// Spaced repetition algorithm (SM-2)
function calculateNextReview(quality: number, repetition: number, easeFactor: number, intervalDays: number) {
  let newEaseFactor = easeFactor;
  let newRepetition = repetition;
  let newInterval = intervalDays;

  if (quality >= 3) {
    // Correct response
    if (newRepetition === 0) {
      newInterval = 1;
    } else if (newRepetition === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(intervalDays * (easeFactor / 100));
    }
    newRepetition += 1;
  } else {
    // Incorrect response
    newRepetition = 0;
    newInterval = 1;
  }

  // Update ease factor
  newEaseFactor = Math.max(130, easeFactor + (8 - 5 * quality) * 10);

  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + newInterval);

  return {
    interval_days: newInterval,
    repetition: newRepetition,
    ease_factor: newEaseFactor,
    next_due: nextDue
  };
}

export async function POST(
  req: Request,
  { params }:  { params: Promise<{ id: string }> }  
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { quality } = await req.json(); // 0-5 rating (0=complete blackout, 5=perfect)

    if (quality < 0 || quality > 5) {
      return NextResponse.json({ success: false, error: 'Quality must be between 0 and 5' }, { status: 400 });
    }

    // Get user from database
    const [user] = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get flashcard
    const [card] = await db.select().from(flashcards)
      .where(and(
        eq(flashcards.id, (await params).id),
        eq(flashcards.user_id, user.id)
      ))
      .limit(1);

    if (!card) {
      return NextResponse.json({ success: false, error: 'Flashcard not found' }, { status: 404 });
    }

    // Calculate next review using spaced repetition
    const nextReview = calculateNextReview(
      quality,
      card.repetition || 0,
      card.ease_factor || 250,
      card.interval_days || 1
    );

    // Update flashcard
    const [updatedCard] = await db.update(flashcards)
      .set({
        last_studied: new Date(),
        ...nextReview,
        updated_at: new Date()
      })
      .where(eq(flashcards.id, (await params).id))
      .returning();

    return NextResponse.json({
      success: true,
      flashcard: updatedCard,
      nextDueIn: nextReview.interval_days
    });

  } catch (error) {
    console.error('Error updating flashcard:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update flashcard'
    }, { status: 500 });
  }
}