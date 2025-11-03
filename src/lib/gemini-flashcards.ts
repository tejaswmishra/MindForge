// src/lib/gemini-flashcards.ts
import { generateWithFallback } from '@/lib/gemini';

interface Flashcard {
  front: string;
  back: string;
  topic?: string | null;
}

export async function generateFlashcards(
  content: string,
  numCards: number = 10
): Promise<Flashcard[]> {
  
  const prompt = `You are an expert educator creating flashcards for studying. 

Analyze the following educational content and create exactly ${numCards} high-quality flashcards.

CONTENT:
${content.substring(0, 8000)}

INSTRUCTIONS:
1. Create ${numCards} flashcards that cover the most important concepts
2. Each flashcard should have:
   - A clear, concise question or term (front)
   - A comprehensive but focused answer or definition (back)
   - An optional topic category (topic)

3. Make the questions:
   - Specific and testable
   - Focused on one concept per card
   - Varied in difficulty
   - Cover different aspects of the content

4. Make the answers:
   - Clear and complete
   - Concise but thorough
   - Include key details and examples where relevant

OUTPUT FORMAT (STRICT JSON ONLY):
{
  "flashcards": [
    {
      "front": "What is...?",
      "back": "The answer explaining...",
      "topic": "Main Topic Name"
    }
  ]
}

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no additional text.`;

  try {
    // Use the same fallback mechanism as quiz generation
    const text = await generateWithFallback(prompt, { 
      temperature: 0.5  // Slightly higher temperature for creative card generation
    });

    // Parse the JSON response (same pattern as parseQuizResponse)
    const cleanText = text.trim();
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error('No JSON found in response');
    }

    const jsonText = cleanText.slice(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonText);

    if (!parsed.flashcards || !Array.isArray(parsed.flashcards)) {
      throw new Error('Invalid flashcards format in response');
    }

    // Validate and clean the flashcards
    const validFlashcards: Flashcard[] = parsed.flashcards
      .filter((card: any) => card.front && card.back)
      .map((card: any) => ({
        front: card.front.trim(),
        back: card.back.trim(),
        topic: card.topic?.trim() || undefined
      }))
      .slice(0, numCards);

    if (validFlashcards.length === 0) {
      throw new Error('No valid flashcards generated');
    }

    console.log(`✅ Generated ${validFlashcards.length} flashcards`);
    return validFlashcards;

  } catch (error) {
    console.error('Flashcard generation error:', error);
    
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    
    throw new Error('Failed to generate flashcards with AI');
  }
}

// Optional: Helper to generate flashcards for specific topics
export async function generateTopicFlashcards(
  content: string,
  topic: string,
  numCards: number = 5
): Promise<Flashcard[]> {
  const prompt = `You are an expert educator. Create ${numCards} focused flashcards ONLY about "${topic}".

CONTENT:
${content.substring(0, 8000)}

Focus exclusively on the topic: "${topic}"

Return STRICT JSON:
{
  "flashcards": [
    {
      "front": "Question about ${topic}",
      "back": "Answer",
      "topic": "${topic}"
    }
  ]
}`;

  try {
    const text = await generateWithFallback(prompt, { temperature: 0.5 });
    
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    const jsonText = text.slice(jsonStart, jsonEnd);
    const parsed = JSON.parse(jsonText);

    if (!parsed.flashcards || !Array.isArray(parsed.flashcards)) {
      throw new Error('Invalid flashcards format');
    }

    return parsed.flashcards
      .filter((card: any) => card.front && card.back)
      .map((card: any) => ({
        front: card.front.trim(),
        back: card.back.trim(),
        topic: topic
      }))
      .slice(0, numCards);

  } catch (error) {
    console.error('Topic flashcard generation error:', error);
    throw new Error(`Failed to generate flashcards for topic: ${topic}`);
  }
}