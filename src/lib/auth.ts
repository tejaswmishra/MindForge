import { auth } from '@clerk/nextjs/server';
import { db, users } from '@/lib/database';
import { eq } from 'drizzle-orm';

export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerk_id, userId))
      .limit(1);

    return user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}