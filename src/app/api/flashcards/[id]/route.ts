// src/app/api/flashcards/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/database';
import { flashcards, users } from '@/../drizzle/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const [user] = await db.select().from(users).where(eq(users.clerk_id, userId)).limit(1);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    await db.delete(flashcards)
      .where(and(
        eq(flashcards.id, params.id),
        eq(flashcards.user_id, user.id)
      ));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting flashcard:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete flashcard'
    }, { status: 500 });
  }
}