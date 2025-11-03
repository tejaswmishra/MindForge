import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { extractTextFromFile, validateFile } from '@/lib/fileProcessor';
import { db, users, syllabi } from '@/lib/database';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerk_id, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const subject = formData.get('subject') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    console.log('Processing file:', file.name, 'Type:', file.type);

    // Extract text content
    const content = await extractTextFromFile(file);
    
    if (content.trim().length < 10) {
      return NextResponse.json({ 
        error: 'Could not extract meaningful content from file' 
      }, { status: 400 });
    }

    console.log('Extracted content length:', content.length);

    // Save to database
    const [newSyllabus] = await db.insert(syllabi).values({
      title: title || file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      content: content.trim(),
      subject: subject || null,
      file_type: getFileType(file.type),
      uploaded_by: user.id,
    }).returning();

    console.log('Saved syllabus:', newSyllabus.id);

    return NextResponse.json({ 
      success: true, 
      syllabus: newSyllabus,
      contentPreview: content.substring(0, 200) + '...'
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file: ' + error.message }, 
      { status: 500 }
    );
  }
}

function getFileType(mimeType: string): 'pdf' | 'docx' | 'text' {
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  return 'text';
}