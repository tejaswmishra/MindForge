import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db, syllabi } from '@/lib/database';
import { eq, desc } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all syllabi for this user
    const userSyllabi = await db
      .select({
        id: syllabi.id,
        title: syllabi.title,
        subject: syllabi.subject,
        created_at: syllabi.created_at,
      })
      .from(syllabi)
      .where(eq(syllabi.uploaded_by, user.id))
      .orderBy(desc(syllabi.created_at));

    return NextResponse.json({
      success: true,
      syllabi: userSyllabi,
    });
  } catch (error: any) {
    console.error('Error fetching syllabi:', error);
    return NextResponse.json(
      { error: 'Failed to fetch syllabi' },
      { status: 500 }
    );
  }
}