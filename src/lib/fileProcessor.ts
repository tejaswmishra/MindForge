import mammoth from 'mammoth';

// Dynamic import for pdf-parse to avoid import-time issues
async function parsePDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Dynamic import to avoid build-time issues
    const pdfParse = (await import('pdf-parse')).default;
    const pdfData = await pdfParse(Buffer.from(buffer));
    return pdfData.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  
  try {
    switch (file.type) {
      case 'application/pdf':
        console.log('Processing PDF...');
        return await parsePDF(buffer);
        
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        console.log('Processing DOCX...');
        const result = await mammoth.extractRawText({ buffer: Buffer.from(buffer) });
        return result.value;
        
      case 'text/plain':
        console.log('Processing TXT...');
        return new TextDecoder().decode(buffer);
        
      default:
        throw new Error(`Unsupported file type: ${file.type}`);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error('Failed to extract text from file');
  }
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large (max 10MB)' };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Use PDF, DOCX, or TXT files.' };
  }

  return { valid: true };
}