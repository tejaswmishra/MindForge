import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { db, users } from '@/lib/database';
import { eq } from 'drizzle-orm';
import { useAuth } from '@clerk/nextjs';

export async function POST(req: NextRequest) {
  console.log('=== SYNC USER API ===');
  
  try {
    const { userId } = await auth();
    console.log('Clerk userId:', userId);
    
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerk_id, userId))
      .limit(1);

    if (existingUser) {
      console.log('User already exists:', existingUser.name);
      return NextResponse.json({ success: true, user: existingUser });
    }

    // Create new user
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Could not get user data' }, { status: 400 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress || '';
    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 
                 email.split('@')[0] || 'User';

    console.log('Creating user:', { userId, email, name });

    const [newUser] = await db.insert(users).values({
      clerk_id: userId,
      email: email,
      name: name,
    }).returning();

    console.log('Created user successfully:', newUser);

    return NextResponse.json({ success: true, user: newUser });

  } catch (error: any) {
    console.error('Sync user error:', error);
    return NextResponse.json(
      { error: 'Failed to sync user: ' + error.message },
      { status: 500 }
    );
  }
}